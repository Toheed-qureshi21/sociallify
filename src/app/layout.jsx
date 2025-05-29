import { Geist, Geist_Mono, Jaini } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ThemeWrapper from "@/components/ThemeWrapper";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
 export const jaini = Jaini({
  variable: "--font-jaini",
  subsets: ["latin"],
  weight:'400',
  display:'swap'
})

export const metadata = {
  title: "Sociallify",
  description: "Social Media web application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jaini.variable}antialiased`}
      >
        <div className="min-h-screen min-w-screen ">
          <ThemeWrapper>

          <Navbar/>
        {children}
          </ThemeWrapper>
        </div>
        <Toaster/>
      </body>
    </html>
  );
}
