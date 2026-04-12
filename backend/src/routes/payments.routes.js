const { randomUUID } = require("crypto");
const express = require("express");
const { Prisma } = require("@prisma/client");
const { z } = require("zod");
const prisma = require("../lib/prisma");
const asyncHandler = require("../lib/async-handler");
const HttpError = require("../lib/http-error");
const { sha256 } = require("../lib/hash");
const env = require("../config/env");

const router = express.Router();

const webhookSchema = z
  .object({
    provider: z.enum(["YOOKASSA", "TINKOFF", "STRIPE", "MANUAL"]),
    providerEventId: z.string().min(3).max(256),
    eventType: z.string().min(3).max(128),
    paymentId: z.string().uuid().optional(),
    providerPaymentId: z.string().min(3).max(256).optional(),
    status: z.enum([
      "CREATED",
      "PENDING",
      "SUCCEEDED",
      "FAILED",
      "CANCELLED",
      "REFUNDED",
      "PARTIALLY_REFUNDED",
    ]),
    amountCents: z.number().int().positive().optional(),
    currency: z.string().min(3).max(3).optional(),
    metadata: z.record(z.any()).optional(),
  })
  .refine((value) => value.paymentId || value.providerPaymentId, {
    message: "paymentId or providerPaymentId is required",
  });

async function ensureBookingsForPaidOrder(tx, orderId) {
  const order = await tx.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
    },
  });

  if (!order) {
    throw new HttpError(404, "ORDER_NOT_FOUND", "Order not found");
  }

  if (!order.userId) {
    throw new HttpError(
      409,
      "ORDER_OWNER_REQUIRED",
      "Paid order must have an owner to create bookings"
    );
  }

  for (const item of order.items) {
    if (item.type !== "EXCURSION_TICKET" || !item.excursionId || !item.slotId) {
      continue;
    }

    const existingBooking = await tx.booking.findUnique({
      where: { orderItemId: item.id },
    });

    if (existingBooking) {
      continue;
    }

    const slot = await tx.excursionSlot.findUnique({
      where: { id: item.slotId },
    });

    if (!slot || slot.status !== "OPEN") {
      throw new HttpError(
        409,
        "SLOT_NOT_AVAILABLE",
        "Excursion slot is not available anymore"
      );
    }

    if (slot.reservedSeats + item.quantity > slot.capacity) {
      throw new HttpError(409, "NOT_ENOUGH_SEATS", "Not enough seats in slot");
    }

    await tx.booking.create({
      data: {
        userId: order.userId,
        orderItemId: item.id,
        excursionId: item.excursionId,
        slotId: item.slotId,
        attendeesCount: item.quantity,
        status: "CONFIRMED",
        attendeeDataEncrypted: null,
        confirmationCodeHash: sha256(randomUUID()),
      },
    });

    await tx.excursionSlot.update({
      where: { id: slot.id },
      data: {
        reservedSeats: {
          increment: item.quantity,
        },
      },
    });
  }
}

router.post(
  "/webhook",
  asyncHandler(async (req, res) => {
    if (
      env.paymentWebhookSecret &&
      req.get("x-webhook-secret") !== env.paymentWebhookSecret
    ) {
      throw new HttpError(401, "INVALID_WEBHOOK_SIGNATURE", "Invalid webhook secret");
    }

    const payload = webhookSchema.parse(req.body);

    let event;
    try {
      event = await prisma.paymentEvent.create({
        data: {
          provider: payload.provider,
          providerEventId: payload.providerEventId,
          eventType: payload.eventType,
          payload: payload,
          processingStatus: "RECEIVED",
          signatureHash: req.get("x-signature")
            ? sha256(req.get("x-signature"))
            : null,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return res.json({ ok: true, duplicate: true });
      }
      throw error;
    }

    try {
      await prisma.$transaction(async (tx) => {
        const payment = payload.paymentId
          ? await tx.payment.findUnique({
              where: { id: payload.paymentId },
            })
          : await tx.payment.findFirst({
              where: {
                provider: payload.provider,
                providerPaymentId: payload.providerPaymentId,
              },
            });

        if (!payment) {
          throw new HttpError(404, "PAYMENT_NOT_FOUND", "Payment not found");
        }

        const nextPaymentData = {
          status: payload.status,
          failureCode: null,
          failureMessage: null,
          metadata: payload.metadata || {},
        };

        if (payload.status === "SUCCEEDED") {
          nextPaymentData.paidAt = new Date();
        }
        if (payload.status === "REFUNDED" || payload.status === "PARTIALLY_REFUNDED") {
          nextPaymentData.refundedAt = new Date();
        }
        if (payload.status === "FAILED") {
          nextPaymentData.failureCode = "PAYMENT_FAILED";
          nextPaymentData.failureMessage = "Payment reported as failed by provider";
        }

        await tx.payment.update({
          where: { id: payment.id },
          data: nextPaymentData,
        });

        if (payload.status === "SUCCEEDED") {
          await tx.order.update({
            where: { id: payment.orderId },
            data: {
              status: "PAID",
              paidAt: new Date(),
            },
          });
          await ensureBookingsForPaidOrder(tx, payment.orderId);
        } else if (payload.status === "REFUNDED") {
          await tx.order.update({
            where: { id: payment.orderId },
            data: { status: "REFUNDED" },
          });
        } else if (payload.status === "PARTIALLY_REFUNDED") {
          await tx.order.update({
            where: { id: payment.orderId },
            data: { status: "PARTIALLY_REFUNDED" },
          });
        } else if (payload.status === "FAILED" || payload.status === "CANCELLED") {
          await tx.order.updateMany({
            where: {
              id: payment.orderId,
              status: {
                in: ["PENDING_PAYMENT", "CART"],
              },
            },
            data: { status: "CANCELLED" },
          });
        }

        await tx.paymentEvent.update({
          where: { id: event.id },
          data: {
            processingStatus: "PROCESSED",
            processedAt: new Date(),
            paymentId: payment.id,
          },
        });
      });

      return res.json({ ok: true });
    } catch (error) {
      await prisma.paymentEvent.update({
        where: { id: event.id },
        data: {
          processingStatus: "FAILED",
          errorMessage: String(error.message || error),
          processedAt: new Date(),
        },
      });
      throw error;
    }
  })
);

module.exports = router;
