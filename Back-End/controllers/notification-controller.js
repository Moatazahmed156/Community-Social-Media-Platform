const Notification = require("../models/notifications-model");
const HttpError = require("../utils/HttpError");
const asyncHandler = require("../utils/asyncHandler");

// @route  GET /api/notifications?unreadOnly=true
const listNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, unreadOnly } = req.query;

  const filter = { recipientId: req.user._id };
  if (unreadOnly === "true") filter.isRead = false;

  const notifications = await Notification.find(filter)
    .populate("senderId", "firstName lastName username profilePicture")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Notification.countDocuments(filter);
  const unreadCount = await Notification.countDocuments({
    recipientId: req.user._id,
    isRead: false,
  });

  res.status(200).json({
    notifications,
    total,
    unreadCount,
    page: Number(page),
    limit: Number(limit),
  });
}, "Failed to fetch notifications.");

// @route  PATCH /api/notifications/:id/read
const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipientId: req.user._id },
    { isRead: true },
    { new: true }
  );

  if (!notification) throw new HttpError("Notification not found.").NotFound();

  res.status(200).json({ message: "Notification marked as read.", notification });
}, "Failed to update notification.");

// @route  PATCH /api/notifications/read-all
const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipientId: req.user._id, isRead: false },
    { isRead: true }
  );

  res.status(200).json({ message: "All notifications marked as read." });
}, "Failed to update notifications.");

// @route  DELETE /api/notifications/:id
const deleteNotification = asyncHandler(async (req, res) => {
  const result = await Notification.findOneAndDelete({
    _id: req.params.id,
    recipientId: req.user._id,
  });

  if (!result) throw new HttpError("Notification not found.").NotFound();

  res.status(200).json({ message: "Notification deleted." });
}, "Failed to delete notification.");

module.exports = {
  listNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
