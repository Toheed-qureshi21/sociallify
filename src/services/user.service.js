import { NextResponse } from "next/server";

export const toggleFollowAndUnfollow = async (currentUser,userToFollowOrUnfollow) => {
      const isFollowing = currentUser.following.includes(userToFollowOrUnfollow._id);
            if (isFollowing) {
                // We have to unfollow 
                currentUser.following = currentUser.following.filter((id)=>id.toString() !== userToFollowOrUnfollow._id.toString());
                userToFollowOrUnfollow.followers = userToFollowOrUnfollow.followers.filter((id)=>id.toString() !== currentUser._id.toString());
                await currentUser.save();
                await userToFollowOrUnfollow.save();
                return NextResponse.json({ message: `You have unfollowed ${userToFollowOrUnfollow.name}`,followed:false }, { status: 200 });
            } else {
                // WE have to follow that user so that his followers will increase by 1 and current user following will increase by 1
                currentUser.following.push(userToFollowOrUnfollow._id);
                userToFollowOrUnfollow.followers.push(currentUser._id);
                await currentUser.save();
                await userToFollowOrUnfollow.save();
                return NextResponse.json({ message: `You have followed ${userToFollowOrUnfollow.name}`,followed:true,currentUser }, { status: 200 });
            }
}