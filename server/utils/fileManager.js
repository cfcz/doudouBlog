const fs = require("fs").promises;
const path = require("path");

const deleteUnusedFile = async (filename) => {
  try {
    // 判断文件类型并选择对应目录
    const type = filename.match(/\.(jpg|jpeg|png|gif)$/i) ? "images" : "videos";
    const filepath = path.join(__dirname, "..", "uploads", type, filename);

    await fs.unlink(filepath);
    console.log(`Successfully deleted file: ${filename}`);
  } catch (error) {
    console.error(`Error deleting file ${filename}:`, error);
  }
};

module.exports = { deleteUnusedFile };
