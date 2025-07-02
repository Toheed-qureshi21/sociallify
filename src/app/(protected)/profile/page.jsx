'use client';
import { useUser } from '@/components/UserContextProvider';
import UserProfileView from '@/components/UserProfileView';

export default function MyProfile() {
  const { user, posts } = useUser();

  return (
    <UserProfileView profileUser={user} isOwnProfile={true} posts={posts} />
  );
}
