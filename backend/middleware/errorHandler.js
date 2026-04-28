// Central error handler — catches all errors passed via next(err)
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
    statusCode = 400;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    statusCode = 400;
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    message = `Invalid ID: ${err.value}`;
    statusCode = 400;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    message = "Invalid token.";
    statusCode = 401;
  }
  if (err.name === "TokenExpiredError") {
    message = "Token expired. Please log in again.";
    statusCode = 401;
  }

  // Bad JSON payload
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    message = "Invalid JSON payload.";
    statusCode = 400;
  }

  // CORS
  if (err.message?.startsWith("CORS blocked")) {
    statusCode = 403;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
