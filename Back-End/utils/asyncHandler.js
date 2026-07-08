const HttpError = require("../utils/HttpError");

const asyncHandler =
  (fn, errorMessage) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      if (err instanceof HttpError) {
        next(err);
      } else {
        console.error(err);
        next(new HttpError(errorMessage || "Internal Server Error", err));
      }
    });
  };

module.exports = asyncHandler;