const express = require("express");
const router = express.Router();
const {
  getCommentStats, // 添加这一行
} = require("../controllers/commentController");
const authMiddleware = require("../middleware/authMiddleware");

// 获取评论统计数据
router.get("/stats", authMiddleware, getCommentStats);

module.exports = router;
