import { Geist, Geist_Mono, Jaini } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ThemeWrapper from "@/components/ThemeWrapper";
import { Toaster } from "sonner";
import { fetchRandomUsers, getUser } from "@/lib/api/user";
import { cookies } from "next/headers";
import UserProvider from "@/components/UserContextProvider";
// import { getFeedPost } from "@/lib/api/post";
import { getFeedPost } from "@/lib/api/post";

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
  weight: "400",
  display: "swap",
});

export const metadata = {
  title: "Sociallify",
  description: "Social Media web application",
};

export default async function RootLayout({children }) {
  const cookieStore = await cookies()
  const user = await getUser(cookieStore);
  const cookieHeader = cookieStore.getAll()
  .map(c => `${c.name}=${c.value}`)
  .join('; ');
  let posts = []
  if (user) {
     posts = await getFeedPost(cookieHeader);
  }

  
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jaini.variable} antialiased`}
      >
        <ThemeWrapper>
          <UserProvider initialUser={user} initialPost={posts}>
            <div className="min-h-screen min-w-screen">
              <Navbar />
              <main>
                <div className="max-w-8xl mx-auto px-12">{children}</div>
              </main>
            </div>
          </UserProvider>
          <Toaster />
        </ThemeWrapper>
      </body>
    </html>
  );
}
