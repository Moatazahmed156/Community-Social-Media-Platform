const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  joinGroup,
  leaveGroup,
  listMembers,
  changeMemberRole,
  removeMember,
} = require("../controllers/groupMember-controller");
const authenticate = require("../middlewares/authenticate");
const authorizeGroupRoles = require("../middlewares/authorize");

router.use(authenticate);

router.post("/join", joinGroup);
router.delete("/leave", leaveGroup);
router.get("/", authorizeGroupRoles("owner", "admin", "member"), listMembers);
router.patch("/:userId/role", authorizeGroupRoles("owner"), changeMemberRole);
router.delete("/:userId", authorizeGroupRoles("owner", "admin"), removeMember);

module.exports = router;
