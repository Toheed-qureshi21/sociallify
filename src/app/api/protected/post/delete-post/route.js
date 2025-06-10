import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { TryCatch } from "@/utils/TryCatch";
import { Post } from "@/models/post.model";
import { User } from "@/models/user.model";

// ! api route -> /api/protected/post/delete-post?postId={postId} with delete method
export const DELETE = TryCatch(async (request) => {
    const searchParams = new URL(request.url).searchParams;
    const postId = searchParams.get("postId");
    console.log("post id to be delete",postId);
    
    if (!postId || !mongoose.Types.ObjectId.isValid(postId)) {
        return NextResponse.json({ message: "No post found to delete " }, { status: 400 });
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
      if (user.posts.includes(postId)) {
            await Post.findOneAndDelete({ _id: postId });
            user.posts = user.posts.filter(postId => postId !== postId);
            user.save();
            return NextResponse.json({ message: "Post deleted successfully",user}, { status: 200 });
      } else{
        return NextResponse.json({ message: "No post found to delete " }, { status: 400 });
      }
})