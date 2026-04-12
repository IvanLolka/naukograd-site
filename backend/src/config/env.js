const crypto = require("crypto");

function toInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function parseCorsOrigins(raw) {
  if (!raw) return "*";
  const list = raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return list.length > 0 ? list : "*";
}

function parseEncryptionKey(raw) {
  if (!raw) return null;
  try {
    const buffer = Buffer.from(raw, "base64");
    return buffer.length === 32 ? buffer : null;
  } catch (error) {
    return null;
  }
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: toInt(process.env.PORT, 3000),
  corsOrigin: parseCorsOrigins(process.env.CORS_ORIGIN),
  jwtAccessSecret:
    process.env.JWT_ACCESS_SECRET ||
    crypto.randomBytes(32).toString("hex"),
  accessTokenTtlMinutes: toInt(process.env.ACCESS_TOKEN_TTL_MINUTES, 15),
  refreshTokenTtlDays: toInt(process.env.REFRESH_TOKEN_TTL_DAYS, 30),
  loginMaxAttempts: toInt(process.env.LOGIN_MAX_ATTEMPTS, 5),
  loginBlockMinutes: toInt(process.env.LOGIN_BLOCK_MINUTES, 15),
  consentDocumentVersion: process.env.CONSENT_DOCUMENT_VERSION || "v1.0",
  encryptionKey: parseEncryptionKey(process.env.ENCRYPTION_KEY),
  paymentWebhookSecret: process.env.PAYMENT_WEBHOOK_SECRET || null,
};

if (!process.env.JWT_ACCESS_SECRET) {
  console.warn(
    "JWT_ACCESS_SECRET is not set. Temporary secret is used for this run."
  );
}

if (!env.encryptionKey) {
  console.warn(
    "ENCRYPTION_KEY is missing or invalid (must be 32-byte base64). Sensitive fields will be stored as-is."
  );
}

module.exports = env;
