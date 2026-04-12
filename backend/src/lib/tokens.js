const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const env = require("../config/env");

function signAccessToken({ userId, role, sessionId }) {
  return jwt.sign(
    {
      sub: userId,
      role,
      sid: sessionId,
      type: "access",
    },
    env.jwtAccessSecret,
    { expiresIn: `${env.accessTokenTtlMinutes}m` }
  );
}

function verifyAccessToken(token) {
  return jwt.verify(token, env.jwtAccessSecret);
}

function createRefreshToken(sessionId) {
  return `${sessionId}.${crypto.randomBytes(48).toString("base64url")}`;
}

function parseSessionIdFromRefreshToken(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length < 2 || !parts[0]) return null;
  return parts[0];
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
  createRefreshToken,
  parseSessionIdFromRefreshToken,
};
