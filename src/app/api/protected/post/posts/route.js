import { Comment } from "@/models/comment.model";
import { Like } from "@/models/like.model";
import { Post } from "@/models/post.model";
import { User } from "@/models/user.model";
import { TryCatch } from "@/utils/TryCatch";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const GET = TryCatch(async (request) => {
  const userid = request.headers.get("x-user-id");

  if (!userid) {
    return NextResponse.json({ message: "Please login to see your feed" }, { status: 401 });
  }

  const userId = new mongoose.Types.ObjectId(userid);
  const currentUser = await User.findById(userId).select("following").lean();
  const feedUsersId = [userId, ...(currentUser?.following || [])];

  const posts = await Post.find({ userId: { $in: feedUsersId } })
    .sort({ createdAt: -1 })
    .populate("userId", "name profilePic")
    .lean();

  if (!posts.length) {
    return NextResponse.json({
      message: "No post found kindly follow someone to get posts",
    }, { status: 404 });
  }

  // Fetch only comments of posts
  const comments = await Comment.find({
    postId: { $in: posts.map(post => post._id) }
  })
    .populate("userId", "name profilePic")
    .lean();

  const commentsOfPost = {};
  comments.forEach(comment => {
    const key = comment.postId.toString();
    if (!commentsOfPost[key]) commentsOfPost[key] = [];
    commentsOfPost[key].push(comment);
  });

  
  const feed = posts.map(post => ({
    ...post,
    comments: commentsOfPost[post._id.toString()] || [],
    // likeCount is already in post.likeCount
  }));

  return NextResponse.json({ feed }, { status: 200 });
});
