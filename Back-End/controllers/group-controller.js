const Group = require("../models/groups-model");
const GroupMember = require("../models/groupMembers-model");
const Post = require("../models/posts-model");
const HttpError = require("../utils/HttpError");
const asyncHandler = require("../utils/asyncHandler");
const safeUnlink = require("../utils/safeUnlink");

// @route  POST /api/groups
const createGroup = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name) throw new HttpError("Group name is required.").BadRequest();

  const group = await Group.create({
    name,
    description,
    createdBy: req.user._id,
  });

  // Creator automatically becomes the Owner.
  await GroupMember.create({
    groupId: group._id,
    userId: req.user._id,
    role: "owner",
  });

  res.status(201).json({ message: "Group created.", group });
}, "Failed to create group.");

// @route  GET /api/groups?search=
const listGroups = asyncHandler(async (req, res) => {
  const { search = "", page = 1, limit = 20 } = req.query;

  const filter = search ? { name: { $regex: search, $options: "i" } } : {};

  const groups = await Group.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Group.countDocuments(filter);

  res.status(200).json({ groups, total, page: Number(page), limit: Number(limit) });
}, "Failed to fetch groups.");

// @route  GET /api/groups/:groupId
const getGroupById = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.groupId);
  if (!group) throw new HttpError("Group not found.").NotFound();

  const memberCount = await GroupMember.countDocuments({ groupId: group._id });
  const membership = await GroupMember.findOne({
    groupId: group._id,
    userId: req.user._id,
  });

  res.status(200).json({
    group,
    memberCount,
    myRole: membership ? membership.role : null,
  });
}, "Failed to fetch group.");

// @route  PUT /api/groups/:groupId  (owner/admin)
const updateGroup = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const group = await Group.findById(req.params.groupId);
  if (!group) throw new HttpError("Group not found.").NotFound();

  if (name) group.name = name;
  if (description !== undefined) group.description = description;

  await group.save();

  res.status(200).json({ message: "Group updated.", group });
}, "Failed to update group.");

// @route  PUT /api/groups/:groupId/logo  (owner/admin)
const updateGroupLogo = asyncHandler(async (req, res) => {
  if (!req.file) throw new HttpError("No image file uploaded.").BadRequest();

  const group = await Group.findById(req.params.groupId);
  if (!group) throw new HttpError("Group not found.").NotFound();

  if (group.logo) await safeUnlink(group.logo).catch(() => {});

  group.logo = `/uploads/groups/${req.file.filename}`;
  await group.save();

  res.status(200).json({ message: "Group logo updated.", group });
}, "Failed to update group logo.");

// @route  PUT /api/groups/:groupId/cover  (owner/admin)
const updateGroupCover = asyncHandler(async (req, res) => {
  if (!req.file) throw new HttpError("No image file uploaded.").BadRequest();

  const group = await Group.findById(req.params.groupId);
  if (!group) throw new HttpError("Group not found.").NotFound();

  if (group.coverImage) await safeUnlink(group.coverImage).catch(() => {});

  group.coverImage = `/uploads/groups/${req.file.filename}`;
  await group.save();

  res.status(200).json({ message: "Group cover image updated.", group });
}, "Failed to update group cover image.");

// @route  DELETE /api/groups/:groupId  (owner only)
const deleteGroup = asyncHandler(async (req, res) => {
  const group = await Group.findById(req.params.groupId);
  if (!group) throw new HttpError("Group not found.").NotFound();

  await Promise.all([
    Group.findByIdAndDelete(group._id),
    GroupMember.deleteMany({ groupId: group._id }),
    Post.deleteMany({ groupId: group._id }),
  ]);

  res.status(200).json({ message: "Group and its content deleted." });
}, "Failed to delete group.");

module.exports = {
  createGroup,
  listGroups,
  getGroupById,
  updateGroup,
  updateGroupLogo,
  updateGroupCover,
  deleteGroup,
};
