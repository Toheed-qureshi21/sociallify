"use client";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";
import { Bell, Home, User2 } from "lucide-react";
import Logout from "./Logout";
import { useUser } from "./UserContextProvider";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function DesktopNavbar() {
  const { user } = useUser();
  let firstNameLetter = "";
  let surnameLetter=""
  if (user) {
    const fullName = user.name;
    const parts = fullName.trim().split(" ");
  
     firstNameLetter = parts[0].charAt(0);
 
    if (parts.length === 2) {
       surnameLetter = parts[1].charAt(0);
    }
  }

  return (
    <ul className="hidden lg:flex gap-12 items-center">
      <li>
        <ThemeToggle />
      </li>
      <li>
        <Link href="/" className="nav-links">
          <Home size={20} />
          Home
        </Link>
      </li>
      {user ? (
        <>
          <li>
            <Link href="/notification" className="nav-links">
           <span className="relative">
  <Bell size={20} />
  {/* { notifications.length !== 0 && notifications?.filter((n) => !n.isRead).length > 0 && (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] min-w-[16px] h-[16px] px-[4px] rounded-full flex items-center justify-center">
      {notifications.filter((n) => !n.isRead).length}
    </span>
  )} */}
</span>

              Notification
            </Link>
          </li>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center hover:cursor-pointer text-white">
                {firstNameLetter}
                {surnameLetter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40 mt-1 mr-4 bg-accent">
              <DropdownMenuItem asChild>
                <Link href="/profile" className="nav-links hover:cursor-pointer flex items-center gap-2 ">
                  <User2 size={16} />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <div className="flex w-full">
                  <Logout />
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <li>
          <Button>
            <Link href="/auth" className="nav-links">
              Sign in
            </Link>
          </Button>
        </li>
      )}
    </ul>
  );
}
