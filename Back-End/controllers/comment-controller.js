const Comment = require("../models/comments-model");
const Notification = require("../models/notifications-model");
const HttpError = require("../utils/HttpError");
const asyncHandler = require("../utils/asyncHandler");

const ensurePostIsVisible = (post, userId, groupRole) => {
  const isModerator = ["owner", "admin"].includes(groupRole);
  const isAuthor = String(post.authorId) === String(userId);
  if (post.status !== "approved" && !isModerator && !isAuthor) {
    throw new HttpError("This post is not available yet.").Forbidden();
  }
};

// @route  POST /api/posts/:postId/comments
const createComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content) throw new HttpError("Comment content is required.").BadRequest();

  const post = req.post;
  ensurePostIsVisible(post, req.user._id, req.groupRole);

  const comment = await Comment.create({
    postId: post._id,
    authorId: req.user._id,
    content,
  });

  if (String(post.authorId) !== String(req.user._id)) {
    await Notification.create({
      recipientId: post.authorId,
      senderId: req.user._id,
      type: "comment",
      message: "Someone commented on your post.",
      referenceId: post._id,
    });
  }

  res.status(201).json({ message: "Comment added.", comment });
}, "Failed to add comment.");

// @route  GET /api/posts/:postId/comments
const listComments = asyncHandler(async (req, res) => {
  const post = req.post;
  ensurePostIsVisible(post, req.user._id, req.groupRole);

  const { page = 1, limit = 20 } = req.query;

  const comments = await Comment.find({ postId: post._id })
    .populate("authorId", "firstName lastName username profilePicture")
    .sort({ createdAt: 1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Comment.countDocuments({ postId: post._id });

  res.status(200).json({ comments, total, page: Number(page), limit: Number(limit) });
}, "Failed to fetch comments.");

// @route  DELETE /api/posts/:postId/comments/:commentId
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findOne({ _id: req.params.commentId, postId: req.post._id });
  if (!comment) throw new HttpError("Comment not found.").NotFound();

  const isModerator = ["owner", "admin"].includes(req.groupRole);
  const isAuthor = String(comment.authorId) === String(req.user._id);

  if (!isModerator && !isAuthor) {
    throw new HttpError("You don't have permission to delete this comment.").Forbidden();
  }

  await Comment.findByIdAndDelete(comment._id);

  res.status(200).json({ message: "Comment deleted." });
}, "Failed to delete comment.");

module.exports = {
  createComment,
  listComments,
  deleteComment,
};
