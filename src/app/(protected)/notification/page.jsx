'use client'

import NotificationLoading from "@/components/NotificationLoading";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getNotifications, handleMarkReadNotifications } from "@/lib/api/notification";
import { getNotificationIcon } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true)
      try {
        const data = await getNotifications();
        setNotifications(data?.notifications);
        const unreadNotificationIds = data?.notifications?.filter((n)=>!n.isRead).map((n)=>n._id);
        if(unreadNotificationIds){
         const {success} = await handleMarkReadNotifications(unreadNotificationIds);
          if (success) {
              setNotifications((prev)=>(
                prev.map((n)=>unreadNotificationIds.includes(n._id)?{...n,isRead:true}:n)
              ));
          }

        }    
        console.log(unreadNotificationIds);
      } catch (error) {
        toast(error?.message || error?.response?.data?.message || "Something went wrong", { closeButton: true });
      } finally {
        setIsLoading(false)
      }
    })()
  }, []);

  if (isLoading) {
    return (
      <NotificationLoading/>
    )
  }

  return (
    <div className="space-y-4 mt-8 h-fit ">
      <Card className="">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle > Notifications</CardTitle>
            <span className="text-sm text-muted-foreground">{notifications?.filter((notification) => !notification?.isRead)?.length} unread</span>
          </div>
        </CardHeader>
        <CardContent >
          <ScrollArea className="h-fit py-4">
            {
              notifications?.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">No notifications yet</div>
              ) : (
                notifications?.map((notification) => {
                  return (<div key={notification?._id}
                    className={`flex items-start flex-col  gap-4 p-2 sm:p-4  border-b hover:bg-muted/25 transition-colors 
                    
                  `}
                  >
                    <div className="flex items-start gap-4">
                    <Avatar className='space-y-2'  >
                      <AvatarImage src={notification?.senderUser?.profilePic || "/avatar.webp"} />
                    </Avatar>
                    <div className="flex flex-col space-y-2">
                      <div className="flex   items-center gap-2 ">
                        {getNotificationIcon(notification?.type)}
                        <span>
                          <span className="font-medium">
                            {notification?.senderUser?.name}
                          </span>
                          {" "}
                          {notification.type === "FOLLOW"
                            ? "started following you"
                            : notification.type === "LIKE"
                              ? "liked your post"
                              : "commented on your post"}
                        </span>
                      </div>
               
                    <p className="text-sm text-muted-foreground pl-6">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                    </div>
                    </div>
                    <div className="flex">

                    
                                 {
                        notification.post &&
                        (notification.type === "LIKE" || notification.type === "COMMENT") && (
                          <div className="pl-6 space-y-2">
                            <div className="text-sm text-muted-foreground rounded-md p-2 bg-muted/50 mt-2">
                              <p>{notification.post.content}</p>
                              {notification.post.image && (
                                <img
                                  src={notification.post.image}
                                  alt="Post content"
                                  className="mt-2 rounded-md w-full max-w-[200px] h-auto object-cover"
                                />
                              )}
                            </div>

                            {notification?.type === "COMMENT" && notification?.comment && (
                              <div className="text-md p-2 bg-accent/70   rounded-md">
                                {notification?.comment?.comment}
                              </div>
                            )}
                          </div>
                        )}
                        </div>
                  </div>)
                })
              )
            }
          </ScrollArea>
        </CardContent>
      </Card>

    </div>
  )
}