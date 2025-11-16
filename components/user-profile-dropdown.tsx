"use client";

import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, ChevronDown } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface UserProfileDropdownProps {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export function UserProfileDropdown({
  firstName,
  lastName,
  email,
  role,
}: UserProfileDropdownProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 outline-none focus:outline-none">
        <div className="text-right">
          <p className="text-sm font-medium text-slate-900">
            {firstName} {lastName}
          </p>
          <p className="text-xs text-slate-500 capitalize">
            {role.replace(/_/g, " ")}
          </p>
        </div>
        <Avatar firstName={firstName} lastName={lastName} />
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div>
            <p className="font-medium">{firstName} {lastName}</p>
            <p className="text-xs font-normal text-slate-500">{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

