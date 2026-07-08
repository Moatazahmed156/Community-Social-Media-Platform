const multer = require("multer");

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errorDetail = err.isValidationError ? err.error : undefined;

  if (err instanceof multer.MulterError) {
    statusCode = 400;
    message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Uploaded file is too large."
        : `Upload error: ${err.message}`;
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.name === "ValidationError" && err.errors) {
    statusCode = 422;
    message = "Validation failed.";
    errorDetail = Object.values(err.errors).map((e) => e.message);
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0];
    message = field ? `${field} already in use.` : "Duplicate value.";
  }

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    error: errorDetail,
  });
};

module.exports = errorHandler;
