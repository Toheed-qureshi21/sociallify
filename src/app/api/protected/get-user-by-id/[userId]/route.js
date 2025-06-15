    import { User } from "@/models/user.model";
    import { TryCatch } from "@/utils/TryCatch";
    import { NextResponse } from "next/server";

    // ! api route -> /api/protected/get-user-by-id/{userId}

    export const GET = TryCatch(async (request) => {
        // another user details
        const {searchParams} = new URL(request.nextUrl);
        const userId = request.headers.get("x-user-id");
        if (!userId) {
            return NextResponse.json({message:"Unauthorized please login first"},{status:401});
        }
        const anotherUserId =  searchParams.get("userId");
        if (!anotherUserId) {
            return NextResponse.json({ message: "Invalide user" }, { status: 401 });
        }
        const anotherUser = await User.findById(anotherUserId);
        if (!anotherUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, anotherUser }, { status: 200 });
    })