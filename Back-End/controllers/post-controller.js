const Post = require("../models/posts-model");
const GroupMember = require("../models/groupMembers-model");
const Notification = require("../models/notifications-model");
const HttpError = require("../utils/HttpError");
const asyncHandler = require("../utils/asyncHandler");
const safeUnlink = require("../utils/safeUnlink");

// @route  POST /api/groups/:groupId/posts  (any member)
const createPost = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const { content } = req.body;

  if (!content) throw new HttpError("Post content is required.").BadRequest();

  const images = (req.files || []).map((f) => `/uploads/posts/${f.filename}`);

  const post = await Post.create({
    groupId,
    authorId: req.user._id,
    content,
    images,
    status: "pending",
  });

  res.status(201).json({
    message: "Post submitted and is awaiting approval.",
    post,
  });
}, "Failed to create post.");

// @route  GET /api/groups/:groupId/posts?status=  (any member)
const listPosts = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const { page = 1, limit = 20 } = req.query;
  let { status } = req.query;

  const isModerator = ["owner", "admin"].includes(req.groupRole);

  const filter = { groupId };

  if (isModerator) {
    // Moderators can filter by any status (default: everything) to review
    // the moderation queue.
    if (status) filter.status = status;
  } else if (status === "pending" || status === "rejected") {
    // Regular members can't see the group's full moderation queue, but they
    // can look up their own pending/rejected posts so their submissions
    // don't just disappear while awaiting review.
    filter.status = status;
    filter.authorId = req.user._id;
  } else {
    filter.status = "approved";
  }

  const posts = await Post.find(filter)
    .populate("authorId", "firstName lastName username profilePicture")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Post.countDocuments(filter);

  res.status(200).json({ posts, total, page: Number(page), limit: Number(limit) });
}, "Failed to fetch posts.");

// @route  GET /api/groups/:groupId/posts/:postId  (any member)
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ _id: req.params.postId, groupId: req.params.groupId })
    .populate("authorId", "firstName lastName username profilePicture");

  if (!post) throw new HttpError("Post not found.").NotFound();

  const isModerator = ["owner", "admin"].includes(req.groupRole);
  const isAuthor = String(post.authorId._id) === String(req.user._id);

  if (post.status !== "approved" && !isModerator && !isAuthor) {
    throw new HttpError("This post is not available yet.").Forbidden();
  }

  res.status(200).json({ post });
}, "Failed to fetch post.");

// @route  PUT /api/groups/:groupId/posts/:postId  (author only, while pending)
const updatePost = asyncHandler(async (req, res) => {
  const { content } = req.body;

  const post = await Post.findOne({ _id: req.params.postId, groupId: req.params.groupId });
  if (!post) throw new HttpError("Post not found.").NotFound();

  if (String(post.authorId) !== String(req.user._id)) {
    throw new HttpError("You can only edit your own posts.").Forbidden();
  }

  if (post.status !== "pending") {
    throw new HttpError("Only pending posts can be edited. Approved posts are locked.").BadRequest();
  }

  if (content) post.content = content;
  await post.save();

  res.status(200).json({ message: "Post updated.", post });
}, "Failed to update post.");

// @route  PATCH /api/groups/:groupId/posts/:postId/approve  (owner/admin)
const approvePost = asyncHandler(async (req, res) => {
  const { groupId, postId } = req.params;

  const post = await Post.findOne({ _id: postId, groupId });
  if (!post) throw new HttpError("Post not found.").NotFound();

  if (post.status !== "pending") {
    throw new HttpError("Only pending posts can be approved.").BadRequest();
  }

  const approver = await GroupMember.findOne({ groupId, userId: req.user._id });

  post.status = "approved";
  post.approvedBy = approver._id;
  post.approvedAt = new Date();
  await post.save();

  await Notification.create({
    recipientId: post.authorId,
    senderId: req.user._id,
    type: "postApproved",
    message: "Your post has been approved and is now visible to the group.",
    referenceId: post._id,
  });

  res.status(200).json({ message: "Post approved.", post });
}, "Failed to approve post.");

// @route  PATCH /api/groups/:groupId/posts/:postId/reject  (owner/admin)
const rejectPost = asyncHandler(async (req, res) => {
  const { groupId, postId } = req.params;
  const { reason } = req.body;

  const post = await Post.findOne({ _id: postId, groupId });
  if (!post) throw new HttpError("Post not found.").NotFound();

  if (post.status !== "pending") {
    throw new HttpError("Only pending posts can be rejected.").BadRequest();
  }

  post.status = "rejected";
  await post.save();

  await Notification.create({
    recipientId: post.authorId,
    senderId: req.user._id,
    type: "postRejected",
    message: reason
      ? `Your post was rejected: ${reason}`
      : "Your post was rejected by a group moderator.",
    referenceId: post._id,
  });

  res.status(200).json({ message: "Post rejected.", post });
}, "Failed to reject post.");

// @route  DELETE /api/groups/:groupId/posts/:postId  (author or owner/admin)
const deletePost = asyncHandler(async (req, res) => {
  const { groupId, postId } = req.params;

  const post = await Post.findOne({ _id: postId, groupId });
  if (!post) throw new HttpError("Post not found.").NotFound();

  const isModerator = ["owner", "admin"].includes(req.groupRole);
  const isAuthor = String(post.authorId) === String(req.user._id);

  if (!isModerator && !isAuthor) {
    throw new HttpError("You don't have permission to delete this post.").Forbidden();
  }

  await Promise.all((post.images || []).map((img) => safeUnlink(img).catch(() => {})));
  await Post.findByIdAndDelete(post._id);

  res.status(200).json({ message: "Post deleted." });
}, "Failed to delete post.");

module.exports = {
  createPost,
  listPosts,
  getPostById,
  updatePost,
  approvePost,
  rejectPost,
  deletePost,
};
