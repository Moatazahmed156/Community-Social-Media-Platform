const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  createPost,
  listPosts,
  getPostById,
  updatePost,
  approvePost,
  rejectPost,
  deletePost,
} = require("../controllers/post-controller");
const authenticate = require("../middlewares/authenticate");
const authorizeGroupRoles = require("../middlewares/authorize");
const { uploadPostImages } = require("../utils/multer");

const anyMember = authorizeGroupRoles("owner", "admin", "member");
const moderatorOnly = authorizeGroupRoles("owner", "admin");

router.use(authenticate);

router.post("/", anyMember, uploadPostImages.array("images", 5), createPost);
router.get("/", anyMember, listPosts);
router.get("/:postId", anyMember, getPostById);
router.put("/:postId", anyMember, updatePost);
router.patch("/:postId/approve", moderatorOnly, approvePost);
router.patch("/:postId/reject", moderatorOnly, rejectPost);
router.delete("/:postId", anyMember, deletePost);

module.exports = router;
