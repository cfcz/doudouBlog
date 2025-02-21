const express = require("express");
const router = express.Router();
const {
  getPostComments,
  createComment,
  toggleLikeComment,
  deleteComment,
  getCommentStats, // 添加这一行
} = require("../controllers/commentController");
const authMiddleware = require("../middleware/authMiddleware");

// 所有评论路由都需要验证登录
router.use(authMiddleware);

// 获取文章的所有评论
router.get("/post/:postId", getPostComments);

// 创建评论或回复评论
router.post("/", createComment);

// 点赞或取消点赞评论
router.post("/:commentId/like", toggleLikeComment);

// 删除评论
router.delete("/:commentId", deleteComment);

// 获取评论统计数据
router.get("/stats", authMiddleware, getCommentStats);

module.exports = router;
