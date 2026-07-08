const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth-routes"));
router.use("/users", require("./user-routes"));
router.use("/groups", require("./group-routes"));
router.use("/posts", require("./postScoped-routes"));
router.use("/notifications", require("./notification-routes"));

router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

module.exports = router;
