const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mediaFiles: [
      {
        url: String,
        type: {
          type: String,
          enum: ["image", "video"],
        },
        filename: String,
      },
    ],
    likes: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    likesCount: {
      type: Number,
      default: 0,
    },
    favorites: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    favoritesCount: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    theme: {
      type: String,
      enum: ["default", "detailed"],
      default: "default",
    },
  },
  {
    timestamps: true,
  }
);

// 添加虚拟字段来快速检查用户是否已点赞/收藏
postSchema.virtual("isLiked").get(function () {
  return this.likes.includes(this._userId);
});

postSchema.virtual("isFavorited").get(function () {
  return this.favorites.includes(this._userId);
});

// 设置 toJSON 选项以包含虚拟字段
postSchema.set("toJSON", { virtuals: true });

module.exports = model("Post", postSchema);
