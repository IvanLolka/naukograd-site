const express = require("express");
const asyncHandler = require("../lib/async-handler");
const prisma = require("../lib/prisma");
const HttpError = require("../lib/http-error");

const router = express.Router();

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

router.get(
  "/pages/:slug",
  asyncHandler(async (req, res) => {
    const page = await prisma.contentPage.findFirst({
      where: {
        slug: req.params.slug,
        status: "PUBLISHED",
      },
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        content: true,
        publishedAt: true,
        heroImage: {
          select: {
            publicUrl: true,
            mimeType: true,
          },
        },
      },
    });

    if (!page) {
      throw new HttpError(404, "PAGE_NOT_FOUND", "Page not found");
    }

    res.json({ page });
  })
);

router.get(
  "/exhibits",
  asyncHandler(async (req, res) => {
    const exhibits = await prisma.exhibit.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        teaser: true,
        description: true,
        locationLabel: true,
        isInteractive: true,
        coverImage: {
          select: {
            publicUrl: true,
            mimeType: true,
          },
        },
      },
    });

    res.json({ exhibits });
  })
);

router.get(
  "/excursions",
  asyncHandler(async (req, res) => {
    const excursions = await prisma.excursion.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        slug: true,
        title: true,
        shortDescription: true,
        description: true,
        durationMinutes: true,
        basePriceCents: true,
        currency: true,
        capacityPerSlot: true,
        minAge: true,
      },
    });

    res.json({ excursions });
  })
);

router.get(
  "/excursions/:id/slots",
  asyncHandler(async (req, res) => {
    const idOrSlug = req.params.id;
    const excursion = await prisma.excursion.findFirst({
      where: isUuid(idOrSlug)
        ? { id: idOrSlug, status: "PUBLISHED" }
        : { slug: idOrSlug, status: "PUBLISHED" },
      select: {
        id: true,
        slug: true,
        title: true,
      },
    });

    if (!excursion) {
      throw new HttpError(404, "EXCURSION_NOT_FOUND", "Excursion not found");
    }

    const slots = await prisma.excursionSlot.findMany({
      where: {
        excursionId: excursion.id,
        status: "OPEN",
        startsAt: { gte: new Date() },
      },
      orderBy: { startsAt: "asc" },
      select: {
        id: true,
        startsAt: true,
        endsAt: true,
        status: true,
        capacity: true,
        reservedSeats: true,
      },
    });

    res.json({
      excursion,
      slots: slots.map((slot) => ({
        ...slot,
        availableSeats: Math.max(slot.capacity - slot.reservedSeats, 0),
      })),
    });
  })
);

module.exports = router;
