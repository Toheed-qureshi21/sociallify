'use client';

import { Label } from "@radix-ui/react-label";
import { CardContent, CardFooter } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { loginUser, registerUser } from "@/lib/api/user";
import { Loader2 } from "lucide-react";
import {toast} from "sonner"
import { useUser } from "./UserContextProvider";
import { useRouter } from "next/navigation";

export default function LoginContent({ isLogin }) {
    const [name,setName] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const {setUser} = useUser(); 

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!formData.email || !formData.password || (!isLogin && !name)) {
            setLoading(false);
            return;
        }
        try {
            if (isLogin) {
            const data = await loginUser(formData);
            setUser(data.user);   
            setLoading(false);
             toast(data.message);
        } else {
            const data = await registerUser({ ...formData, name });
            setUser(data.user)
            setLoading(false);  
            toast(data.message);
            setFormData({ email: '', password: '' });
        }
        setLoading(false);
        setName('');
        setFormData({ email: '', password: '' });
        router.push("/");
        } catch (error) {
            toast.error(error?.response?.data?.message?.issues[0]?.message|| error?.response?.data?.message,{
                closeButton: true,
            });
            setLoading(false);
            setUser(null);
            console.log(error?.response?.data?.message?.issues[0]?.message);   
        }
        
        
    }


    return (
        <form onSubmit={handleFormSubmit} className="flex flex-col ">


            <CardContent className="space-y-6">
                {
                    !isLogin && (
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" required value={name} onChange={(e) => setName(e.target.value)}/>
                        </div>
                    )
                }
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}/>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" required value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}    />
                </div>
            </CardContent>
            <CardFooter className="flex flex-col">
                <Button type="submit" className={`w-full my-4 `}  disabled={loading || !formData.email || !formData.password}>
                    {
                        loading ? (
                            <>
                             <span>Wait unitl we process it..</span>
                             <span className="ml-2 animate-spin"><Loader2/></span>
                            </>
                        ) : (
                            isLogin ? 'Login' : 'Sign Up'
                        )
                    }
                
                </Button>
            </CardFooter>
        </form>
    )
}