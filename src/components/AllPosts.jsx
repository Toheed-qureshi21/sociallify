'use client'
import PostCard from "./PostCard";
import { useUser } from "./UserContextProvider";

export default function AllPosts(){
    const {posts,user} = useUser();
    console.log(posts);

return (
      <ul className="space-y-4">
    {posts?.length > 0 ? (
      posts?.map((p) => <PostCard key={p?._id} post={p} user={user} />)
    ) : (
      <div className="text-center text-muted-foreground mt-10">
        No posts available.
      </div>
    )}
  </ul>
    )
 }