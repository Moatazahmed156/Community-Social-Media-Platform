const bcrypt = require("bcrypt");

const User = require("../models/users-model");
const HttpError = require("../utils/HttpError");
const asyncHandler = require("../utils/asyncHandler");
const safeUnlink = require("../utils/safeUnlink");

const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : user;
  delete obj.password;
  return obj;
};

// @route  GET /api/users/:id
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) throw new HttpError("User not found.").NotFound();
  res.status(200).json({ user });
}, "Failed to fetch user.");

// @route  GET /api/users?search=
const searchUsers = asyncHandler(async (req, res) => {
  const { search = "", page = 1, limit = 20 } = req.query;

  const filter = search
    ? {
        $or: [
          { username: { $regex: search, $options: "i" } },
          { firstName: { $regex: search, $options: "i" } },
          { lastName: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(filter)
    .select("-password")
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await User.countDocuments(filter);

  res.status(200).json({ users, total, page: Number(page), limit: Number(limit) });
}, "Failed to search users.");

// @route  PUT /api/users/me
const updateMe = asyncHandler(async (req, res) => {
  const { firstName, lastName, bio, username } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) throw new HttpError("User not found.").NotFound();

  if (username && username !== user.username) {
    const taken = await User.findOne({ username });
    if (taken) throw new HttpError("That username is already taken.").Conflict();
    user.username = username;
  }

  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (bio !== undefined) user.bio = bio;

  await user.save();

  res.status(200).json({ message: "Profile updated.", user: sanitizeUser(user) });
}, "Failed to update profile.");

// @route  PUT /api/users/me/password
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new HttpError("currentPassword and newPassword are required.").BadRequest();
  }
  if (newPassword.length < 6) {
    throw new HttpError("New password must be at least 6 characters long.").ValidationError();
  }

  const user = await User.findById(req.user._id);
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new HttpError("Current password is incorrect.").Unauthorized();

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.status(200).json({ message: "Password changed successfully." });
}, "Failed to change password.");

// @route  PUT /api/users/me/profile-picture
const updateProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) throw new HttpError("No image file uploaded.").BadRequest();

  const user = await User.findById(req.user._id);

  if (user.profilePicture) {
    await safeUnlink(user.profilePicture).catch(() => {});
  }

  user.profilePicture = `/uploads/profiles/${req.file.filename}`;
  await user.save();

  res.status(200).json({ message: "Profile picture updated.", user: sanitizeUser(user) });
}, "Failed to update profile picture.");

// @route  PUT /api/users/me/cover-picture
const updateCoverPicture = asyncHandler(async (req, res) => {
  if (!req.file) throw new HttpError("No image file uploaded.").BadRequest();

  const user = await User.findById(req.user._id);

  if (user.coverPicture) {
    await safeUnlink(user.coverPicture).catch(() => {});
  }

  user.coverPicture = `/uploads/profiles/${req.file.filename}`;
  await user.save();

  res.status(200).json({ message: "Cover picture updated.", user: sanitizeUser(user) });
}, "Failed to update cover picture.");

// @route  DELETE /api/users/me
const deleteMe = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.user._id);
  res.status(200).json({ message: "Account deleted." });
}, "Failed to delete account.");

module.exports = {
  getUserById,
  searchUsers,
  updateMe,
  changePassword,
  updateProfilePicture,
  updateCoverPicture,
  deleteMe,
};
