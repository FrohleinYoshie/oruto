import GuestTopPage from "@/features/top/guest/GuestTopPage";
import UserTopPage from "@/features/top/User/UserTopPage";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    return <UserTopPage />;
  }

  return (
    <GuestTopPage />
  );
}