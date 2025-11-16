"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  firstName: string;
  lastName: string;
  className?: string;
}

export function Avatar({ firstName, lastName, className }: AvatarProps) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  return (
    <div
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full bg-slate-700 text-sm font-medium text-white",
        className
      )}
    >
      {initials}
    </div>
  );
}

