const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["Art", "Music", "Food", "Travel", "Lifestyle"],
      message: "{VALUE} is not supported",
    },
    description: { type: String, required: true },
    thumbnail: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = model("Post", postSchema);
