import { uploadToCloudinary } from "@/lib/cloudinary";
import { User } from "@/models/user.model";
import { TryCatch } from "@/utils/TryCatch";
import { NextResponse } from "next/server";

// ! api route -> /api/protected/updateProfile with post method
export const POST = TryCatch(async (request) => {
    const formData = await request.formData();
    const name = formData.get("name")?.toString();
    const bio = formData.get("bio")?.toString();
    const imageFile = formData.get("profilePic")
    const userId = request.headers.get("x-user-id");
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized please login first" }, { status: 401 });
    }
    const updatedUserData = {}
    name && (updatedUserData.name = name);
    bio && (updatedUserData.bio = bio);
    if (imageFile && typeof imageFile === "object" && "arrayBuffer" in imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const imageUrl = await uploadToCloudinary(buffer, { folder: "profile_pics" });
        updatedUserData.profilePic = imageUrl;
    }

    const user = await User.findByIdAndUpdate(userId, updatedUserData, { new: true });
    return NextResponse.json({ success: true, user, message: "Profile updated successfully" }, { status: 200 });
});