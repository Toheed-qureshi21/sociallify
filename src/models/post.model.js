import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },

    commentCount: {
      type: Number,
      default: 0,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
postSchema.pre("findOneAndDelete", async function (next) {
  const post = await this.model.findOne(this.getFilter());
  if (post) {
    const postId = post._id;
    const userId = post.userId;
    // Remove all comments likes and the users who have that post in their posts array associated with the post
    await mongoose.model("Like").deleteMany({ postId});
    await mongoose.model("User").updateOne({_id:userId}, { $pull: { posts: postId } });
    await mongoose.model("Comment").deleteMany({ postId});
    await mongoose.model("Notification").deleteMany({ post: postId });
  }
  next();
});

export const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
