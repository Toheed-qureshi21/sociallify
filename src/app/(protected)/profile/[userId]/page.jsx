import ProfilePage from "../ProfilePage";

export default async function OtherUserProfile({ params }) {
    const userId = await params.userId
  return <ProfilePage userId={userId} />;
}
