const Comment = require("../models/commentModel");
const Post = require("../models/postModel");

// 获取文章的所有评论
const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;

    // 获取根评论（没有父评论的评论）
    const comments = await Comment.find({
      post: postId,
      parentComment: null,
      isDeleted: false,
    })
      .populate("author", "username email")
      .populate("likes", "username")
      .populate({
        path: "replies",
        match: { isDeleted: false },
        populate: [
          { path: "author", select: "username email" },
          { path: "likes", select: "username" },
          {
            path: "parentComment",
            select: "author",
            populate: { path: "author", select: "username" },
          },
        ],
      })
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

// 创建评论或回复评论
const createComment = async (req, res) => {
  try {
    const { content, postId, parentCommentId } = req.body;
    // console.log(req);
    let rootCommentId; //祖先评论的id
    // 检查文章是否存在
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "文章不存在" });
    }

    // 如果是回复评论，检查父评论是否存在
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (!parentComment || parentComment.isDeleted) {
        return res.status(404).json({ message: "父评论不存在或已被删除" });
      } else if (!parentComment.parentComment) {
        //父评论是对文章的回复
        rootCommentId = parentCommentId;
      } else {
        //父评论是对评论的回复;
        rootCommentId = parentComment.rootComment;
      }
    }

    const comment = await Comment.create({
      content,
      post: postId,
      author: req.user._id,
      parentComment: parentCommentId || null,
      rootComment: rootCommentId || null,
    });

    // populate必要的信息后返回
    const populatedComment = await Comment.findById(comment._id)
      .populate("author", "username email")
      .populate("likes", "username");

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 点赞或取消点赞评论
const toggleLikeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment || comment.isDeleted) {
      return res.status(404).json({ message: "评论不存在或已被删除" });
    }

    const likeIndex = comment.likes.indexOf(userId);
    if (likeIndex === -1) {
      // 添加点赞
      comment.likes.push(userId);
    } else {
      // 取消点赞
      comment.likes.splice(likeIndex, 1);
    }

    await comment.save();

    // 返回更新后的评论
    const updatedComment = await Comment.findById(commentId)
      .populate("author", "username email")
      .populate("likes", "username");

    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 删除评论（软删除）
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "评论不存在" });
    }

    // 检查是否是评论作者
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "没有权限删除该评论" });
    }

    // 软删除
    comment.isDeleted = true;
    comment.content = "该评论已被删除";
    await comment.save();

    res.status(200).json({ message: "评论已删除" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 获取评论统计数据
const getCommentStats = async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

    const stats = await Comment.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $facet: {
          totalStats: [
            {
              $group: {
                _id: null,
                last7Days: {
                  $sum: {
                    $cond: [{ $gte: ["$createdAt", sevenDaysAgo] }, 1, 0],
                  },
                },
                last30Days: {
                  $sum: {
                    $cond: [{ $gte: ["$createdAt", thirtyDaysAgo] }, 1, 0],
                  },
                },
              },
            },
          ],
        },
      },
      {
        $project: {
          stats: { $arrayElemAt: ["$totalStats", 0] },
        },
      },
    ]);

    res.status(200).json(stats[0]?.stats || { last7Days: 0, last30Days: 0 });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getPostComments,
  createComment,
  toggleLikeComment,
  deleteComment,
  getCommentStats,
};
