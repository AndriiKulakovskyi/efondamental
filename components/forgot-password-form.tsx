"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { Mail, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div
        className={cn("w-full max-w-[483px] bg-white rounded-3xl border-2 border-[#E3E8F0] p-12 space-y-8", className)}
        style={{
          boxShadow: "0px 8px 10px -6px rgba(0, 0, 0, 0.1), 0px 20px 25px -5px rgba(0, 0, 0, 0.1)"
        }}
        {...props}
      >
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-[#0E1729]">Email envoye</h3>
            <p className="text-base text-[#45566C]">
              Si un compte existe avec l'adresse <strong className="text-[#314158]">{email}</strong>, vous recevrez un email avec les instructions pour reinitialiser votre mot de passe.
            </p>
          </div>

          <Link
            href="/auth/login"
            className="inline-flex items-center gap-2 text-sm text-[#45566C] hover:text-[#314158] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour a la connexion
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("w-full max-w-[483px] bg-white rounded-3xl border-2 border-[#E3E8F0] p-12 space-y-8", className)}
      style={{
        boxShadow: "0px 8px 10px -6px rgba(0, 0, 0, 0.1), 0px 20px 25px -5px rgba(0, 0, 0, 0.1)"
      }}
      {...props}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold text-[#0E1729]">Fondation</h1>
          <h1 className="text-3xl font-bold text-[#E7000B]">FondaMental</h1>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-[#0E1729]">Mot de passe oublie ?</h3>
          <p className="text-base text-[#45566C]">
            Entrez votre adresse email et nous vous enverrons un lien pour reinitialiser votre mot de passe.
          </p>
        </div>
      </div>

      <form onSubmit={handleForgotPassword} className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-[#314158]">
            Adresse email
          </Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#90A1BA]" />
            <Input
              id="email"
              type="email"
              placeholder="Entrez votre adresse email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="h-14 pl-12 border-2 border-[#E3E8F0] rounded-lg text-base placeholder:text-[#90A1BA] focus:border-[#E7000B] focus:ring-0"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="space-y-6">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-gradient-to-r from-[#FB2C36] to-[#F54900] hover:opacity-90 text-white rounded-lg text-lg font-semibold transition-opacity relative"
            style={{
              boxShadow: "0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)"
            }}
          >
            {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
            <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4" />
          </Button>

          <div className="text-center">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-sm text-[#45566C] hover:text-[#314158] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour a la connexion
            </Link>
          </div>
        </div>
      </form>

      <div className="pt-6 border-t border-[#E3E8F0]">
        <p className="text-sm text-center text-[#62748E]">
          Plateforme reservee aux patients et professionnels des Centres Experts
        </p>
      </div>
    </div>
  );
}
