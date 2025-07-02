import { Post } from "@/models/post.model";
import { User } from "@/models/user.model";
import { TryCatch } from "@/utils/TryCatch";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// ! api route -> /api/protected/get-user-by-id/{userId}

export const GET = TryCatch(async (request,{params}) => {
  
    const loggedInUserId = request.headers.get("x-user-id");
    const {userId} = await params;

    if (!loggedInUserId) {
        return NextResponse.json({ message: "Unauthorized please login first" }, { status: 401 });
    }
    

    if (!userId) {
        return NextResponse.json({ message: "Invalide user" }, { status: 401 });
    }
    const anotherUser = await User.findById(userId).select("-password -__v -createdAt -updatedAt -isEmailVerified -oauth");
    const posts = await Post.find({userId});

    if (!anotherUser) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, anotherUser,posts }, { status: 200 });
})