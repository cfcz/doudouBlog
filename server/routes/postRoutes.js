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

module.exports = router;
