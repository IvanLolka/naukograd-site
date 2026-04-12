const { randomUUID } = require("crypto");
const express = require("express");
const { z } = require("zod");
const prisma = require("../lib/prisma");
const asyncHandler = require("../lib/async-handler");
const HttpError = require("../lib/http-error");
const { requireAuth } = require("../middleware/auth");
const { encryptText } = require("../lib/encryption");
const { getOwnedOrderOrThrow, recalcOrderTotals } = require("../services/order.service");

const router = express.Router();

const createOrderSchema = z.object({
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().trim().min(5).max(32).optional(),
});

const addOrderItemSchema = z.object({
  excursionId: z.string().uuid(),
  slotId: z.string().uuid(),
  quantity: z.number().int().min(1).max(20).default(1),
});

const createPaymentSchema = z.object({
  provider: z
    .enum(["YOOKASSA", "TINKOFF", "STRIPE", "MANUAL"])
    .default("YOOKASSA"),
});

router.use(requireAuth);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const payload = createOrderSchema.parse(req.body || {});

    const order = await prisma.order.create({
      data: {
        userId: req.auth.userId,
        status: "CART",
        currency: "RUB",
        contactEmailEncrypted: payload.contactEmail
          ? encryptText(payload.contactEmail)
          : null,
        contactPhoneEncrypted: payload.contactPhone
          ? encryptText(payload.contactPhone)
          : null,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      include: {
        items: true,
        payments: true,
      },
    });

    res.status(201).json({ order });
  })
);

router.post(
  "/:orderId/items",
  asyncHandler(async (req, res) => {
    const payload = addOrderItemSchema.parse(req.body);

    const data = await prisma.$transaction(async (tx) => {
      const order = await getOwnedOrderOrThrow(tx, req.params.orderId, req.auth.userId);

      if (order.status !== "CART") {
        throw new HttpError(
          409,
          "ORDER_NOT_EDITABLE",
          "Only cart orders can be edited"
        );
      }

      const excursion = await tx.excursion.findFirst({
        where: {
          id: payload.excursionId,
          status: "PUBLISHED",
        },
      });
      if (!excursion) {
        throw new HttpError(404, "EXCURSION_NOT_FOUND", "Excursion not found");
      }

      const slot = await tx.excursionSlot.findFirst({
        where: {
          id: payload.slotId,
          excursionId: excursion.id,
          status: "OPEN",
          startsAt: { gte: new Date() },
        },
      });
      if (!slot) {
        throw new HttpError(404, "SLOT_NOT_FOUND", "Excursion slot not found");
      }

      if (slot.reservedSeats + payload.quantity > slot.capacity) {
        throw new HttpError(
          409,
          "NOT_ENOUGH_SEATS",
          "Not enough free seats for this slot"
        );
      }

      const unitPrice = excursion.basePriceCents;
      await tx.orderItem.create({
        data: {
          orderId: order.id,
          type: "EXCURSION_TICKET",
          titleSnapshot: excursion.title,
          quantity: payload.quantity,
          unitPriceCents: unitPrice,
          totalPriceCents: unitPrice * payload.quantity,
          excursionId: excursion.id,
          slotId: slot.id,
        },
      });

      return recalcOrderTotals(tx, order.id);
    });

    res.status(201).json({ order: data });
  })
);

router.post(
  "/:orderId/payments",
  asyncHandler(async (req, res) => {
    const payload = createPaymentSchema.parse(req.body || {});

    const data = await prisma.$transaction(async (tx) => {
      const order = await getOwnedOrderOrThrow(tx, req.params.orderId, req.auth.userId, {
        items: true,
        payments: true,
      });

      if (!order.items.length) {
        throw new HttpError(409, "EMPTY_ORDER", "Order is empty");
      }

      if (order.status === "PAID") {
        throw new HttpError(409, "ORDER_ALREADY_PAID", "Order is already paid");
      }

      if (order.totalAmountCents <= 0) {
        throw new HttpError(409, "INVALID_ORDER_TOTAL", "Invalid order amount");
      }

      const providerPaymentId = `sandbox-${randomUUID()}`;
      const payment = await tx.payment.create({
        data: {
          orderId: order.id,
          provider: payload.provider,
          providerPaymentId,
          idempotencyKey: randomUUID(),
          status: "PENDING",
          amountCents: order.totalAmountCents,
          currency: order.currency,
          metadata: {
            mode: "sandbox",
          },
        },
      });

      await tx.order.update({
        where: { id: order.id },
        data: {
          status: "PENDING_PAYMENT",
        },
      });

      return {
        payment,
        paymentUrl: `https://sandbox-pay.local/checkout/${providerPaymentId}`,
      };
    });

    res.status(201).json(data);
  })
);

module.exports = router;
