const HttpError = require("../models/errorModel");

const uploadMedia = async (req, res, next) => {
  console.log("Upload controller - Request file:", req.file);
  console.log("Upload controller - Request body:", req.body);

  try {
    if (!req.file) {
      console.error("No file received");
      return res.status(400).json({
        message: "No file provided",
        requestHeaders: req.headers,
        requestBody: req.body,
      });
    }

    const fileType = req.file.mimetype.startsWith("image/")
      ? "images"
      : "videos";

    // 构建文件URL (确保路径正确)
    const url = `${req.protocol}://${req.get("host")}/uploads/${fileType}/${
      req.file.filename
    }`;

    res.status(200).json({
      url,
      filename: req.file.filename,
      type: fileType === "images" ? "image" : "video",
    });
  } catch (error) {
    console.error("Upload controller error:", error);
    next(error);
  }
};

module.exports = {
  uploadMedia,
};
