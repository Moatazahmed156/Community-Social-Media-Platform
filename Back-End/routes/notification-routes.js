const express = require("express");
const router = express.Router();

const {
  listNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notification-controller");
const authenticate = require("../middlewares/authenticate");

router.use(authenticate);

router.get("/", listNotifications);
router.patch("/read-all", markAllAsRead);
router.patch("/:id/read", markAsRead);
router.delete("/:id", deleteNotification);

module.exports = router;
