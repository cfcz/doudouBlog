const { Router } = require("express");

const { getUserStats } = require("../controllers/userControllers");

const authMiddleware = require("../middleware/authMiddleware");

const router = Router();

// 获取用户统计数据 - 管理平台
router.get("/:id/stats", authMiddleware, getUserStats);

module.exports = router;
