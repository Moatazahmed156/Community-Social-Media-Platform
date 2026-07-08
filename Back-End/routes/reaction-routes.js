const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  setReaction,
  removeReaction,
  listReactions,
} = require("../controllers/reaction-controller");
const authenticate = require("../middlewares/authenticate");
const authorizeGroupRoles = require("../middlewares/authorize");
const resolvePostGroup = require("../middlewares/resolvePostGroup");

router.use(authenticate);
router.use(resolvePostGroup);
router.use(authorizeGroupRoles("owner", "admin", "member"));

router.post("/", setReaction);
router.delete("/", removeReaction);
router.get("/", listReactions);

module.exports = router;
