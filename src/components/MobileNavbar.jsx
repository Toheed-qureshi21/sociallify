"use client";
import { useState } from "react";
import { BellIcon, HomeIcon, MenuIcon, UserIcon } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { useUser } from "./UserContextProvider";
import Link from "next/link";
import Logout from "./Logout";

export default function MobileNavbar() {
  const [showMenu, setShowMenu] = useState(false);
  const { user } = useUser();
  return (
    <div className="flex lg:hidden items-center space-x-2">
      <div>
        <ThemeToggle />
      </div>
      <Sheet open={showMenu} onOpenChange={setShowMenu}>
        <SheetTrigger asChild>
          <Button variant="ghost">
            <MenuIcon size={20} />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-64">
                <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col space-y-4 mt-6 px-4">
                 <Button variant="ghost" className="flex items-center gap-3 justify-start" asChild>
              <Link href="/">
                <HomeIcon className="w-4 h-4" />
                Home
              </Link>
            </Button>

            {
                user ? (
                        <>
                           <Button variant="ghost" className="flex items-center gap-3 justify-start" asChild>
                  <Link href="/notification">
                    <BellIcon className="w-4 h-4" />
                    Notifications
                  </Link>
                </Button>
                  <Button variant="ghost" className="flex items-center gap-3 justify-start" asChild>
                  <Link href="/profile">
                    <UserIcon className="w-4 h-4" />
                    Profile
                  </Link>
                </Button>
                <Logout/>   
                        </>
                ):(
                    <>
                  <Button>
            <Link href="/auth" className="nav-links">
              Sign in
            </Link>
          </Button>
                    </>
                )
            }

          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
