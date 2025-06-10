'use client';
import { getFeedPost } from '@/lib/api/post';
import { createContext, useContext, useEffect, useState } from 'react';

const UserCtx = createContext(null);
export const useUser = () => useContext(UserCtx);

export default function UserProvider({ initialUser, children,initialPost }) {
  const [user, setUser] = useState(initialUser || null);
  const [posts, setPosts] = useState(initialPost || []);
  const [isDeleting,setIsDeleting] =  useState(false);
  useEffect(() => {
    if (user?._id) {
      getFeedPost(user._id).then((feed) => {
        if (feed) {
          setPosts(feed);
          // window.location.reload()

        }
        
      });
    } else {
      console.log(posts);
      
    }
  }, [user]);


  return (
    <UserCtx.Provider value={{ user,setUser,posts,setPosts,isDeleting,setIsDeleting}}>
      {children}
    </UserCtx.Provider>
  );
}


