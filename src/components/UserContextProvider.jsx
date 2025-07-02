'use client';
import { getNotifications } from '@/lib/api/notification';
import { getFeedPost } from '@/lib/api/post';
import { fetchRandomUsers } from '@/lib/api/user';
import { createContext, useContext, useEffect, useState } from 'react';

const UserCtx = createContext(null);
export const useUser = () => useContext(UserCtx);

export default function UserProvider({ initialUser, children,initialPost,initialNotification }) {
  const [user, setUser] = useState(initialUser || null);
  const [posts, setPosts] = useState(initialPost || []);
  const [postLoading,setPostLoading] = useState(true);
  const [notifications,setNotifications] = useState(initialNotification || []);
  const [isDeleting,setIsDeleting] =  useState(false);
  
  useEffect(() => {
    if (user?._id) {
    
      getFeedPost(user._id).then((feed) => {
        if (feed) {
          setPosts(feed);
          setPostLoading(false);

        }
        setPostLoading(false);
        
      });

    } 
  }, [user]);

  return (
    <UserCtx.Provider value={{ user,setUser,posts,setPosts,isDeleting,setIsDeleting,notifications,setNotifications,postLoading}}>
      {children}
    </UserCtx.Provider>
  );
}


