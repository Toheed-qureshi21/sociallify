import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content:{
        type: String,
        default: "",
    },
    image:{
        type: String,
        default: "",
    },
},
{
    timestamps: true
});
postSchema.pre('findOneAndDelete', async function(next) {
    const post = await this.model.findOne(this.getFilter());
    if (post) {
        // Remove all comments associated with the post
        await mongoose.model("Comment").deleteMany({ postId: post._id });
    }
    next();
});

export const Post = mongoose.models.Post || mongoose.model("Post", postSchema);