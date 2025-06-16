'use client'

import { signIn, useSession } from "next-auth/react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"

export default function AuthButtons() {
    const { data: session } = useSession()
    const router = useRouter();
    return (
        <>
            <Button variant='secondary' onClick={() => {
                signIn('google',{callbackUrl:`/`})
               
            }
                } className="w-full flex items-center gap-2">Login with Google
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.36 0 6.39 1.15 8.76 3.04l6.52-6.52C34.67 2.55 29.67 0 24 0 14.64 0 6.57 5.7 2.64 14.02l7.79 6.06C12.03 13.4 17.58 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.1 24.56c0-1.56-.14-3.05-.39-4.5H24v8.5h12.5c-.54 2.85-2.18 5.26-4.62 6.92l7.36 5.73C43.81 37.04 46.1 31.25 46.1 24.56z" />
                    <path fill="#FBBC05" d="M10.43 28.08A14.87 14.87 0 019.5 24c0-1.42.2-2.8.57-4.08l-7.79-6.06A23.933 23.933 0 000 24c0 3.83.92 7.45 2.57 10.61l7.86-6.53z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.91-2.14 15.88-5.8l-7.36-5.73C30.71 37.39 27.55 38.5 24 38.5c-6.41 0-11.96-3.9-13.57-9.57l-7.86 6.53C6.57 42.3 14.64 48 24 48z" />
                </svg>
            </Button>
        </>
    )
}  