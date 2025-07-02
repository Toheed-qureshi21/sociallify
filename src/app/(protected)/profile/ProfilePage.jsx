'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/components/UserContextProvider';
import { getUserById } from '@/lib/api/user';
import { toast } from 'sonner';
import UserProfileView from '@/components/UserProfileView';

export default function ProfilePage({ userId }) {
  const { user: loggedInUser,setPosts,posts } = useUser();
  const [profileUser, setProfileUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserById(userId);
        console.log("another user ",data);
        
        setProfileUser(data.anotherUser);
        setPosts(data.posts);
      } catch (err) {
        toast(err?.message ?? err.response.data.message ?? 'Failed to load profile');
      }
    };
    fetchData();
  }, []);

  if (!profileUser) return null;

  const isOwnProfile = loggedInUser?._id === profileUser._id;

  return (
    <UserProfileView
      profileUser={profileUser}
      isOwnProfile={isOwnProfile}
      posts={posts}
    />
  );
}
