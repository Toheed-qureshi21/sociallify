import { User } from "@/models/user.model";
import { toggleFollowAndUnfollow } from "@/services/user.service.js";
import { TryCatch } from "@/utils/TryCatch.js";
import { NextResponse } from "next/server";

// ! api route will be /api/protected/follow and post request will be

export const POST =TryCatch(async(request)=>{
            const {userId} = await request.json();
            const currentUserId = request.headers.get("x-user-id");
            if (userId?.toString() === currentUserId?.toString()) {
                    return NextResponse.json({ message: "You cannot follow yourself" }, { status: 400 });
            }
            const userToFollowOrUnfollow = await User.findById(userId);
            const currentUser = await User.findById(currentUserId);
        if (!userToFollowOrUnfollow || !currentUser) {
                return NextResponse.json({ message: "User not found" }, { status: 404 });
            }
       return await toggleFollowAndUnfollow(currentUser,userToFollowOrUnfollow);
})
