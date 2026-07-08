const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const HttpError = require("./HttpError");
const { MAX_UPLOAD_MB } = require("../config/variables");

const ALLOWED_MIME_TYPES = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const makeUploader = (subfolder) => {
  const uploadPath = path.join("uploads", subfolder);

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },

    filename: function (req, file, cb) {
      const ext = ALLOWED_MIME_TYPES[file.mimetype];
      cb(null, uuidv4() + ext);
    },
  });

  return multer({
    storage,
    limits: { fileSize: MAX_UPLOAD_MB * 1024 * 1024 },
    fileFilter(req, file, cb) {
      if (ALLOWED_MIME_TYPES[file.mimetype]) {
        cb(null, true);
      } else {
        cb(new HttpError("Only JPEG, PNG, and WebP images are allowed.").BadRequest());
      }
    },
  });
};

module.exports = {
  uploadProfileImages: makeUploader("profiles"),
  uploadGroupImages: makeUploader("groups"),
  uploadPostImages: makeUploader("posts"),
};
