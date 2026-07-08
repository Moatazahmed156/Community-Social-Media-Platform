const Post = require("../models/posts-model");
const HttpError = require("../utils/HttpError");
const asyncHandler = require("../utils/asyncHandler");

const resolvePostGroup = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findById(postId);
  if (!post) {
    throw new HttpError("Post not found.").NotFound();
  }

  req.post = post;
  req.groupId = post.groupId.toString();
  next();
}, "Failed to resolve post's group.");

module.exports = resolvePostGroup;
