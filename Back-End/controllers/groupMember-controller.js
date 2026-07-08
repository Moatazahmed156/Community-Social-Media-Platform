const Group = require("../models/groups-model");
const GroupMember = require("../models/groupMembers-model");
const Notification = require("../models/notifications-model");
const HttpError = require("../utils/HttpError");
const asyncHandler = require("../utils/asyncHandler");

// @route  POST /api/groups/:groupId/members/join
const joinGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  const group = await Group.findById(groupId);
  if (!group) throw new HttpError("Group not found.").NotFound();

  const existing = await GroupMember.findOne({ groupId, userId: req.user._id });
  if (existing) throw new HttpError("You are already a member of this group.").Conflict();

  const membership = await GroupMember.create({
    groupId,
    userId: req.user._id,
    role: "member",
  });

  res.status(201).json({ message: "Joined group successfully.", membership });
}, "Failed to join group.");

// @route  DELETE /api/groups/:groupId/members/leave
const leaveGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  const membership = await GroupMember.findOne({ groupId, userId: req.user._id });
  if (!membership) throw new HttpError("You are not a member of this group.").NotFound();

  if (membership.role === "owner") {
    throw new HttpError(
      "Owners can't leave their own group. Transfer ownership or delete the group instead."
    ).BadRequest();
  }

  await GroupMember.findByIdAndDelete(membership._id);

  res.status(200).json({ message: "Left the group." });
}, "Failed to leave group.");

// @route  GET /api/groups/:groupId/members
const listMembers = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  const members = await GroupMember.find({ groupId })
    .populate("userId", "firstName lastName username profilePicture")
    .sort({ role: 1, createdAt: 1 });

  res.status(200).json({ members });
}, "Failed to fetch group members.");

// @route  PATCH /api/groups/:groupId/members/:userId/role  (owner only)
const changeMemberRole = asyncHandler(async (req, res) => {
  const { groupId, userId } = req.params;
  const { role } = req.body;

  if (!["admin", "member"].includes(role)) {
    throw new HttpError("Role must be either 'admin' or 'member'.").ValidationError();
  }

  if (userId === String(req.user._id)) {
    throw new HttpError("You can't change your own role.").BadRequest();
  }

  const membership = await GroupMember.findOne({ groupId, userId });
  if (!membership) throw new HttpError("That user is not a member of this group.").NotFound();

  if (membership.role === "owner") {
    throw new HttpError("The group owner's role can't be changed.").BadRequest();
  }

  membership.role = role;
  await membership.save();

  await Notification.create({
    recipientId: userId,
    senderId: req.user._id,
    type: "announcement",
    message: `Your role was updated to "${role}".`,
    referenceId: groupId,
  });

  res.status(200).json({ message: "Member role updated.", membership });
}, "Failed to update member role.");

// @route  DELETE /api/groups/:groupId/members/:userId  (owner/admin)
const removeMember = asyncHandler(async (req, res) => {
  const { groupId, userId } = req.params;

  const membership = await GroupMember.findOne({ groupId, userId });
  if (!membership) throw new HttpError("That user is not a member of this group.").NotFound();

  if (membership.role === "owner") {
    throw new HttpError("The group owner can't be removed.").BadRequest();
  }

  // Admins may only remove regular members, not other admins.
  if (membership.role === "admin" && req.groupRole !== "owner") {
    throw new HttpError("Only the owner can remove an admin.").Forbidden();
  }

  await GroupMember.findByIdAndDelete(membership._id);

  res.status(200).json({ message: "Member removed from the group." });
}, "Failed to remove member.");

module.exports = {
  joinGroup,
  leaveGroup,
  listMembers,
  changeMemberRole,
  removeMember,
};
