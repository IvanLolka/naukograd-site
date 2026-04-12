const crypto = require("crypto");
const env = require("../config/env");

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

function encryptText(value) {
  if (value === undefined || value === null || value === "") return null;
  if (!env.encryptionKey) return String(value);

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, env.encryptionKey, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  const encrypted = Buffer.concat([
    cipher.update(String(value), "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return [
    "encv1",
    iv.toString("base64url"),
    authTag.toString("base64url"),
    encrypted.toString("base64url"),
  ].join(".");
}

function decryptText(value) {
  if (!value) return null;
  if (!env.encryptionKey) return String(value);
  if (!String(value).startsWith("encv1.")) return String(value);

  const [, ivPart, tagPart, payloadPart] = String(value).split(".");
  if (!ivPart || !tagPart || !payloadPart) return null;

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    env.encryptionKey,
    Buffer.from(ivPart, "base64url"),
    { authTagLength: AUTH_TAG_LENGTH }
  );
  decipher.setAuthTag(Buffer.from(tagPart, "base64url"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payloadPart, "base64url")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

module.exports = {
  encryptText,
  decryptText,
};
