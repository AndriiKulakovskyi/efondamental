import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const supabase = await createClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // User is logged in, redirect to protected page which will route to dashboard
    redirect("/protected");
  }

  // No user, go to login
  redirect("/auth/login");
}
