import { uploadToCloudinary } from "@/lib/cloudinary";
import { Post } from "@/models/post.model";
import { TryCatch } from "@/utils/TryCatch.js";
import { User } from "@/models/user.model.js";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

// POST route: /api/protected/post/create-post
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

  // ✅ Safely add post to user's posts array
  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  user.posts.push(newPost._id);
  await user.save();

  return NextResponse.json(
    { success: true, message: "Post created successfully", user, newPost },
    { status: 201 }
  );
});
