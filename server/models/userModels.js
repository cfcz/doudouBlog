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
});

module.exports = model("User", userSchema);
