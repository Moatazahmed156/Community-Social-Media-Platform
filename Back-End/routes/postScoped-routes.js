const express = require("express");
const router = express.Router({ mergeParams: true });

const commentRoutes = require("./comment-routes");
const reactionRoutes = require("./reaction-routes");

router.use("/:postId/comments", commentRoutes);
router.use("/:postId/reactions", reactionRoutes);

module.exports = router;
