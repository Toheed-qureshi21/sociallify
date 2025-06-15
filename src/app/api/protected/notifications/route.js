import { Notification } from "@/models/notification.model";
import { TryCatch } from "@/utils/TryCatch";
import { NextResponse } from "next/server";

// ! api route -> /api/protected/notifications with get method
export const GET = TryCatch(async (request) => {
    const userId = request.headers.get("x-user-id");

    const notifications = await Notification.find({ receiverUser: userId })
    .populate("senderUser", "name profilePic")
    .populate("comment", "comment")
    .populate("post", "content image")
    .sort({ createdAt: -1 })
    .lean();
    return NextResponse.json({ notifications });
})