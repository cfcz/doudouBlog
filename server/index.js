const express = require("express");
const cors = require("cors");
const { connect } = require("mongoose");
require("dotenv").config();
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

const displayUserRoutes = require("./routes/displayUserRoutes");
const displayPostRoutes = require("./routes/displayPostRoutes");
const displayLayoutRoutes = require("./routes/dislayLayoutRoutes");
const displayCommentRoutes = require("./routes/displayCommentRoutes");

const adminLayoutRoutes = require("./routes/adminLayoutRoutes");
const adminCommentRoutes = require("./routes/adminCommentRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const adminPostRoutes = require("./routes/adminPostRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// 更新 CORS 配置
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400, // 预检请求结果缓存24小时
};

// 添加详细的请求日志
app.use((req, res, next) => {
  // console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  // console.log("Headers:", JSON.stringify(req.headers, null, 2));
  next();
});

app.use(cors(corsOptions));
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//公用接口
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// 展示平台特有接口
app.use("/display/posts", displayPostRoutes);
app.use("/display/comments", displayCommentRoutes);
app.use("/display/layout", displayLayoutRoutes);
app.use("/display/users", displayUserRoutes);

// 管理平台特有接口
app.use("/admin/comments", adminCommentRoutes);
app.use("/admin/layout", adminLayoutRoutes);
app.use("/admin/users", adminUserRoutes);
app.use("/admin/upload", uploadRoutes);
app.use("/admin/posts", adminPostRoutes);

app.use(notFound);
app.use(errorHandler);

connect(process.env.MONGO_URI)
  .then(
    app.listen(5000, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    })
  )
  .catch((err) => {
    console.log(err);
  });
