const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String },
  followedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }], // 用户关注的其他用户
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }], // 关注用户的其他用户（粉丝）
  postCount: { type: Number, default: 0 }, // 用户发布的文章数量
  likeCount: { type: Number, default: 0 }, // 点赞的总数
  favoriteCount: { type: Number, default: 0 }, // 收藏的总数
  likedPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  favoritePosts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

// 添加方法来处理点赞和收藏
userSchema.methods.toggleLike = async function (postId) {
  const isLiked = this.likedPosts.includes(postId);
  if (isLiked) {
    this.likedPosts.pull(postId);
  } else {
    this.likedPosts.push(postId);
  }
  await this.save();
  return !isLiked;
};

userSchema.methods.toggleFavorite = async function (postId) {
  const isFavorited = this.favoritePosts.includes(postId);
  if (isFavorited) {
    this.favoritePosts.pull(postId);
  } else {
    this.favoritePosts.push(postId);
  }
  await this.save();
  return !isFavorited;
};

module.exports = model("User", userSchema);
