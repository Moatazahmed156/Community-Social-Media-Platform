const GroupMember = require("../models/groupMembers-model");

const authorizeGroupRoles = (...roles) => {
  return async (req, res, next) => {
    try {
      const groupId = req.params.groupId || req.groupId;

      if (!groupId) {
        return res.status(400).json({
          message: "Group could not be resolved for this request.",
        });
      }

      const membership = await GroupMember.findOne({
        groupId,
        userId: req.user._id,
      });

      if (!membership) {
        return res.status(403).json({
          message: "You are not a member of this group.",
        });
      }

      if (!roles.includes(membership.role)) {
        return res.status(403).json({
          message: "You don't have permission to perform this action.",
        });
      }

      req.groupRole = membership.role;

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = authorizeGroupRoles;