'use client'
import { ThemeProvider } from "next-themes";

export default function ThemeWrapper({children}){
return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>{children}</ThemeProvider>
    )
 }