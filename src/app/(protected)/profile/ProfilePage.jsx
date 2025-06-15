// components/ProfilePage.jsx
'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/components/UserContextProvider';
import {Button} from "@/components/ui/button";
// import { followUser, unfollowUser, getUserById } from '@/lib/api/user'; // You must implement these
import { toast, Toaster } from 'sonner';
import PostCard from '@/components/PostCard';
import { getUserById } from '@/lib/api/user';

export default function ProfilePage({ userId }) {
  const { user: loggedInUser } = useUser();
  const [profileUser, setProfileUser] = useState(null);
//   const [isFollowing, setIsFollowing] = useState(false);
//   const [posts, setPosts] = useState([]);

  const isOwnProfile = loggedInUser?._id === userId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { anotherUser: user} = await getUserById(userId);
        console.log(user);
        
        setProfileUser(user);
        // setPosts(posts);
       
      } catch (err) {
    toast(err?.message || 'Failed to load profile');
      }
    };
    fetchData();
  }, [userId]);

//   const handleFollow = async () => {
//     try {
//       await followUser(userId);
//       setIsFollowing(true);
//     } catch (err) {
//       toast.error(err?.message || 'Could not follow');
//     }
//   };

//   const handleUnfollow = async () => {
//     try {
//       await unfollowUser(userId);
//       setIsFollowing(false);
//     } catch (err) {
//       toast.error(err?.message || 'Could not unfollow');
//     }
//   };

//   if (!profileUser) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile header */}
      <div className="flex items-center gap-4">
        <img
          src={profileUser?.profilePic || '/avatar.webp'}
          alt="profile"
          className="w-20 h-20 rounded-full"
        />
        <div>
          <h1 className="text-xl font-semibold">{profileUser?.name}</h1>
          <p className="text-muted-foreground">@{profileUser?.name}</p>
        </div>
        <div className="ml-auto">
          {isOwnProfile ? (
            <Button>Edit Profile</Button>
          ) : (
            <Button 
            // onClick={isFollowing ? handleUnfollow : handleFollow}
            >
              {/* {isFollowing ? 'Unfollow' :  */}
              Follow
            {/* //  { }} */}
            </Button>
          )}
        </div>
      </div>

      {/* User Bio */}
      {profileUser?.bio && (
        <p className="text-muted-foreground">{profileUser?.bio}</p>
      )}

      {/* User Posts */}
      {/* <div className="space-y-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post._id} post={post} user={loggedInUser} />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No posts yet
          </div>
        )}
      </div> */}
    </div>
  );
}
