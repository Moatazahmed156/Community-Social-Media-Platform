const fs = require("fs").promises;
const path = require("path");
const HttpError = require("./HttpError");

const UPLOADS_DIR = path.resolve("uploads");

const safeUnlink = async (filename) => {
  const safeName = path.basename(filename);
  const resolved = path.resolve(UPLOADS_DIR, safeName);
  if (!resolved.startsWith(UPLOADS_DIR + path.sep)) {
    throw new HttpError("Invalid file path.").BadRequest();
  }

  try {
    await fs.unlink(resolved);
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }
};

module.exports = safeUnlink;