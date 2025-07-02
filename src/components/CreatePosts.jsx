"use client";

import { useState } from "react";
import { useUser } from "./UserContextProvider";
import { Textarea } from "./ui/textarea";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { ImageIcon, Loader2, SendIcon, XIcon } from "lucide-react";
import { Button } from "./ui/button";
import { createPost } from "@/lib/api/post";
import { toast } from "sonner";


export default function CreatePosts() {
  const { user,setUser,setPosts } = useUser();
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isPosting, setIsPosting] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) return;
    setIsPosting(true);
    try {
      const formData = new FormData();
      formData.append("text", text);
      if (image) {
        formData.append("image", image);
      }
      const data = await createPost(formData);
      if (data.success) {
        toast(data.message, { closeButton: true });
        setUser(data.user)
        setPosts(prev=>([...prev,data.newPost]));
      }
    } catch (error) {
      toast(error?.message || "Something went wrong", { closeButton: true });
    } finally {
      setText("");
      setImage(null);
      setPreviewUrl(null);
      setIsPosting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  if (!user) return null;

  return (
    <Card className="mb-6">
      <CardContent className="pt-3">
        <form onSubmit={handleFormSubmit}>
          <div className="space-y-4 mt-2">
            <div className="flex gap-4">
              <Avatar className="w-8 h-8 mb-2">
                <AvatarImage
                  className="w-8 h-8"
                  src={user?.profilePic || "/avatar.webp"}
                  alt={user?.name}
                />
              </Avatar>
              <Textarea
                className="min-h-[100px] resize-none border-none outline-none focus-visible:ring-0 p-4 "
                placeholder={`What's on your mind, ${user?.name || "User"}?`}
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={isPosting}
              />
            </div>

            {previewUrl && (
              <div className="relative w-full max-w-xs rounded-md overflow-hidden border sm:ml-12">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full object-cover h-fit"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-white/80 rounded-full p-1"
                  onClick={() => {
                    setImage(null);
                    setPreviewUrl(null);
                  }}
                >
                  <XIcon size={16} />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex space-x-2">
                <label htmlFor="upload-photo">
                  <Button variant="ghost" asChild>
                    <div className="flex items-center cursor-pointer">
                      <ImageIcon size={16} />
                      <span className="ml-1">Photo</span>
                    </div>
                  </Button>
                </label>
                <input
                  id="upload-photo"
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <Button
                className={`flex items-center ${isPosting ? "cursor-not-allowed" : ""}`}
                type="submit"
                disabled={isPosting || (!text.trim() && !image)}
              >
                {isPosting ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Posting...
                  </>
                ) : (
                  <>
                    <SendIcon size={16} className="mr-2" />
                    Post
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
