import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
// compound unique index
likeSchema.index({ postId: 1, userId: 1 }, { unique: true });

export const Like = mongoose.models.Like || mongoose.model("Like", likeSchema);
