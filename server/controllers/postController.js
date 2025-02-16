const Post = require("../models/postModel");
const { deleteUnusedFile } = require("../utils/fileManager");

const createPost = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;

    // 验证用户
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "未授权，请先登录",
      });
    }

    // 提取当前内容中的所有媒体文件
    const mediaFiles = [];
    const allUrls = new Set();

    // 提取图片 URL
    const imgRegex = /<img[^>]+src="([^">]+)"[^>]*>/g;
    let match;
    while ((match = imgRegex.exec(content)) !== null) {
      const url = match[1];
      allUrls.add(url);
      if (url.startsWith(`${req.protocol}://${req.get("host")}/uploads/`)) {
        mediaFiles.push({
          url,
          type: "image",
          filename: url.split("/").pop(),
        });
      }
    }

    // 提取视频 URL
    const videoRegex = /<video[^>]*>.*?<source[^>]+src="([^">]+)"[^>]*>/g;
    while ((match = videoRegex.exec(content)) !== null) {
      const url = match[1];
      allUrls.add(url);
      if (url.startsWith(`${req.protocol}://${req.get("host")}/uploads/`)) {
        mediaFiles.push({
          url,
          type: "video",
          filename: url.split("/").pop(),
        });
      }
    }

    console.log("Extracted media files:", mediaFiles);

    // 创建文章
    const newPost = await Post.create({
      title,
      content,
      tags,
      creator: req.user.id,
      mediaFiles,
    });

    // 填充创建者信息并返回
    const populatedPost = await Post.findById(newPost._id).populate(
      "creator",
      "username email"
    );

    console.log("Created post:", populatedPost);

    res.status(201).json({
      message: "文章发布成功",
      post: populatedPost,
    });
  } catch (error) {
    console.error("Post creation error:", error);
    res.status(500).json({
      message: "创建文章失败",
      error: error.message,
    });
  }
};

// 获取文章列表时也填充创建者信息
const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate("creator", "username email")
      .sort("-createdAt");
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

const getPost = async (req, res, next) => {
  try {
    console.log("Getting post with ID:", req.params.id); // 添加调试日志

    const post = await Post.findById(req.params.id).populate(
      "creator",
      "username email"
    ); // 确保填充创建者信息

    if (!post) {
      console.log("Post not found"); // 添加调试日志
      return res.status(404).json({ message: "文章不存在" });
    }

    console.log("Found post:", post); // 添加调试日志
    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error); // 添加错误日志
    next(error);
  }
};

const getCatPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ category: req.params.category });
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

const getUserPost = async (req, res, next) => {
  try {
    const posts = await Post.find({ creator: req.params.id });
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

const editPost = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;
    const postId = req.params.id;

    // 获取原有文章
    const oldPost = await Post.findById(postId);
    if (!oldPost) {
      return res.status(404).json({ message: "文章不存在" });
    }

    // 提取新内容中的媒体文件
    const newMediaFiles = [];
    const newUrls = new Set();

    // 提取图片和视频 URL（使用上面相同的正则表达式）
    const imgRegex = /<img[^>]+src="([^">]+)"[^>]*>/g;
    const videoRegex = /<video[^>]*>.*?<source[^>]+src="([^">]+)"[^>]*>/g;

    let match;
    while ((match = imgRegex.exec(content)) !== null) {
      newUrls.add(match[1]);
    }
    while ((match = videoRegex.exec(content)) !== null) {
      newUrls.add(match[1]);
    }

    // 找出不再使用的文件
    const unusedFiles = oldPost.mediaFiles.filter(
      (file) => !newUrls.has(file.url)
    );

    // 删除不再使用的文件
    for (const file of unusedFiles) {
      await deleteUnusedFile(file.filename);
    }

    // 更新文章
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        title,
        content,
        tags,
        mediaFiles: [...newMediaFiles],
      },
      { new: true }
    );

    res.json(updatedPost);
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "文章不存在" });
    }

    // 删除所有相关的媒体文件
    for (const file of post.mediaFiles) {
      await deleteUnusedFile(file.filename);
    }

    // 删除文章
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "文章已删除" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  getCatPosts,
  getUserPost,
  editPost,
  deletePost,
};
