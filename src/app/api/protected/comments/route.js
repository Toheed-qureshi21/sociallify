// This is an API route (e.g. in /app/api/comments/route.js)
import { Comment } from "@/models/comment.model";
import { TryCatch } from "@/utils/TryCatch";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const GET = TryCatch(async(req) => {
  const { searchParams } = new URL(req.url);

  // Read postId from the request URL
  const postId = searchParams.get("postId");

  // 'cursor' means how many comments to skip (default = 0)
  const cursor = parseInt(searchParams.get("cursor") || "0");

  // 'limit' is how many comments to load at a time
  const limit = parseInt(searchParams.get("limit") || "5");

  // Check if postId is valid
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return NextResponse.json({ message: "Invalid postId" }, { status: 400 });
  }

  // Fetch 'limit' number of comments, skipping 'cursor' number
  const comments = await Comment.find({ postId })
    .sort({ createdAt: -1 })         // Newest first
    .skip(cursor)                    // Skip already loaded comments
    .limit(limit)                    // Load only 'limit' number
    .populate("userId", "name profilePic")
    .lean();

  const total = await Comment.countDocuments({ postId });

  return NextResponse.json({
    comments,
    nextCursor: cursor + comments.length,           // How many comments we’ve loaded now
    hasMore: cursor + comments.length < total       // Are more comments still left?
  });
}
)

// ! frontend
// 'use client';
// import { useState, useEffect } from "react";
// import { useInView } from "react-intersection-observer";

// const Comments = ({ postId }) => {
//   const [comments, setComments] = useState([]);     // All loaded comments
//   const [cursor, setCursor] = useState(0);          // How many comments loaded so far
//   const [hasMore, setHasMore] = useState(true);     // Are more comments available?

//   const { ref, inView } = useInView();              // Detect when a div is visible

//   const limit = 5; // How many comments to load each time

//   // Fetch comments from the backend
//   const fetchComments = async () => {
//     if (!hasMore) return;

//     const res = await fetch(`/api/comments?postId=${postId}&cursor=${cursor}&limit=${limit}`);
//     const data = await res.json();

//     // Add new comments to the existing list
//     setComments((prev) => [...prev, ...data.comments]);

//     // Update cursor and availability
//     setCursor(data.nextCursor);
//     setHasMore(data.hasMore);
//   };

//   // Load first few comments when component mounts
//   useEffect(() => {
//     fetchComments();
//   }, []);

//   // When the bottom of the list is visible, load more comments
//   useEffect(() => {
//     if (inView) {
//       fetchComments();
//     }
//   }, [inView]);

//   return (
//     <div>
//       {comments.map((comment) => (
//         <div key={comment._id} className="py-2 border-b">
//           <strong>{comment.userId.name}</strong>: {comment.comment}
//         </div>
//       ))}

//       {/* This is an empty div used to detect scroll near bottom */}
//       <div ref={ref} />

//       {/* Show message if all comments are loaded */}
//       {!hasMore && (
//         <p className="text-center text-gray-500 mt-2">No more comments</p>
//       )}
//     </div>
//   );
// };

// export default Comments;
