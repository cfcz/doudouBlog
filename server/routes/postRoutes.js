const express = require("express");
const router = express.Router();
const {
  createPost,
  getPosts,
  getPost,
  getCatPosts,
  getUserPost,
  editPost,
  deletePost,
  likePost,
  favoritePost,
  getFavoritePosts,
  getLikedPosts,
} = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");

// 添加日志中间件
const logRequest = (req, res, next) => {
  console.log("=== Post Route Hit ===");
  console.log("Method:", req.method);
  console.log("Path:", req.path);
  console.log("Headers:", req.headers);
  next();
};

router.post("/", logRequest, authMiddleware, createPost);
router.get("/", authMiddleware, getPosts);
router.get("/:id", authMiddleware, getPost);
router.get("/categories/:category", authMiddleware, getCatPosts);
router.get("/users/:id", authMiddleware, getUserPost);
router.patch("/:id", authMiddleware, editPost);
router.delete("/:id", authMiddleware, deletePost);

// 点赞和收藏相关路由
router.post("/:id/like", authMiddleware, likePost);
router.post("/:id/favorite", authMiddleware, favoritePost);
router.get("/favorites/:userId", authMiddleware, getFavoritePosts);
router.get("/likes/:userId", authMiddleware, getLikedPosts);

module.exports = router;
