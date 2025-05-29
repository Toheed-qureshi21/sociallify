'use client'

import { toast } from "sonner";
import { Button } from "./ui/button"
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Logout() {
    const router = useRouter();
    const signOut = async () => {
        try {
            const response = await axios.post('/api/auth/logout')
            toast.success(response.data.message);
            // router.push('/auth');
            window.location.href = '/auth';
        } catch (error) {
            console.log(error);
            toast.error(error?.message || 'Something went wrong',{
                closeButton: true,
            });
            
        }
    }

    return (
        <Button onClick={() => signOut()}>Logout</Button>
    )
}