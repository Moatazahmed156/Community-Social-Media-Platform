const express = require("express");
const router = express.Router();

const {
  createGroup,
  listGroups,
  getMyGroups,
  getGroupById,
  updateGroup,
  updateGroupLogo,
  updateGroupCover,
  deleteGroup,
} = require("../controllers/group-controller");
const authenticate = require("../middlewares/authenticate");
const authorizeGroupRoles = require("../middlewares/authorize");
const { uploadGroupImages } = require("../utils/multer");

const memberRoutes = require("./groupMember-routes");
const postRoutes = require("./post-routes");

router.use(authenticate);

router.post("/", createGroup);
router.get("/", listGroups);
router.get("/mine", getMyGroups);
router.get("/:groupId", getGroupById);
router.put("/:groupId", authorizeGroupRoles("owner", "admin"), updateGroup);
router.put(
  "/:groupId/logo",
  authorizeGroupRoles("owner", "admin"),
  uploadGroupImages.single("logo"),
  updateGroupLogo
);
router.put(
  "/:groupId/cover",
  authorizeGroupRoles("owner", "admin"),
  uploadGroupImages.single("cover"),
  updateGroupCover
);
router.delete("/:groupId", authorizeGroupRoles("owner"), deleteGroup);

router.use("/:groupId/members", memberRoutes);
router.use("/:groupId/posts", postRoutes);

module.exports = router;
