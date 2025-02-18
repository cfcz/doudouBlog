const { Router } = require("express");

const {
  registerUser,
  loginUser,
  getUser,
  changeAvatar,
  editUser,
  getAuthors,
  followUser,
  unfollowUser,
  getFollowedUsers,
  getFollowers,
} = require("../controllers/userControllers");

const authMiddleware = require("../middleware/authMiddleware");

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/:id", getUser);
router.post("/change-avatar", authMiddleware, changeAvatar);
router.patch("/edit-user", authMiddleware, editUser);
router.get("/", getAuthors);
// 关注相关路由
router.post("/follow/:id", authMiddleware, followUser);
router.post("/unfollow/:id", authMiddleware, unfollowUser);
router.get("/:id/following", getFollowedUsers);
router.get("/:id/followers", getFollowers);

module.exports = router;
