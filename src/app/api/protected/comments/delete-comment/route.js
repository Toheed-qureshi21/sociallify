import { Comment } from "@/models/comment.model";
import { Post } from "@/models/post.model";
import { TryCatch } from "@/utils/TryCatch";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const DELETE = TryCatch(async (request) => {
    // ! api route -> /api/protected/comments/delete-comment?commentId={commentId} with delete method
    const userId = request.headers.get("x-user-id");
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("commentId");
    if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
        return NextResponse.json({ message: "No comment found to delete " }, { status: 400 });
    }
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized please login " }, { status: 400 });
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
        return NextResponse.json({ message: "Comment not found." }, { status: 404 });
    }
    const post = await Post.findById(comment.postId);
    if (!post) {
        return NextResponse.json({ message: "Associated post not found." }, { status: 404 });
    }
    await Comment.deleteOne({ _id: comment._id });
    post.commentCount = Math.max(0, post.commentCount - 1); // avoid negative counts
    await post.save();

    return NextResponse.json({ message: "Comment deleted successfully" }, { status: 200 });

})