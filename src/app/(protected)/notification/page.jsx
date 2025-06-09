import { headers } from "next/headers";

export default async function Notification(){
    const headersList = await headers();
  const userId =  headersList.get("x-user-id");
  if (!userId) {
    return (
        <p>No user found </p>
    )
  }
return (
    <div>Notification {userId}</div>
    )
 }