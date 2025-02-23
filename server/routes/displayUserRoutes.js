const { Router } = require("express");

const {
  followUser,
  unfollowUser,
  getFollowedUsers,
  getFollowers,
} = require("../controllers/userControllers");

const authMiddleware = require("../middleware/authMiddleware");

const router = Router();

// 关注相关路由 - 展示平台
router.post("/follow/:id", authMiddleware, followUser);
router.post("/unfollow/:id", authMiddleware, unfollowUser);
router.get("/:id/following", getFollowedUsers);
router.get("/:id/followers", getFollowers);

module.exports = router;
