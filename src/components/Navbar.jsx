import { jaini } from "@/app/layout";

import DesktopNavbar from "./DesktopNavbar";
import Link from "next/link";
import MobileNavbar from "./MobileNavbar";
export default async function Navbar(){
  
return (
     <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="max-w-8xl mx-auto px-12">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className={`${jaini.className} text-4xl font-bold text-primary  tracking-wider`}>
              Socially
            </Link>
          </div>
          <DesktopNavbar />
          <MobileNavbar/>
        </div>
      </div>
    </nav>
    )
 }