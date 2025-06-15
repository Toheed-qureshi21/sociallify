import { Notification } from "@/models/notification.model";
import { TryCatch } from "@/utils/TryCatch";
import { NextResponse } from "next/server";

// ! api route -> /api/protected/notifications/markread with post method
export const POST = TryCatch(async (request) => {
        const userId = request.headers.get("x-user-id");
        const {unreadNotificationIds} = await request.json();
        if (!userId) {
            return NextResponse.json({message:"Unauthorized please login first"},{status:401});
        }
        if (!unreadNotificationIds) {
            return NextResponse.json({message:" Please provide notification ids"},{status:400});    
        }
         await Notification.updateMany({_id:{$in:unreadNotificationIds},receiverUser:userId},{$set:{isRead:true}});
        return NextResponse.json({success:true});

})