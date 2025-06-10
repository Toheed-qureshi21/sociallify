"use client";
import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { formatDistanceToNow } from "date-fns";
import DeleteDialog from "./DeleteDialog";
import { Button } from "./ui/button";
import { HeartIcon, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { toggleLike } from "@/lib/api/post";


export default function PostCard({ post, user }) {
  const [hasLiked,setHasLiked] = useState(false);
  const [isLiking,setIsLiking] = useState(false);
  const [isDeleting,setIsDeleting] =  useState(false);
  const [optimisticLikes,setIsOptimisticLikes] = useState(post?.likesCount);

  const handleLike = async () => {
    if(isLiking) return;

    try {
      setIsLiking(true);
      setHasLiked((prev)=>!prev);
      setIsOptimisticLikes((prev) => (hasLiked ? prev - 1 : prev + 1));
      await toggleLike(post?._id);
    } catch (error) {
      toast(error?.message || "Something went wrong", { closeButton: true });
    }finally{
       setIsLiking(false);
    }
  }

  return (
    <Card className="overflow-hidden space-y-4">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4">
          <div className="flex space-x-3 sm:space-x-4">
            <Link href={`/profile/${post?.userId?._id}`}>
              <Avatar className="size-8 sm:w-10 sm:h-10">
                <AvatarImage src={post?.userId?.profilePic || "/avatar.webp"} />
              </Avatar>
            </Link>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between ">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 truncate">
                  <Link
                    href={`/profile/${post?.userId._id}`}
                    className="font-semibold truncate"
                  >
                    {post?.userId?.name}
                  </Link>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Link href={`/profile/${post.userId?._id}`}>
                      @{post?.userId?.name}
                    </Link>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(new Date(post.createdAt))} ago
                    </span>
                  </div>
                </div>
                {/* Deleting post button if post.userId._id === user._id */}
                {post.userId._id === user._id && <DeleteDialog />}
              </div>
              <p className="mt-2 text-sm text-foreground break-words">
                {post.content}
              </p>
            </div>
          </div>
          {/* Post image */}
          {post?.image && (
            <div className="rounded-lg overflow-hidden ">
              <img
                src={post.image}
                alt="Post content"
                className="w-full  h-fit object-cover"
              />
            </div>
          )}

          {/* Like and comment button */}

          <div className="flex items-center  pt-2 space-x-4">
            {
              user ? (
                <div className="flex flex-col gap-2 items-center">

                <Button variant='ghost' size='sm' className='text-muted-foreground gap-2' onClick={handleLike} disabled={isLiking}>
                    {
                      hasLiked  ? (
                        <HeartIcon className="size-5 text-red-500 fill-red-500"/>
                      ):(
                        <HeartIcon className="size-5"/>
                        
                      )
                    }
                </Button>
                    <span>{optimisticLikes}</span>
                    {/* <span>{post.likesCount}</span> */}
                    </div>
              ):(
                // If user is not logged in we have to redirect them into login page
                <Link href="/auth">
                  <Button variant='ghost' size='sm'>
                    <HeartIcon className="size-5"/>
                  </Button>
                </Link>
              )
            }
                 <div className="flex flex-col gap-2 items-center">

            {/* Comment */}
            <Button variant='ghost' size='sm' className='text-muted-foreground gap-2 hover:text-blue-500'>
              <MessageCircle className="size-5"/>
            </Button>
              <span>{post.commentCount}</span>
                 </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
