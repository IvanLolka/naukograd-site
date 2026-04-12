const bcrypt = require("bcryptjs");
const { randomUUID } = require("crypto");
const express = require("express");
const { z } = require("zod");
const prisma = require("../lib/prisma");
const asyncHandler = require("../lib/async-handler");
const HttpError = require("../lib/http-error");
const { encryptText, decryptText } = require("../lib/encryption");
const { normalizeEmail, normalizePhone, sha256 } = require("../lib/hash");
const {
  createRefreshToken,
  parseSessionIdFromRefreshToken,
  signAccessToken,
} = require("../lib/tokens");
const env = require("../config/env");

const router = express.Router();

const registerSchema = z.object({
  email: z.string().email().max(256),
  password: z.string().min(8).max(128),
  displayName: z.string().trim().min(2).max(120).optional(),
  phone: z.string().trim().min(5).max(32).optional(),
  acceptMarketing: z.boolean().optional().default(false),
});

const loginSchema = z.object({
  email: z.string().email().max(256),
  password: z.string().min(8).max(128),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(20),
});

function buildUserResponse(user) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
    profile: user.profile
      ? {
          displayName: user.profile.displayName,
          phone: decryptText(user.profile.phoneEncrypted),
        }
      : null,
  };
}

function resolveClientInfo(req) {
  const ip = req.ip || req.socket?.remoteAddress || null;
  const userAgent = req.get("user-agent") || null;
  return {
    ipHash: ip ? sha256(ip) : null,
    userAgentHash: userAgent ? sha256(userAgent) : null,
  };
}

function getRefreshExpiryDate() {
  const date = new Date();
  date.setDate(date.getDate() + env.refreshTokenTtlDays);
  return date;
}

async function issueSessionAndTokens({ tx, userId, role, req }) {
  const sessionId = randomUUID();
  const refreshToken = createRefreshToken(sessionId);
  const refreshTokenHash = sha256(refreshToken);
  const expiresAt = getRefreshExpiryDate();
  const { ipHash, userAgentHash } = resolveClientInfo(req);

  await tx.userSession.create({
    data: {
      id: sessionId,
      userId,
      refreshTokenHash,
      ipHash,
      userAgentHash,
      expiresAt,
    },
  });

  const accessToken = signAccessToken({
    userId,
    role,
    sessionId,
  });

  return {
    accessToken,
    refreshToken,
    refreshTokenExpiresAt: expiresAt,
  };
}

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const payload = registerSchema.parse(req.body);
    const emailNormalized = normalizeEmail(payload.email);

    const existingUser = await prisma.user.findUnique({
      where: { emailNormalized },
    });
    if (existingUser) {
      throw new HttpError(409, "EMAIL_ALREADY_EXISTS", "Email is already used");
    }

    const passwordHash = await bcrypt.hash(payload.password, 12);
    const normalizedPhone = payload.phone ? normalizePhone(payload.phone) : null;

    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          email: payload.email.trim(),
          emailNormalized,
          passwordHash,
          role: "VISITOR",
          status: "ACTIVE",
          profile: {
            create: {
              displayName: payload.displayName || null,
              phoneEncrypted: payload.phone ? encryptText(payload.phone) : null,
              phoneHash: normalizedPhone ? sha256(normalizedPhone) : null,
            },
          },
          consents: {
            create: [
              {
                kind: "PERSONAL_DATA",
                documentVersion: env.consentDocumentVersion,
                ...resolveClientInfo(req),
              },
              {
                kind: "TERMS_OF_SERVICE",
                documentVersion: env.consentDocumentVersion,
                ...resolveClientInfo(req),
              },
            ],
          },
        },
        include: { profile: true },
      });

      if (payload.acceptMarketing) {
        await tx.consent.create({
          data: {
            userId: created.id,
            kind: "MARKETING",
            documentVersion: env.consentDocumentVersion,
            ...resolveClientInfo(req),
          },
        });
      }

      const tokens = await issueSessionAndTokens({
        tx,
        userId: created.id,
        role: created.role,
        req,
      });

      return { created, tokens };
    });

    res.status(201).json({
      user: buildUserResponse(user.created),
      tokens: user.tokens,
    });
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const payload = loginSchema.parse(req.body);
    const emailNormalized = normalizeEmail(payload.email);

    const user = await prisma.user.findUnique({
      where: { emailNormalized },
      include: { profile: true },
    });

    if (!user || user.deletedAt) {
      throw new HttpError(401, "INVALID_CREDENTIALS", "Invalid email or password");
    }

    if (user.status !== "ACTIVE") {
      throw new HttpError(403, "ACCOUNT_BLOCKED", "Account is blocked");
    }

    if (user.blockedUntil && user.blockedUntil > new Date()) {
      throw new HttpError(
        423,
        "TOO_MANY_ATTEMPTS",
        "Too many failed attempts. Try again later."
      );
    }

    const isValidPassword = await bcrypt.compare(payload.password, user.passwordHash);
    if (!isValidPassword) {
      const failedAttempts = user.failedLoginCount + 1;
      const shouldBlock = failedAttempts >= env.loginMaxAttempts;
      const blockedUntil = shouldBlock
        ? new Date(Date.now() + env.loginBlockMinutes * 60 * 1000)
        : null;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginCount: shouldBlock ? 0 : failedAttempts,
          blockedUntil,
        },
      });

      throw new HttpError(401, "INVALID_CREDENTIALS", "Invalid email or password");
    }

    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.user.update({
        where: { id: user.id },
        data: {
          failedLoginCount: 0,
          blockedUntil: null,
          lastLoginAt: new Date(),
        },
        include: { profile: true },
      });

      const tokens = await issueSessionAndTokens({
        tx,
        userId: updated.id,
        role: updated.role,
        req,
      });

      return { updated, tokens };
    });

    res.json({
      user: buildUserResponse(result.updated),
      tokens: result.tokens,
    });
  })
);

