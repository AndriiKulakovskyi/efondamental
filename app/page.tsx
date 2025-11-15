import { getUserContext } from "@/lib/rbac/middleware";
import { getDefaultRedirectForRole } from "@/lib/rbac/roles";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const context = await getUserContext();

  if (context) {
    const redirectPath = getDefaultRedirectForRole(context.profile.role);
    redirect(redirectPath);
  }

  redirect("/auth/login");
}
