import { uploadToCloudinary } from "@/lib/cloudinary";
import { Post } from "@/models/post.model";
import { TryCatch } from "@/utils/TryCatch.js";
import { User } from "@/models/user.model.js";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


// ! api route -> /api/protected/post/create-post with post method 
export const POST = TryCatch(async (request) => {
  const userId = request.headers.get("x-user-id");
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const formData = await request.formData();
  
  const text = formData.get("text");
  const image = formData.get("image");
  let imageUrl = "";
  
  if (image && typeof image === "object") {
    const buffer = Buffer.from(await image.arrayBuffer());
    imageUrl = await uploadToCloudinary(buffer, { folder: "posts" });
  }
  const newPost = await Post.create({
    userId: new mongoose.Types.ObjectId(userId),
    content: text,
    image: imageUrl,
  });
  await User.findByIdAndUpdate(userId, {
    $push: { posts: newPost._id },
  })
  const user = await User.findById(userId)
  return NextResponse.json(
    { success: true, message: "Post created successfully successfully",user,newPost},
    { status: 201 }
  );
});
