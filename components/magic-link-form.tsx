"use client";

import { cn } from "@/lib/utils";
import { loginWithMagicLink } from "@/lib/services/auth.service";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { Mail } from "lucide-react";

export function MagicLinkForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await loginWithMagicLink(email);

      if (!result.success) {
        setError(result.error || "Failed to send magic link");
        return;
      }

      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Magic Link Login</CardTitle>
          <CardDescription>
            Enter your email address and we will send you a magic link to sign in
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="rounded-full bg-green-100 p-3">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg mb-2">Check your email</h3>
                <p className="text-sm text-slate-600 mb-4">
                  We&apos;ve sent a magic link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-slate-500">
                  Click the link in the email to sign in to your account.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                }}
                className="mt-4"
              >
                Send another link
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Magic Link"}
                </Button>
                <div className="text-center text-sm">
                  <Link
                    href="/auth/login"
                    className="underline underline-offset-4 text-slate-600 hover:text-slate-900"
                  >
                    Back to login
                  </Link>
                </div>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

