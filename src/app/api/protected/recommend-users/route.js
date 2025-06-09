import mongoose from "mongoose";
import { User } from "@/models/user.model";
import { TryCatch } from "@/utils/TryCatch.js";
import { NextResponse } from "next/server";


// ! api route to fetch recommended users for the logged-in user
// ! this route is protected and requires authentication
// ! api route: /api/protected/recommend-users

export const GET = TryCatch(async (request) => {
//   const userId = request.headers.get("x-user-id");
     const userId = request.headers.get("x-user-id");  // ✅ This is correct now

     if (!userId) {
         return NextResponse.json({ message: "Please login to continue" }, { status: 401 });
        }

  const objectId = new mongoose.Types.ObjectId(userId);

  const randomUsers = await User.aggregate([
    {
      $match: {
        _id: { $ne: objectId },
        $and: [
          { following: { $ne: objectId } },
          { followers: { $ne: objectId } },
        ],
      },
    },
    { $sample: { size: 4 } },
    {
      $project: {
        _id: 1,
        name: 1,
        profilePic: 1,
        bio: 1,
        followersCount: { $size: { $ifNull: ["$followers", []] } },
      },
    },
  ]);
  
  return NextResponse.json({ randomUsers }, { status: 200 });
});