const { Schema, model } = require("mongoose");

const layoutSchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    theme: {
      type: String,
      required: true,
      default: "theme1",
    },
    sidebarPosition: {
      type: String,
      enum: ["left", "right"],
      default: "left",
    },
    components: [
      {
        id: String,
        name: String,
        icon: String,
        column: {
          type: String,
          enum: ["left", "right"],
        },
        order: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Layout", layoutSchema);
