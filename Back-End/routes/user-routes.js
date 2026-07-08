const express = require("express");
const router = express.Router();

const {
  getUserById,
  searchUsers,
  updateMe,
  changePassword,
  updateProfilePicture,
  updateCoverPicture,
  deleteMe,
} = require("../controllers/user-controller");
const authenticate = require("../middlewares/authenticate");
const { uploadProfileImages } = require("../utils/multer");

router.use(authenticate);

router.get("/", searchUsers);
router.put("/me", updateMe);
router.put("/me/password", changePassword);
router.put("/me/profile-picture", uploadProfileImages.single("profilePicture"), updateProfilePicture);
router.put("/me/cover-picture", uploadProfileImages.single("coverPicture"), updateCoverPicture);
router.delete("/me", deleteMe);
router.get("/:id", getUserById);

module.exports = router;
