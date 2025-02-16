const jwt = require("jsonwebtoken");
const HttpError = require("../models/errorModel");

const authMiddleware = (req, res, next) => {
  try {
    console.log("=== Auth Middleware ===");

    // 获取 token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "认证失败：未提供token" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Received token:", token);

    // 验证 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    // 将用户信息添加到请求对象
    req.user = {
      id: decoded.userId,
      email: decoded.email,
    };

    console.log("User authenticated:", req.user);
    next();
  } catch (error) {
    console.error("Auth error:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "认证已过期，请重新登录" });
    }
    return res.status(401).json({ message: "认证失败：" + error.message });
  }
};

module.exports = authMiddleware;
