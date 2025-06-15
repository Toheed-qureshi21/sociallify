'use client'

import { Card, CardContent } from "./ui/card";
import { useUser } from "./UserContextProvider";
import UnauthanticatedSidebar from "./ui/UnauthanticatedSidebar";
import AuthanticatedSidebar from "./AuthanticatedSidebar";
export default function Sidebar(){
    const {user} = useUser();
return (
    <aside className="sticky top-20 ">
    <Card>
        {
            user ? (
                <AuthanticatedSidebar user={user}/>
            ) : (
                
                <UnauthanticatedSidebar/>
            )
        }
    </Card>
    </aside>
    )
 }