import { Comment } from "@/models/comment.model";
import { Notification } from "@/models/notification.model";
import { Post } from "@/models/post.model";
import { TryCatch } from "@/utils/TryCatch";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const POST = TryCatch(async (request) => {
  const { comment, postId } = await request.json();
  const userId = request.headers.get("x-user-id");

  if (!comment?.trim()) {
    return NextResponse.json({ message: "Comment is required" }, { status: 400 });
  }

  if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ message: "Invalid post ID or user ID" }, { status: 400 });
  }

  // Fetch post outside transaction
  const post = await Post.findById(postId);
  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  const session = await mongoose.startSession();

  try {
    const addedComment = await session.withTransaction(async (session) => {
      // 1. Create the comment
      const [newComment] = await Comment.create([{
        userId,
        postId,
        comment
      }], { session });

      // 2. Create a notification if needed
      if (newComment?.userId?.toString() !== post?.userId?.toString()) {
        await Notification.create([{
          senderUser: userId,
          receiverUser: post.userId,
          type: "COMMENT",
          comment: newComment._id,
          post: post._id
        }], { session });
      }

      // 3. Update comment count
      post.commentCount += 1;
      await post.save({ session });

      // 4. Populate comment (inside transaction)
      const populatedComment = await Comment.findById(newComment._id)
        .populate("userId", "name profilePic")
        .session(session); // <- important!

      return populatedComment?.toObject();
    });

    if (!addedComment) {
      return NextResponse.json({ message: "Failed to create comment" }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Comment created successfully", addedComment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Transaction error:", error);
    return NextResponse.json(
      { message: "Something went wrong while creating comment" },
      { status: 500 }
    );
  } finally {
    await session.endSession();
  }
});
