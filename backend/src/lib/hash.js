const crypto = require("crypto");

function sha256(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex");
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizePhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits || null;
}

module.exports = {
  sha256,
  normalizeEmail,
  normalizePhone,
};
