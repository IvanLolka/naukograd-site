const express = require("express");
const asyncHandler = require("../lib/async-handler");
const { requireAuth } = require("../middleware/auth");
const prisma = require("../lib/prisma");
const { decryptText } = require("../lib/encryption");

const router = express.Router();

router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const me = await prisma.user.findUnique({
      where: { id: req.auth.userId },
      include: {
        profile: true,
      },
    });

    res.json({
      user: {
        id: me.id,
        email: me.email,
        role: me.role,
        status: me.status,
        isEmailVerified: me.isEmailVerified,
        createdAt: me.createdAt,
        profile: me.profile
          ? {
              displayName: me.profile.displayName,
              phone: decryptText(me.profile.phoneEncrypted),
            }
          : null,
      },
    });
  })
);

router.get(
  "/orders",
  asyncHandler(async (req, res) => {
    const orders = await prisma.order.findMany({
      where: { userId: req.auth.userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
        payments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    res.json({ orders });
  })
);

router.get(
  "/bookings",
  asyncHandler(async (req, res) => {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.auth.userId },
      orderBy: { createdAt: "desc" },
      include: {
        excursion: {
          select: {
            id: true,
            slug: true,
            title: true,
            durationMinutes: true,
          },
        },
        slot: {
          select: {
            id: true,
            startsAt: true,
            endsAt: true,
            status: true,
          },
        },
        orderItem: {
          select: {
            id: true,
            order: {
              select: {
                id: true,
                publicId: true,
                status: true,
              },
            },
          },
        },
      },
    });

    res.json({ bookings });
  })
);

module.exports = router;
