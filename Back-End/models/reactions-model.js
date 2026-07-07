const mongoose = require("mongoose");

const ReactionSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["like", "love", "haha", "wow", "sad", "angry"],
      default: "like",
    },
  },
  {
    timestamps: true,
  }
);

// One reaction per user per post
ReactionSchema.index(
  { postId: 1, userId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Reaction", ReactionSchema);