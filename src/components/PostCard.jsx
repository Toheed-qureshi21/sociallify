"use client";
import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { formatDistanceToNow } from "date-fns";
import DeleteDialog from "./DeleteDialog";
import { Button } from "./ui/button";
import { HeartIcon } from "lucide-react";
import { useState } from "react";
import { Linden_Hill } from "next/font/google";

export default function PostCard({ post, user }) {
  const [hasLiked,setHasLiked] = useState(false);

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

          <div className="flex items-center pt-2 space-x-4">
            {
              user ? (
                <Button variant='ghost' size='sm' className='text-muted-foreground gap-2' onClick={() => setHasLiked(!hasLiked)}>
                    {
                      hasLiked  ? (
                        <HeartIcon className="size-5 text-red-500 fill-red-500"/>
                      ):(
                        <HeartIcon className="size-5"/>

                      )
                    }
                    {/* <span>{optimisticLikes}</span> */}
                </Button>
              ):(
                <Link href="/auth"></Link>
              )
            }
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
