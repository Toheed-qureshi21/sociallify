'use client'
import  Link  from "next/link";
import { Button } from "./button";
import { CardContent, CardHeader, CardTitle } from "./card";

export default function UnauthanticatedSidebar(){
return (
    <>
    <CardHeader>
        <CardTitle className="text-center font-semibold">Welcome Back!</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col items-center justify-center">
        <p className="text-center text-muted-foreground mb-4">
            Login to access your account and connect with friends.
        </p>
        <Link href="/auth" className="nav-links w-full">
        <Button className="w-full">
        Login
        </Button>
        </Link>
    </CardContent>
    </>
    )
 }