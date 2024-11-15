const jwt = require("jsonwebtoken"); // 引入 jsonwebtoken 包
const HttpError = require("../models/errorModel"); // 引入自定义的 HttpError 类
const authMiddleware = async (req, res, next) => {
  // 定义中间件函数
  const Authorization = req.headers.Authorization || req.headers.authorization; // 获取请求头中的 Authorization 或 authorization 字段

  if (Authorization && Authorization.startsWith("Bearer ")) {
    // 判断 Authorization 是否存在且以 "Bearer " 开头
    const token = Authorization.split(" ")[1]; // 提取令牌字符串
    jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
      // 验证令牌
      if (err) {
        // 如果验证失败
        return next(new HttpError("Unauthorized. Invalid token.", 403)); // 创建并传递 HttpError 实例
      }
      req.user = info; // 将验证后的用户信息附加到请求对象上
      next(); // 继续执行下一个中间件
    });
  } else {
    // 如果 Authorization 不存在或者格式不对
    return next(new HttpError("Unauthorized. No token", 401)); // 创建并传递 HttpError 实例
  }
};
module.exports = authMiddleware; // 导出中间件函数
