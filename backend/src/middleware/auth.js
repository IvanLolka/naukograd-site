const prisma = require("../lib/prisma");
const HttpError = require("../lib/http-error");
const { verifyAccessToken } = require("../lib/tokens");

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new HttpError(401, "UNAUTHORIZED", "Access token is required");
    }

    const payload = verifyAccessToken(token);
    if (!payload || payload.type !== "access" || !payload.sub) {
      throw new HttpError(401, "UNAUTHORIZED", "Invalid access token");
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { profile: true },
    });

    if (!user || user.deletedAt) {
      throw new HttpError(401, "UNAUTHORIZED", "User is not available");
    }

    if (user.status !== "ACTIVE") {
      throw new HttpError(403, "ACCOUNT_BLOCKED", "Account is blocked");
    }

    req.auth = {
      userId: user.id,
      role: user.role,
      sessionId: payload.sid || null,
    };
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
}

function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.auth || !allowedRoles.includes(req.auth.role)) {
      return next(new HttpError(403, "FORBIDDEN", "Not enough permissions"));
    }
    return next();
  };
}

module.exports = {
  requireAuth,
  requireRole,
};
