const express = require("express");
const router = express.Router();
const { getPost, getUserPost } = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");

// 文章获取 - 公共
router.get("/:id", getPost);
router.get("/users/:id", authMiddleware, getUserPost);

module.exports = router;
