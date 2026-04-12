const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

function normalizeEmail(email) {
  return email.trim().toLowerCase()
}

async function main() {
  const adminEmail = 'admin@naukograd.local'
  const visitorEmail = 'student@naukograd.local'

  const admin = await prisma.user.upsert({
    where: { emailNormalized: normalizeEmail(adminEmail) },
    update: {
      role: 'ADMIN',
      status: 'ACTIVE',
      isEmailVerified: true,
      emailVerifiedAt: new Date('2026-01-01T00:00:00.000Z'),
    },
    create: {
      email: adminEmail,
      emailNormalized: normalizeEmail(adminEmail),
      passwordHash: 'argon2id$seed$change_me_before_production',
      role: 'ADMIN',
      status: 'ACTIVE',
      isEmailVerified: true,
      emailVerifiedAt: new Date('2026-01-01T00:00:00.000Z'),
      profile: {
        create: {
          displayName: 'Naukograd Admin',
        },
      },
    },
  })

  const visitor = await prisma.user.upsert({
    where: { emailNormalized: normalizeEmail(visitorEmail) },
    update: {
      role: 'VISITOR',
      status: 'ACTIVE',
    },
    create: {
      email: visitorEmail,
      emailNormalized: normalizeEmail(visitorEmail),
      passwordHash: 'argon2id$seed$change_me_before_production',
      role: 'VISITOR',
      status: 'ACTIVE',
      isEmailVerified: true,
      emailVerifiedAt: new Date('2026-01-01T00:00:00.000Z'),
      profile: {
        create: {
          displayName: 'Demo Visitor',
        },
      },
    },
  })

  await prisma.consent.upsert({
    where: {
      userId_kind_documentVersion: {
        userId: visitor.id,
        kind: 'PERSONAL_DATA',
        documentVersion: 'v1.0',
      },
    },
    update: {
      acceptedAt: new Date('2026-01-02T08:00:00.000Z'),
    },
    create: {
      userId: visitor.id,
      kind: 'PERSONAL_DATA',
      documentVersion: 'v1.0',
      acceptedAt: new Date('2026-01-02T08:00:00.000Z'),
      ipHash: 'seed_ip_hash',
      userAgentHash: 'seed_user_agent_hash',
    },
  })

  const hero = await prisma.mediaAsset.upsert({
    where: { storageKey: 'seed/naukograd-hero.jpg' },
    update: {
      publicUrl: 'https://example.com/naukograd-hero.jpg',
      uploadedById: admin.id,
    },
    create: {
      storageKey: 'seed/naukograd-hero.jpg',
      publicUrl: 'https://example.com/naukograd-hero.jpg',
      mimeType: 'image/jpeg',
      sizeBytes: 180000,
      checksumSha256: 'seed_checksum_sha256',
      uploadedById: admin.id,
    },
  })

  await prisma.contentPage.upsert({
    where: { slug: 'about-naukograd' },
    update: {
      title: 'About Naukograd',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-01-05T09:00:00.000Z'),
      updatedById: admin.id,
      heroImageId: hero.id,
      content: {
        sections: [
          {
            title: 'Mission',
            text: 'Naukograd introduces school and university students to science through interactive exhibits.',
          },
          {
            title: 'For Visitors',
            text: 'You can book excursions, read about exhibits, and track your orders in your account.',
          },
        ],
      },
    },
    create: {
      slug: 'about-naukograd',
      title: 'About Naukograd',
      summary: 'Scientific space inside MFUA with interactive exhibits and guided tours.',
      status: 'PUBLISHED',
      publishedAt: new Date('2026-01-05T09:00:00.000Z'),
      heroImageId: hero.id,
      createdById: admin.id,
      updatedById: admin.id,
      content: {
        sections: [
          {
            title: 'Mission',
            text: 'Naukograd introduces school and university students to science through interactive exhibits.',
          },
          {
            title: 'For Visitors',
            text: 'You can book excursions, read about exhibits, and track your orders in your account.',
          },
        ],
      },
    },
  })

  await prisma.exhibit.upsert({
    where: { slug: 'tesla-coil-lab' },
    update: {
      title: 'Tesla Coil Lab',
      status: 'PUBLISHED',
      description: 'Safe demonstration of high-voltage phenomena with educational explanations.',
      coverImageId: hero.id,
    },
    create: {
      slug: 'tesla-coil-lab',
      title: 'Tesla Coil Lab',
      teaser: 'Electricity and resonance in action.',
      description: 'Safe demonstration of high-voltage phenomena with educational explanations.',
      content: {
        facts: [
          'The exhibit visualizes resonance principles.',
          'Visitors can watch controlled electric arcs.',
        ],
      },
      locationLabel: 'Hall A',
      isInteractive: true,
      status: 'PUBLISHED',
      coverImageId: hero.id,
    },
  })

  const excursion = await prisma.excursion.upsert({
    where: { slug: 'physics-lab-tour' },
    update: {
      title: 'Physics Lab Tour',
      status: 'PUBLISHED',
      basePriceCents: 120000,
      durationMinutes: 90,
      capacityPerSlot: 20,
    },
    create: {
      slug: 'physics-lab-tour',
      title: 'Physics Lab Tour',
      shortDescription: 'Guided tour around key science exhibits.',
      description: 'A guided tour with practical demonstrations for groups and individual visitors.',
      durationMinutes: 90,
      basePriceCents: 120000,
      currency: 'RUB',
      capacityPerSlot: 20,
      minAge: 12,
      status: 'PUBLISHED',
    },
  })

  const slotOne = await prisma.excursionSlot.upsert({
    where: {
      excursionId_startsAt: {
        excursionId: excursion.id,
        startsAt: new Date('2026-05-10T09:00:00.000Z'),
      },
    },
    update: {
      endsAt: new Date('2026-05-10T10:30:00.000Z'),
      capacity: 20,
      status: 'OPEN',
    },
    create: {
      excursionId: excursion.id,
      startsAt: new Date('2026-05-10T09:00:00.000Z'),
      endsAt: new Date('2026-05-10T10:30:00.000Z'),
      capacity: 20,
      reservedSeats: 1,
      status: 'OPEN',
      guideId: admin.id,
    },
  })

  await prisma.excursionSlot.upsert({
    where: {
      excursionId_startsAt: {
        excursionId: excursion.id,
        startsAt: new Date('2026-05-10T12:00:00.000Z'),
      },
    },
    update: {
      endsAt: new Date('2026-05-10T13:30:00.000Z'),
      capacity: 20,
      status: 'OPEN',
    },
    create: {
      excursionId: excursion.id,
      startsAt: new Date('2026-05-10T12:00:00.000Z'),
      endsAt: new Date('2026-05-10T13:30:00.000Z'),
      capacity: 20,
      status: 'OPEN',
      guideId: admin.id,
    },
  })

  await prisma.order.upsert({
    where: { publicId: 'demo-order-001' },
    update: {
      userId: visitor.id,
      status: 'PAID',
      subtotalAmountCents: 120000,
      totalAmountCents: 120000,
      paidAt: new Date('2026-03-01T10:20:00.000Z'),
    },
    create: {
      publicId: 'demo-order-001',
      userId: visitor.id,
      status: 'PAID',
      currency: 'RUB',
      subtotalAmountCents: 120000,
      discountAmountCents: 0,
      totalAmountCents: 120000,
      paidAt: new Date('2026-03-01T10:20:00.000Z'),
      items: {
        create: [
          {
            type: 'EXCURSION_TICKET',
            titleSnapshot: 'Physics Lab Tour',
            quantity: 1,
            unitPriceCents: 120000,
            totalPriceCents: 120000,
            excursionId: excursion.id,
            slotId: slotOne.id,
          },
        ],
      },
      payments: {
        create: [
          {
            provider: 'YOOKASSA',
            providerPaymentId: 'seed-payment-0001',
            idempotencyKey: 'seed-demo-order-001',
            status: 'SUCCEEDED',
            amountCents: 120000,
            currency: 'RUB',
            paidAt: new Date('2026-03-01T10:20:00.000Z'),
            metadata: {
              source: 'seed',
            },
          },
        ],
      },
    },
  })

  const paidOrder = await prisma.order.findUnique({
    where: { publicId: 'demo-order-001' },
    include: { items: true },
  })

  if (paidOrder && paidOrder.items.length > 0) {
    const firstItem = paidOrder.items[0]

    await prisma.booking.upsert({
      where: { orderItemId: firstItem.id },
      update: {
        userId: visitor.id,
        excursionId: excursion.id,
        slotId: slotOne.id,
        attendeesCount: 1,
        status: 'CONFIRMED',
      },
      create: {
        userId: visitor.id,
        orderItemId: firstItem.id,
        excursionId: excursion.id,
        slotId: slotOne.id,
        attendeesCount: 1,
        attendeeDataEncrypted: 'seed_encrypted_attendee_data',
        status: 'CONFIRMED',
        confirmationCodeHash: 'seed_confirmation_hash_demo_order_001',
      },
    })
  }

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: 'SEED_COMPLETED',
      entityType: 'System',
      entityId: 'database',
      severity: 'INFO',
      details: {
        users: 2,
        excursionSlug: 'physics-lab-tour',
      },
    },
  })

  console.log('Seed completed successfully.')
}

main()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
