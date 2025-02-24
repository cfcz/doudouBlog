const Post = require("../models/postModel");
const User = require("../models/userModels");
const { deleteUnusedFile } = require("../utils/fileManager");

const createPost = async (req, res, next) => {
  try {
    const { title, content, tags, theme } = req.body; // 添加 theme 参数

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
      theme: theme || "default", // 默认主题
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

// 修改 getPost 函数，添加点赞和收藏状态
const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "creator",
      "username email"
    );

    if (!post) {
      return res.status(404).json({ message: "文章不存在" });
    }

    // 返回时包含主题信息
    const response = {
      ...post.toJSON(),
      theme: post.theme || "default", // 确保有默认主题
    };

    // 如果用户已登录，检查用户是否已点赞和收藏
    if (req.user) {
      const user = await User.findById(req.user._id);
      post._userId = req.user._id; // 为虚拟字段设置当前用户ID
      post.isLiked = user.likedPosts.includes(post._id);
      post.isFavorited = user.favoritePosts.includes(post._id);
    }

    res.json(response);
  } catch (error) {
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

// 点赞文章
const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!post || !user) {
      return res.status(404).json({ message: "Post or user not found" });
    }

    const existingLike = post.likes.find(
      (like) => like.user.toString() === user._id.toString()
    );

    if (existingLike) {
      // 取消点赞
      post.likes = post.likes.filter(
        (like) => like.user.toString() !== user._id.toString()
      );
      post.likesCount = Math.max(0, post.likesCount - 1);
      await user.toggleLike(post._id);
    } else {
      // 添加点赞
      post.likes.push({ user: user._id, createdAt: new Date() });
      post.likesCount += 1;
      await user.toggleLike(post._id);
    }

    await post.save();

    res.json({
      message: existingLike ? "Post unliked" : "Post liked",
      likesCount: post.likesCount,
      isLiked: !existingLike,
    });
  } catch (error) {
    next(error);
  }
};

// 收藏文章
const favoritePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!post || !user) {
      return res.status(404).json({ message: "Post or user not found" });
    }

    const existingFavorite = post.favorites.find(
      (fav) => fav.user.toString() === user._id.toString()
    );

    if (existingFavorite) {
      // 取消收藏
      post.favorites = post.favorites.filter(
        (fav) => fav.user.toString() !== user._id.toString()
      );
      post.favoritesCount = Math.max(0, post.favoritesCount - 1);
      await user.toggleFavorite(post._id);
    } else {
      // 添加收藏
      post.favorites.push({ user: user._id, createdAt: new Date() });
      post.favoritesCount += 1;
      await user.toggleFavorite(post._id);
    }

    await post.save();

    res.json({
      message: existingFavorite ? "Post unfavorited" : "Post favorited",
      favoritesCount: post.favoritesCount,
      isFavorited: !existingFavorite,
    });
  } catch (error) {
    next(error);
  }
};

// 获取用户收藏的文章列表
const getFavoritePosts = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).populate({
      path: "favoritePosts",
      populate: {
        path: "creator",
        select: "username email",
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.favoritePosts);
  } catch (error) {
    next(error);
  }
};

// 获取用户点赞的文章列表
const getLikedPosts = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).populate({
      path: "likedPosts",
      populate: {
        path: "creator",
        select: "username email",
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.likedPosts);
  } catch (error) {
    next(error);
  }
};

// 新增统计接口
const getPostStats = async (req, res, next) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

    const stats = await Post.aggregate([
      {
        $facet: {
          // 近7天和30天的点赞统计
          likes: [
            { $unwind: "$likes" },
            {
              $group: {
                _id: null,
                last7Days: {
                  $sum: {
                    $cond: [{ $gte: ["$likes.createdAt", sevenDaysAgo] }, 1, 0],
                  },
                },
                last30Days: {
                  $sum: {
                    $cond: [
                      { $gte: ["$likes.createdAt", thirtyDaysAgo] },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
          ],
          // 近7天和30天的收藏统计
          favorites: [
            { $unwind: "$favorites" },
            {
              $group: {
                _id: null,
                last7Days: {
                  $sum: {
                    $cond: [
                      { $gte: ["$favorites.createdAt", sevenDaysAgo] },
                      1,
                      0,
                    ],
                  },
                },
                last30Days: {
                  $sum: {
                    $cond: [
                      { $gte: ["$favorites.createdAt", thirtyDaysAgo] },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
          ],
          // 近7天和30天的评论统计
          comments: [
            { $unwind: "$comments" },
            {
              $group: {
                _id: null,
                last7Days: {
                  $sum: {
                    $cond: [
                      { $gte: ["$comments.createdAt", sevenDaysAgo] },
                      1,
                      0,
                    ],
                  },
                },
                last30Days: {
                  $sum: {
                    $cond: [
                      { $gte: ["$comments.createdAt", thirtyDaysAgo] },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          likes: { $arrayElemAt: ["$likes", 0] },
          favorites: { $arrayElemAt: ["$favorites", 0] },
          comments: { $arrayElemAt: ["$comments", 0] },
        },
      },
    ]);

    res.json(stats[0]);
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
  likePost,
  favoritePost,
  getFavoritePosts,
  getLikedPosts,
  getPostStats,
};
