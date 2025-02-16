const express = require("express");
const router = express.Router();
const { saveLayout, getLayout } = require("../controllers/layoutController");
const authMiddleware = require("../middleware/authMiddleware");

// 添加认证中间件以保护路由
router.use(authMiddleware);

// 获取布局设置
router.get("/", getLayout);

// 保存布局设置
router.post("/", saveLayout);

module.exports = router;
