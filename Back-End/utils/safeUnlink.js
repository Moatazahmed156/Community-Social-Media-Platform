const fs = require("fs").promises;
const path = require("path");
const HttpError = require("./HttpError");

const UPLOADS_ROOT = path.resolve("uploads");

const safeUnlink = async (storedPath) => {
  if (!storedPath) return;
  const relative = storedPath.replace(/^\/?uploads\/?/, "");
  const resolved = path.resolve(UPLOADS_ROOT, relative);

  if (!resolved.startsWith(UPLOADS_ROOT + path.sep)) {
    throw new HttpError("Invalid file path.").BadRequest();
  }

  try {
    await fs.unlink(resolved);
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }
};

module.exports = safeUnlink;
