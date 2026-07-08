const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  createComment,
  listComments,
  deleteComment,
} = require("../controllers/comment-controller");
const authenticate = require("../middlewares/authenticate");
const authorizeGroupRoles = require("../middlewares/authorize");
const resolvePostGroup = require("../middlewares/resolvePostGroup");

router.use(authenticate);
router.use(resolvePostGroup);
router.use(authorizeGroupRoles("owner", "admin", "member"));

router.post("/", createComment);
router.get("/", listComments);
router.delete("/:commentId", deleteComment);

module.exports = router;
