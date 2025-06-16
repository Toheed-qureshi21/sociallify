'use client';

import { toast } from "sonner";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession, signOut } from "next-auth/react";

export default function Logout() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    try {
      const response = await axios.post("/api/auth/logout");

      await signOut({ redirect: false });
      toast.success(response.data.message);

      router.push("/auth"); // manually redirect
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong", {
        closeButton: true,
      });
    }
  };

  return (
    <Button onClick={handleSignOut} className="w-full">
      Logout
    </Button>
  );
}
