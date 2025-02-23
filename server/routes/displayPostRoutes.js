const express = require("express");
const router = express.Router();
const {
  getPosts,
  getCatPosts,
  likePost,
  favoritePost,
  getFavoritePosts,
  getLikedPosts,
} = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");

// 展示平台
// 查询所有文章或者某个分类文章
router.get("/", getPosts);
router.get("/categories/:category", authMiddleware, getCatPosts);
// 点赞和收藏相关路由
router.post("/:id/like", authMiddleware, likePost);
router.post("/:id/favorite", authMiddleware, favoritePost);
router.get("/favorites/:userId", authMiddleware, getFavoritePosts);
router.get("/likes/:userId", authMiddleware, getLikedPosts);

module.exports = router;
