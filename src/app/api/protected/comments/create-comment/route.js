import { Comment } from "@/models/comment.model";
import { Notification } from "@/models/notification.model";
import { Post } from "@/models/post.model";
import { TryCatch } from "@/utils/TryCatch";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// ! api route -> /protected/comments/create-comment with post method
export const POST = TryCatch(async (request) => {

    const { postId, comment } = await request.json();

    const userId = request.headers.get("x-user-id");
    if (!comment.trim()) {
        return NextResponse.json({ message: "Comment is required" }, { status: 400 });
    }
    if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ message: "Invalid post id or user id" }, { status: 400 });
    }
    const session = await mongoose.startSession();
    let populatedComment = null;

    try {
        await session.withTransaction(async (session) => {
            const post = await Post.findById(postId).session(session);
            if (!post) {
                await session.abortTransaction();
                return NextResponse.json({ message: "Post not found" }, { status: 404 });
            }
            //  returns an array 
            const [newComment] = await Comment.create([{
                userId,
                postId,
                comment
            }], { session });
            // Creating notification
            if (newComment?.userId?.toString() !== post?.userId?.toString()) {
                await Notification.create([
                    {
                        senderUser: userId,
                        receiverUser: post?.userId,
                        type: "COMMENT",
                        comment: newComment?._id,
                        post: post?._id
                    }
                ], { session })
                
            }
            // await Post.findByIdAndUpdate(postId,{$inc:{commentCount:1},session});
            post.commentCount += 1;
            await post.save({ session });
             populatedComment = await Comment.findById(newComment._id).populate("userId", "name profilePic").lean();
            });
            return NextResponse.json({ message: "Comment created successfully", addedComment: populatedComment }, { status: 200 });
    } catch (error) {
        console.error("Transaction error:", error);
        return NextResponse.json({ message: "Something went wrong while creating comment " }, { status: 500 });
    } finally {
        await session.endSession();
    }
});