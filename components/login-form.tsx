"use client";

import { cn } from "@/lib/utils";
import { loginWithPassword } from "@/lib/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { User, Lock, ArrowRight } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const isEmail = identifier.includes("@");
      
      const result = await loginWithPassword({
        email: isEmail ? identifier : undefined,
        username: !isEmail ? identifier : undefined,
        password,
      });

      if (!result.success) {
        setError(result.error || "Login failed");
        return;
      }

      window.location.href = "/protected";
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={cn("w-full max-w-[483px] bg-white rounded-3xl border-2 border-[#E3E8F0] p-12 space-y-8", className)} 
      style={{
        boxShadow: "0px 8px 10px -6px rgba(0, 0, 0, 0.1), 0px 20px 25px -5px rgba(0, 0, 0, 0.1)"
      }}
      {...props}
    >
      <div className="space-y-6">
        <h3 className="text-3xl font-bold text-[#0E1729]">Connexion</h3>
        <p className="text-base text-[#45566C]">
          Un code de vérification sera envoyé par email
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-8">
        <div className="space-y-2">
          <Label htmlFor="identifier" className="text-sm font-medium text-[#314158]">
            Nom d'utilisateur
          </Label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#90A1BA]" />
            <Input
              id="identifier"
              type="text"
              placeholder="Entrez votre nom d'utilisateur"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              className="h-14 pl-12 border-2 border-[#E3E8F0] rounded-lg text-base placeholder:text-[#90A1BA] focus:border-[#E7000B] focus:ring-0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-[#314158]">
            Mot de passe
          </Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#90A1BA]" />
            <Input
              id="password"
              type="password"
              placeholder="Entrez votre mot de passe"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
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
            {isLoading ? "Connexion..." : "Se connecter"}
            <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 h-4 w-4" />
          </Button>

          <div className="text-center">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-[#45566C] hover:text-[#314158] transition-colors"
            >
              Mot de passe oublié ?
            </Link>
          </div>
        </div>
      </form>

      <div className="pt-6 border-t border-[#E3E8F0]">
        <p className="text-sm text-center text-[#62748E]">
          Plateforme réservée aux patients et professionnels des Centres Experts
        </p>
      </div>
    </div>
  );
}
