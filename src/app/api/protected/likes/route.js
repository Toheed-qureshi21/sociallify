import { Like } from "@/models/like.model";
import { Post } from "@/models/post.model";
import { TryCatch } from "@/utils/TryCatch";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// ! api route -> /api/protected/likes with post method
export const POST = TryCatch(async(request)=>{
    const {postId} = await request.json();
    const userId = request.headers.get("x-user-id");
    if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ message: "Invalid post id or user id" }, { status: 400 });
    }
    const isExistingLike = await Like.findOne({postId,userId});
    if (isExistingLike) {
        // It means that user already liked the post so we have to unlike the post
        await Like.deleteOne({_id:isExistingLike?._id});
         await Post.findByIdAndUpdate(postId,{$inc:{likesCount:-1}});
        return NextResponse.json({message:"Post unliked successfully",liked:false},{status:200});
    }

    await Like.create({
        postId,
        userId
    });
    await Post.findByIdAndUpdate(postId,{$inc:{likesCount:1}});
    return NextResponse.json({message:"Post liked successfully",liked:true},{status:200});
})