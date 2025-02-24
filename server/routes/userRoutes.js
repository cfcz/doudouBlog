const { Router } = require("express");

const {
  registerUser,
  loginUser,
  getUser,
  getAuthors,
  refreshToken,
  verifyToken,
} = require("../controllers/userControllers");

const router = Router();

//通用路由
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshToken);
router.get("/verify", verifyToken);
router.get("/:id", getUser);
router.get("/", getAuthors);

module.exports = router;
