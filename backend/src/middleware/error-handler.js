const { Prisma } = require("@prisma/client");
const { ZodError } = require("zod");
const HttpError = require("../lib/http-error");

function notFoundHandler(req, res) {
  res.status(404).json({
    error: "Route not found",
    code: "ROUTE_NOT_FOUND",
  });
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof HttpError) {
    return res.status(error.statusCode).json({
      error: error.message,
      code: error.code,
      details: error.details || undefined,
    });
  }

  if (error instanceof ZodError) {
    return res.status(422).json({
      error: "Validation failed",
      code: "VALIDATION_ERROR",
      details: error.issues,
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return res.status(409).json({
        error: "Unique constraint violation",
        code: "CONFLICT",
      });
    }
    if (error.code === "P2025") {
      return res.status(404).json({
        error: "Entity not found",
        code: "NOT_FOUND",
      });
    }
  }

  console.error(error);
  return res.status(500).json({
    error: "Internal server error",
    code: "INTERNAL_ERROR",
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
