const jwt = require("jsonwebtoken");
const User = require("../models/userModels");

const authMiddleware = async (req, res, next) => {
  try {
    // 获取请求头中的认证信息
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "认证失败：未提供token" });
    }

    // 提取token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "认证失败：token格式错误" });
    }

    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 查找用户
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "认证失败：用户不存在" });
    }

    // 将用户信息添加到请求对象中
    req.user = user;
    // console.log("认证成功，用户信息：", { id: user._id, email: user.email });
    next();
  } catch (error) {
    console.error("认证错误：", error);
    return res.status(401).json({
      message:
        error.name === "JsonWebTokenError"
          ? "认证失败：无效的token"
          : "认证失败：token已过期",
    });
  }
};

module.exports = authMiddleware;
