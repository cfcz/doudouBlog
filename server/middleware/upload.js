const multer = require("multer");
const { v4: uuid } = require("uuid");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = file.mimetype.startsWith("image/") ? "images" : "videos";
    cb(null, path.join(__dirname, "..", "uploads", type));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuid()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};

const uploadMiddleware = (req, res, next) => {
  // console.log("开始处理上传请求");
  // console.log("Content-Type:", req.headers["content-type"]);

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  }).single("file"); // 确保字段名为 'file'

  upload(req, res, (err) => {
    if (err) {
      console.error("上传错误:", {
        name: err.name,
        message: err.message,
        field: err.field,
        code: err.code,
      });

      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({
          message: "错误的文件字段名称，请使用 'file' 作为字段名",
          expectedField: "file",
          error: err.code,
        });
      }

      return res.status(400).json({
        message: "文件上传失败",
        error: err.message,
      });
    }

    console.log("文件上传成功:", req.file);
    next();
  });
};

module.exports = uploadMiddleware;
