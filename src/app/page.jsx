import AllPosts from "@/components/AllPosts";
import CreatePosts from "@/components/CreatePosts";
import RecommendToFollow from "@/components/RecommendToFollow";
import Sidebar from "@/components/Sidebar";
import { getFeedPost } from "@/lib/api/post";
import { cookies } from "next/headers";


export default async function Home(){
  const cookieStore = await cookies()
    const cookieHeader = cookieStore.getAll()
  .map(c => `${c.name}=${c.value}`)
  .join('; ');
    const posts = await getFeedPost(cookieHeader) 
  
return (  
     
  <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-6 px-4 sm:px-8 mt-12">
    <aside className="hidden md:block md:col-span-4 lg:col-span-3 xl:col-span-3">
      <Sidebar />
    </aside>

    <section className="md:col-span-8 lg:col-span-5 xl:col-span-6 space-y-6">
      <CreatePosts />
      <AllPosts />
    </section>

    <aside className="hidden lg:block lg:col-span-3 sticky top-20">
      <RecommendToFollow />
    </aside>
  </div>


    )
 }