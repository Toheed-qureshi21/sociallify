import { Like } from "@/models/like.model";
import { Notification } from "@/models/notification.model";
import { Post } from "@/models/post.model";
import { TryCatch } from "@/utils/TryCatch";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// API route -> /api/protected/likes
export const POST = TryCatch(async (request) => {
  const { postId } = await request.json();
  const userId = request.headers.get("x-user-id");

  if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ message: "Invalid post id or user id" }, { status: 400 });
  }

  const existingLike = await Like.findOne({ postId, userId });
  const post = await Post.findById(postId);
  if (!post) {
    return NextResponse.json({ message: "Post not found" }, { status: 404 });
  }

  if (existingLike) {
    // Unlike logic (no transaction needed)
    await Like.deleteOne({ _id: existingLike._id });
    post.likesCount = Math.max(0, post.likesCount - 1);
    await post.save();

    return NextResponse.json(
      { message: "Post unliked successfully", liked: false },
      { status: 200 }
    );
  } else {
    // Like logic with transaction
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        const postInSession = await Post.findById(postId).session(session);
        if (!postInSession) throw new Error("Post not found in session");

        // Create Like
        await Like.create(
          [{ postId, userId }],
          { session }
        );

        // Increment likes
        postInSession.likesCount += 1;
        await postInSession.save({ session });

        // Avoid self-notification
        if (postInSession.userId.toString() !== userId.toString()) {
          await Notification.create(
            [{
              senderUser: userId,
              receiverUser: postInSession.userId,
              type: "LIKE",
              post: postInSession?._id
            }],
            { session }
          );
        }
      });

      return NextResponse.json(
        { message: "Post liked successfully", liked: true },
        { status: 200 }
      );
    } catch (error) {
      console.error("Transaction error:", error);
      return NextResponse.json(
        { message: "Something went wrong while liking the post" },
        { status: 500 }
      );
    } finally {
      await session.endSession();
    }
  }
});