router.post(
  "/refresh",
  asyncHandler(async (req, res) => {
    const payload = refreshSchema.parse(req.body);
    const sessionId = parseSessionIdFromRefreshToken(payload.refreshToken);

    if (!sessionId) {
      throw new HttpError(401, "INVALID_REFRESH_TOKEN", "Invalid refresh token");
    }

    const refreshTokenHash = sha256(payload.refreshToken);

    const data = await prisma.$transaction(async (tx) => {
      const session = await tx.userSession.findUnique({
        where: { id: sessionId },
        include: { user: { include: { profile: true } } },
      });

      if (!session) {
        throw new HttpError(401, "INVALID_REFRESH_TOKEN", "Invalid refresh token");
      }

      if (session.revokedAt || session.expiresAt < new Date()) {
        throw new HttpError(401, "REFRESH_EXPIRED", "Refresh token has expired");
      }

      if (session.refreshTokenHash !== refreshTokenHash) {
        await tx.userSession.update({
          where: { id: session.id },
          data: { revokedAt: new Date() },
        });
        throw new HttpError(401, "INVALID_REFRESH_TOKEN", "Invalid refresh token");
      }

      const rotatedSessionId = randomUUID();
      const newRefreshToken = createRefreshToken(rotatedSessionId);
      const newRefreshTokenHash = sha256(newRefreshToken);
      const expiresAt = getRefreshExpiryDate();
      const { ipHash, userAgentHash } = resolveClientInfo(req);

      await tx.userSession.create({
        data: {
          id: rotatedSessionId,
          userId: session.userId,
          refreshTokenHash: newRefreshTokenHash,
          ipHash,
          userAgentHash,
          expiresAt,
        },
      });

      await tx.userSession.update({
        where: { id: session.id },
        data: {
          revokedAt: new Date(),
          replacedBySessionId: rotatedSessionId,
        },
      });

      const accessToken = signAccessToken({
        userId: session.user.id,
        role: session.user.role,
        sessionId: rotatedSessionId,
      });

      return {
        user: session.user,
        tokens: {
          accessToken,
          refreshToken: newRefreshToken,
          refreshTokenExpiresAt: expiresAt,
        },
      };
    });

    res.json({
      user: buildUserResponse(data.user),
      tokens: data.tokens,
    });
  })
);

router.post(
  "/logout",
  asyncHandler(async (req, res) => {
    const payload = refreshSchema.parse(req.body);
    const sessionId = parseSessionIdFromRefreshToken(payload.refreshToken);

    if (!sessionId) {
      return res.json({ ok: true });
    }

    const refreshTokenHash = sha256(payload.refreshToken);

    await prisma.userSession.updateMany({
      where: {
        id: sessionId,
        refreshTokenHash,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });

    res.json({ ok: true });
  })
);

module.exports = router;
