"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock, ArrowRight, CheckCircle } from "lucide-react";

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caracteres");
      return;
    }

    const supabase = createClient();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setSuccess(true);
      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push("/protected");
      }, 2000);
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
            <h3 className="text-2xl font-bold text-[#0E1729]">Mot de passe mis a jour</h3>
            <p className="text-base text-[#45566C]">
              Votre mot de passe a ete modifie avec succes. Vous allez etre redirige vers votre espace.
            </p>
          </div>
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
          <h3 className="text-2xl font-bold text-[#0E1729]">Nouveau mot de passe</h3>
          <p className="text-base text-[#45566C]">
            Choisissez un nouveau mot de passe pour votre compte.
          </p>
        </div>
      </div>

      <form onSubmit={handleUpdatePassword} className="space-y-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-[#314158]">
              Nouveau mot de passe
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#90A1BA]" />
              <Input
                id="password"
                type="password"
                placeholder="Entrez votre nouveau mot de passe"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className="h-14 pl-12 border-2 border-[#E3E8F0] rounded-lg text-base placeholder:text-[#90A1BA] focus:border-[#E7000B] focus:ring-0"
              />
            </div>
            <p className="text-xs text-[#62748E]">
              Minimum 8 caracteres
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#314158]">
              Confirmer le mot de passe
            </Label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#90A1BA]" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirmez votre nouveau mot de passe"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                className="h-14 pl-12 border-2 border-[#E3E8F0] rounded-lg text-base placeholder:text-[#90A1BA] focus:border-[#E7000B] focus:ring-0"
              />
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 bg-gradient-to-r from-[#FB2C36] to-[#F54900] hover:opacity-90 text-white rounded-lg text-lg font-semibold transition-opacity relative"
          style={{
            boxShadow: "0px 4px 6px -4px rgba(0, 0, 0, 0.1), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)"
          }}
        >
          {isLoading ? "Mise a jour..." : "Mettre a jour le mot de passe"}
          <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4" />
        </Button>
      </form>

      <div className="pt-6 border-t border-[#E3E8F0]">
        <p className="text-sm text-center text-[#62748E]">
          Plateforme reservee aux patients et professionnels des Centres Experts
        </p>
      </div>
    </div>
  );
}
