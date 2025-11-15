"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg border border-red-200 p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 p-3">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-slate-600 mb-6">
            We encountered an error while processing your request. Please try again.
          </p>
          {error.message && (
            <p className="text-sm text-slate-500 mb-6 font-mono bg-slate-50 p-3 rounded">
              {error.message}
            </p>
          )}
          <div className="flex gap-3 justify-center">
            <Button onClick={() => reset()}>Try Again</Button>
            <Button variant="outline" onClick={() => (window.location.href = "/")}>
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

