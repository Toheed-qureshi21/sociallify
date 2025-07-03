import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { TryCatch } from "@/utils/TryCatch";
import { Post } from "@/models/post.model";
import { User } from "@/models/user.model";

// DELETE route: /api/protected/post/delete-post?postId={postId}
export const DELETE = TryCatch(async (request) => {
  const searchParams = new URL(request.url).searchParams;
  const postId = searchParams.get("postId");
  console.log("Post ID to be deleted:", postId);

  if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
    return NextResponse.json({ message: "Invalid post ID" }, { status: 400 });
  }

  const userIdInString = request.headers.get("x-user-id");
  if (!userIdInString) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = new mongoose.Types.ObjectId(userIdInString);
  const user = await User.findById(userId);

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const postObjectId = new mongoose.Types.ObjectId(postId);

  // Debug logs to inspect post ownership
  // console.log("User's posts:", user.posts.map(p => p.toString()));
  // console.log("Looking for postId:", postObjectId.toString());

  const userOwnsPost = user?.posts?.some(
    (p) => p.toString() === postObjectId.toString()
  );

  if (!userOwnsPost) {
    return NextResponse.json({ message: "No post found to delete" }, { status: 400 });
  }

  const deletedPost = await Post.findOneAndDelete({ _id: postObjectId });
  if (!deletedPost) {
    return NextResponse.json({ message: "Post not found in Post collection" }, { status: 404 });
  }

  // Remove postId from user's posts
  user.posts = user.posts.filter(
    (p) => p.toString() !== postObjectId.toString()
  );
  await user.save();

  return NextResponse.json({ message: "Post deleted successfully", user }, { status: 200 });
});
