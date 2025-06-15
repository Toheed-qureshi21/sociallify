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
  const [notifications,setNotifications] = useState(initialNotification || []);
  const [isDeleting,setIsDeleting] =  useState(false);
  
  useEffect(() => {
    if (user?._id) {
      getFeedPost(user._id).then((feed) => {
        if (feed) {
          setPosts(feed);
          // window.location.reload()

        }
        
        
      });
      // getNotifications(user._id).then((res) => {
      //   if (res?.notifications) {
      //     setNotifications(res.notifications);
      //   }
      // });
    } 
  }, [user]);

  return (
    <UserCtx.Provider value={{ user,setUser,posts,setPosts,isDeleting,setIsDeleting,notifications,setNotifications}}>
      {children}
    </UserCtx.Provider>
  );
}


