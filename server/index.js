const express = require("express");
const cors = require("cors");
const { connect } = require("mongoose");
require("dotenv").config();
const path = require("path");

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const layoutRoutes = require("./routes/layoutRoutes");
const commentRoutes = require("./routes/commentRoutes");
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

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/layout", layoutRoutes);
app.use("/api/comments", commentRoutes);

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
