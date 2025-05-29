import { jaini } from "@/app/layout";
import ThemeToggle from "./ThemeToggle";
import Link from "next/link";
import { Bell, Home,User2 } from "lucide-react";
import Logout from "./Logout";

export default async function Navbar(){
    const fullName= "Toheed Qureshi"
    const parts = fullName.trim().split(" ")

    const firstNameLetter = parts[0].charAt(0);
const surnameLetter = parts[1].charAt(0);
return (
    <nav className="w-screen flex items-center justify-between py-6 px-16  border-b shadow-sm backdrop:blur ">
        <h1 className={`${jaini.className} text-4xl tracking-wider`}>Sociallify</h1>
        <ul className="flex gap-12 items-center">
            <li><ThemeToggle/></li>
            <li>
                <Link href='/' className="nav-links" ><Home size={20}/>Home</Link>
            </li>
            <li>
                <Link href='/notification' className="nav-links" ><Bell size={20}/>Notification</Link>
            </li>
            <li>
                <Logout/>
            </li>
            <li>
                <Link href='/admin' className="nav-links" >Dashboard</Link>
            </li>
            <li>
                <Link href='/profile' className="nav-links" ><User2 size={20}/>Profile</Link>
            </li>
            <li className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:cursor-pointer text-white">
                {firstNameLetter}{surnameLetter}
            </li>
        </ul>
    </nav>
    )
 }