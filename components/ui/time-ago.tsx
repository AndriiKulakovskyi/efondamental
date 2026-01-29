"use client";

import { useEffect, useState } from "react";
import { formatTimeAgo } from "@/lib/utils/date";

interface TimeAgoProps {
  date: string | Date | null;
  fallback?: string;
  className?: string;
}

/**
 * A client-only component to render relative time.
 * Prevents hydration errors by only rendering dynamic relative time on the client.
 */
export function TimeAgo({ date, fallback = "Never", className }: TimeAgoProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !date) {
    return <span className={className}>{fallback}</span>;
  }

  return (
    <span className={className} title={new Date(date).toLocaleString()}>
      {formatTimeAgo(date)}
    </span>
  );
}
