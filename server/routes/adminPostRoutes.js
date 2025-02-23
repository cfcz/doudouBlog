const express = require("express");
const router = express.Router();
const {
  createPost,
  editPost,
  deletePost,
  getPostStats, // 添加统计路由
} = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");

// 管理平台
// 文章管理相关路由
router.post("/", authMiddleware, createPost);
router.patch("/:id", authMiddleware, editPost);
router.delete("/:id", authMiddleware, deletePost);
// 添加统计路由
router.get("/stats", authMiddleware, getPostStats);

module.exports = router;
