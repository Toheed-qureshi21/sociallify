"use client";
import { fetchRandomUsers, followAndUnfollow } from "@/lib/api/user";
import { useEffect, useState } from "react";
import { useUser } from "./UserContextProvider";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import FollowUnfollowButton from "./FollowUnfollowButton";

export default function RecommendToFollow() {
  const [randomUsers,setRandomUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const [isFollowing,setIsFollowing] = useState(user?.following.includes(randomUsers?._id));
  
  useEffect(() => {
  
    (async ()=>{
      setLoading(true);
         const data = await fetchRandomUsers();
        setRandomUsers(data);
        setLoading(false);
    })();

  }, [user]);
  const handleFollowAndUnfollow = async(userId) => {
    try {
      const {followed,message,currentUser} = await followAndUnfollow(userId);
      if (followed) {
        setIsFollowing(true);
      }
      setUser(currentUser);
      return toast(message);
    } catch (error) {
      toast(error?.message || "Something went wrong", { closeButton: true });
    }
  }
  
  if (!user) return null;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommend to follow</CardTitle>
      </CardHeader>
      <CardContent>
        {
          loading ? (
           <div className="flex justify-center items-center">
              <Loader2Icon className="animate-spin"/>
           </div>
          ):(
             <ul className="space-y-4">
            {
              randomUsers?.map((user)=>{
                return (
                  <li key={user._id} className="flex gap-2 p-2  rounded-md items-center justify-between cursor-pointer">
                      <Link href={`/profile/${user?._id}`} className="flex items-center gap-2">
              
                          <Avatar>
                            <AvatarImage src={user.profilePicture ?? "/avatar.webp"}/>
                          </Avatar>
                       
                        <div className="text-xs">
                          {user?.name}
                        <p className="text-muted-foreground flex">{user?.followersCount} followers</p>
                        </div>
                      </Link>
                       <FollowUnfollowButton user={user} isFollowing={isFollowing} setIsFollowing={setIsFollowing}/>
                  </li>
                )
              })
            }
        </ul>
          )

        }
       
      </CardContent>
    </Card>
  );
}
