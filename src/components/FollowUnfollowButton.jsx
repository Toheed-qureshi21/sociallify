"use client";

import { followAndUnfollow } from "@/lib/api/user";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useUser } from "./UserContextProvider";

const FollowUnfollowButton = ({ user, isFollowing, setIsFollowing}) => {
    const [loading,setLoading] = useState(false);   
    const {setUser} = useUser();
     const handleFollowAndUnfollow = async(userId) => {
        if (loading) return;
        try {
            setLoading(true);
            // const message = "hello"
            const {followed,message,currentUser} = await followAndUnfollow(userId);
          if (followed) {
            setIsFollowing(true);
          }
          setUser(currentUser);
          return toast(message);
        } catch (error) {
          toast(error?.message || "Something went wrong", { closeButton: true });
        }finally{
            setLoading(false);
        }
      }
  return (
    <Button
      onClick={() => handleFollowAndUnfollow(user?._id)}
      className="flex gap-1 items-center"
      variant="outline"
    >
  {loading && <Loader2 className="w-4 h-4 mr-2 inline animate-spin" />}
  {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowUnfollowButton;
