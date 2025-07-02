import axiosInstance from '@/lib/axios';
import ProfilePage from '../ProfilePage';
import { headers } from 'next/headers';

export default async function OtherUserProfile({ params }) {
  const { userId } = await params;
 const headerList  = await headers()
  const loggedInUserId =  headerList.get("x-user-id");
  
  return(
    <ProfilePage userId={userId}/>
  )
}
