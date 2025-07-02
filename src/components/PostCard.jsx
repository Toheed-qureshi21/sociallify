"use client";

import Link from "next/link";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea"; // ← import your Textarea
import { HeartIcon, MessageCircle, SendIcon, Trash2Icon } from "lucide-react"; // ← import SendIcon
import DeleteDialog from "./DeleteDialog";
import { useUser } from "./UserContextProvider";
import { toggleLike, deletePost, createComment } from "@/lib/api/post";
import { Dialog } from "./ui/dialog";
import axiosInstance from "@/lib/axios";

export default function PostCard({ post, user }) {
  const [hasLiked, setHasLiked] = useState(post.hasLiked ?? false);
  const [isLiking, setIsLiking] = useState(false);
  const [optimisticLikes, setOptimisticLikes] = useState(post?.likesCount ?? 0);
  const [showComments, setShowComments] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentLoading,setCommentLoading] = useState(false);

  const { setIsDeleting, setUser, setPosts } = useUser();

  // Like/unlike handler
  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);

    // Store current state before changing
    const prevLiked = hasLiked;
    const prevLikes = optimisticLikes;

    // Optimistically update
    setHasLiked(!prevLiked);
    setOptimisticLikes(prevLiked ? prevLikes - 1 : prevLikes + 1);

    try {
      await toggleLike(post._id);
    } catch (err) {
      toast(err?.message || "Something went wrong", { closeButton: true });

      setHasLiked(prevLiked);
      setOptimisticLikes(prevLikes);
    } finally {
      setIsLiking(false);
    }
  };


  // Delete post handler
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const data = await deletePost(post._id);
      toast(data.message, { closeButton: true });
      setUser(data.user);
      setPosts((prev) => prev.filter((p) => p._id !== post._id));
    } catch (err) {
      toast(err?.response?.data?.message || "Something went wrong", {
        closeButton: true, i
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Comment submission handler
  const handleComment = async () => {
    if (!commentText.trim()) return;
    setIsCommenting(true);
    try {
      const data = await createComment(commentText, post._id);
      toast(data?.message, { closeButton: true });
      console.log(data, "data");


      setPosts((prev) =>
        prev.map((p) =>
          p._id === post._id
            ? {
              ...p,
              commentCount: (p.commentCount ?? 0) + 1,
              comments: [data?.addedComment, ...p?.comments],
            }
            : p
        )
      );
      console.log("Post after comment ", post);

      setCommentText(""); 7
    } catch (err) {
      toast(
        err?.response?.data?.message ||
        err?.message ||
        "Could not post comment",
        {
          closeButton: true,
        }
      );
    } finally {
      setIsCommenting(false);
    }
  };

  const handleCommentDelete = async (commentId) => {
    setIsDeleting(true)
    try {

      const { data } = await axiosInstance.delete(`/protected/comments/delete-comment?commentId=${commentId}`);
      setPosts((prev) =>
        prev?.map((p) =>
          p?._id === post?._id
            ? {
              ...p,
              commentCount: Math.max(0, (p.commentCount ?? 1) - 1),
              comments: p.comments?.filter((c) => c._id !== commentId),
            }
            : p
        )
      );
      toast(data.message);
    } catch (error) {
      toast(error?.response?.data?.message);
    }finally {
      setIsDeleting(false);
    }
  }



  return (
    <Card className="overflow-hidden space-y-4">
      <CardContent className="p-4 sm:p-6">
        {/* Header: avatar, name, timestamp, delete */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Link href={`/profile/${post.userId?._id}`}>
            <Avatar className="size-8 sm:w-10 sm:h-10">
              <AvatarImage src={post.userId?.profilePic || "/avatar.webp"} />
            </Avatar>
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center">
              <div className="truncate">
                <Link
                  href={post?.userId?._id === user?._id ? '/profile' : `/profile/${post.userId?._id}`}
                  className="font-semibold truncate"
                >
                  {post.userId?.name}
                </Link>
                <div className="flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground">
                  <Link href={`/profile/${post.userId?._id}`}>
                    @{post.userId?.name}
                  </Link>
                  <span>•</span>
                  <span>
                    {formatDistanceToNow(new Date(post?.createdAt))} ago
                  </span>
                </div>
              </div>
              {user?._id === post.userId?._id && (
                <DeleteDialog isPost={true} onDelete={handleDelete} />
              )}
            </div>
          </div>
        </div>
        <p className="mt-2 text-sm sm:text-md text-foreground break-words mb-2">
          {post?.content}
        </p>

        {/* Image */}
        {post.image && (
          <div className="rounded-lg overflow-hidden mt-8">
            <img
              src={post.image}
              alt="Post image"
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Actions: Like, Comment toggle */}
        <div className="flex items-center pt-2 space-x-4">
          {user ? (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground gap-2"
              onClick={handleLike}
              disabled={isLiking}
            >
              <HeartIcon
                className={`size-5 ${hasLiked ? "text-red-500 fill-red-500" : ""}`}
              />
              <span>{optimisticLikes}</span>
            </Button>
          ) : (
            <Link href="/auth">
              <Button variant="ghost" size="sm">
                <HeartIcon className="size-5" />
              </Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground gap-2 hover:text-blue-500"
            onClick={() => {
              setShowComments((prev) => !prev)
              setShowCommentInput((prev) => !prev)
            }}
          >
            <MessageCircle className="size-5" />
            <span>{post.commentCount ?? 0}</span>
          </Button>
        </div>

        {/* Comments list */}
        {showComments && post.comments?.length > 0 && (
          <div className="space-y-2 pt-2 border-t h-[15rem] overflow-y-scroll no-scrollbar">
            {(post?.comments).map((c, index) => (
              <div key={c?._id ?? index} className="flex space-x-3 py-4 items-center justify-between">
                <div className="flex py-2 space-x-3">
                  <Avatar className="size-8 flex-shrink-0">
                    <AvatarImage src={c?.userId?.profilePic || "/avatar.webp"} />
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="font-medium text-sm">
                        {c?.userId?.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        @{c?.userId?.name}
                      </span>
                      <span className="text-sm text-muted-foreground">·</span>
                      <span className="text-sm text-muted-foreground">
                        {c?.createdAt && !isNaN(new Date(c.createdAt).getTime())
                          ? `${formatDistanceToNow(new Date(c.createdAt))} ago`
                          : "just now"}
                      </span>
                    </div>
                    <p className="text-sm break-words">{c?.comment}</p>
                  </div>
                </div>
                {
                  c?.userId?._id === user?._id && <DeleteDialog isPost={false} onDelete={() => handleCommentDelete(c._id ?? index)} />
                }

              </div>
            ))}
          </div>
        )}

        {/* New comment input */}
        {user && showCommentInput && (
          <div className="flex space-x-3 pt-4 border-t">
            <Avatar className="size-8 flex-shrink-0">
              <AvatarImage src={user.profilePic || "/avatar.webp"} />
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              <div className="flex justify-end mt-2">
                <Button
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={handleComment}
                  disabled={!commentText.trim() || isCommenting}
                >
                  {isCommenting ? (
                    "Posting..."
                  ) : (
                    <>
                      <SendIcon className="size-4" />
                      Comment
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
