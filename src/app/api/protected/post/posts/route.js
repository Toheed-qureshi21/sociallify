import { Comment } from "@/models/comment.model";
import { Like } from "@/models/like.model";
import { Post } from "@/models/post.model";
import { User } from "@/models/user.model";
import { TryCatch } from "@/utils/TryCatch";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const GET = TryCatch(async (request) => {
  const userid = request.headers.get("x-user-id");0
  // const searchParams = new URL(request.url).searchParams;
  // const userid = searchParams.get("userId");
  
  const userId = new mongoose.Types.ObjectId(userid);
  console.log(userId,"current user id");
    if (!userId) {
      return NextResponse.json({ message: "Please login to see your feed" }, { status: 401 });
    }
  
  const currentUser = await User.findById(userId)
    .select("following")
    .lean();
  const feedUsersId = [userId, ...(currentUser?.following || [])];

  const posts = await Post.find({ userId: { $in: feedUsersId } })
    .sort({ createdAt: -1 })
    .populate("userId", "name profilePic")
    .lean();
    if (posts.length===0) {
      return NextResponse.json({message:"No post found kindly follow someone to get posts"},{status:404});
      
    }
    const comments = await Comment.find({postId:{$in:posts.map(post=>post._id)}})
    .populate("userId","name profilePic")
    .lean();

    const likes = await Like.find({postId:{$in:posts.map(post=>post._id)}})
    .populate("userId","name profilePic")
    .lean();
    const commentsOfPost ={}
    console.log("Commets from backend ",comments);
    
    comments.forEach((comment)=>(commentsOfPost[comment.postId]=commentsOfPost[comment.postId]||[]).push(comment));
    
    const likeByPost={}
    likes.forEach((like)=>(likeByPost[like.postId]=likeByPost[like.postId]||[]).push(like));

    const feed = posts?.map(post => ({
  ...post,
  comments: commentsOfPost[post._id] || [],
  likes: likeByPost[post._id] || [],
}));
  if (feed.length===0) {
    return NextResponse.json({message:"No post found kindly follow someone to get posts"},{status:404});
  }
  return NextResponse.json({feed},{status:200});

});
