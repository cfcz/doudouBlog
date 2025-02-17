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
        ],
      })
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 创建评论或回复评论
const createComment = async (req, res) => {
  try {
    const { content, postId, parentCommentId } = req.body;
    console.log(content, postId, parentCommentId);
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
      }
    }

    const comment = await Comment.create({
      content,
      post: postId,
      author: req.user._id,
      parentComment: parentCommentId || null,
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

module.exports = {
  getPostComments,
  createComment,
  toggleLikeComment,
  deleteComment,
};
