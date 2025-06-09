'use client'
import Link from "next/link";
import { CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { useUser } from "./UserContextProvider";

export default function AuthanticatedSidebar() {
    const { user } = useUser()
    return (
    <CardContent>
            <div className="flex flex-col items-center text-center">
                <Link href='/profile' className="nav-links flex flex-col  items-center justify-center" >
                    <Avatar className="w-20 h-20 border-2" >
                        <AvatarImage src={user?.profilePic || "/avatar.webp"} />
                    </Avatar>
                    <div className="mt-4 space-y-1">
                        <h3 className="font-semibold">{user?.name}</h3>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                </Link>
                {user.bio && <p className="mt-3 text-sm text-muted-foreground">{user?.bio}</p>}
                <Separator className="my-4" />
                
            <div className="w-full flex gap-4 justify-center">
                
                <div className="flex justify-between">
                    <div>
                        <p className="font-medium">{user?.posts?.length}</p>
                        <p className="text-sm text-muted-foreground">Posts</p>
                    </div>  
                </div>
                <Separator orientation="vertical" />
                <div className="flex justify-between">
                    <div>
                        <p className="font-medium">{user?.following?.length}</p>
                        <p className="text-sm text-muted-foreground">Following</p>
                    </div>  
                </div>
                <Separator orientation="vertical" />
                 <div>
                  <p className="font-medium">{user?.followers?.length}</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
              </div>
               <Separator className="my-4" />
            </div>
        </CardContent>
    )
}