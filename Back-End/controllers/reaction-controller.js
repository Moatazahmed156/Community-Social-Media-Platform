const Reaction = require("../models/reactions-model");
const Notification = require("../models/notifications-model");
const HttpError = require("../utils/HttpError");
const asyncHandler = require("../utils/asyncHandler");

const VALID_TYPES = ["like", "love", "haha", "wow", "sad", "angry"];

const ensurePostIsVisible = (post, userId, groupRole) => {
  const isModerator = ["owner", "admin"].includes(groupRole);
  const isAuthor = String(post.authorId) === String(userId);
  if (post.status !== "approved" && !isModerator && !isAuthor) {
    throw new HttpError("This post is not available yet.").Forbidden();
  }
};

// @route  POST /api/posts/:postId/reactions  (upsert - add or change your reaction)
const setReaction = asyncHandler(async (req, res) => {
  const { type = "like" } = req.body;
  if (!VALID_TYPES.includes(type)) {
    throw new HttpError(`Reaction type must be one of: ${VALID_TYPES.join(", ")}`).ValidationError();
  }

  const post = req.post;
  ensurePostIsVisible(post, req.user._id, req.groupRole);

  const reaction = await Reaction.findOneAndUpdate(
    { postId: post._id, userId: req.user._id },
    { type },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  if (String(post.authorId) !== String(req.user._id)) {
    await Notification.create({
      recipientId: post.authorId,
      senderId: req.user._id,
      type: "reaction",
      message: `Someone reacted "${type}" to your post.`,
      referenceId: post._id,
    });
  }

  res.status(200).json({ message: "Reaction saved.", reaction });
}, "Failed to save reaction.");

// @route  DELETE /api/posts/:postId/reactions  (remove your own reaction)
const removeReaction = asyncHandler(async (req, res) => {
  const result = await Reaction.findOneAndDelete({
    postId: req.post._id,
    userId: req.user._id,
  });

  if (!result) throw new HttpError("You haven't reacted to this post.").NotFound();

  res.status(200).json({ message: "Reaction removed." });
}, "Failed to remove reaction.");

// @route  GET /api/posts/:postId/reactions  (counts + list)
const listReactions = asyncHandler(async (req, res) => {
  const post = req.post;
  ensurePostIsVisible(post, req.user._id, req.groupRole);

  const reactions = await Reaction.find({ postId: post._id }).populate(
    "userId",
    "firstName lastName username profilePicture"
  );

  const counts = reactions.reduce((acc, r) => {
    acc[r.type] = (acc[r.type] || 0) + 1;
    return acc;
  }, {});

  const myReaction = reactions.find((r) => String(r.userId._id) === String(req.user._id));

  res.status(200).json({
    counts,
    total: reactions.length,
    myReaction: myReaction ? myReaction.type : null,
    reactions,
  });
}, "Failed to fetch reactions.");

module.exports = {
  setReaction,
  removeReaction,
  listReactions,
};
