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
  },
  {
    timestamps: true,
  }
);

module.exports = model("Post", postSchema);
