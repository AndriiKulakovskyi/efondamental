"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertBanner } from "@/components/ui/alert-banner";
import { Edit, Loader2, Mail } from "lucide-react";

interface EditPatientEmailProps {
  patientId: string;
  currentEmail: string | null;
  patientFirstName: string;
  patientLastName: string;
}

export function EditPatientEmail({
  patientId,
  currentEmail,
  patientFirstName,
  patientLastName,
}: EditPatientEmailProps) {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [email, setEmail] = useState(currentEmail || "");
  const [sendInvitation, setSendInvitation] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Veuillez entrer une adresse email valide");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`/api/professional/patients/${patientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          sendInvitation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Échec de la mise à jour de l'email");
      }

      setShowDialog(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur s'est produite");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start"
        onClick={() => setShowDialog(true)}
      >
        <Edit className="h-4 w-4 mr-2" />
        {currentEmail ? "Modifier email" : "Ajouter email"}
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentEmail ? "Modifier l'adresse email" : "Ajouter une adresse email"}
            </DialogTitle>
            <DialogDescription>
              {currentEmail
                ? "Modifier l'adresse email du patient et envoyer éventuellement une invitation au portail."
                : "Ajouter une adresse email pour permettre l'accès au portail patient."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="text-sm font-medium text-slate-900">
                  {patientFirstName} {patientLastName}
                </div>
                {currentEmail && (
                  <div className="text-xs text-slate-600 mt-1">
                    Email actuel: {currentEmail}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patient@exemple.com"
                  required
                />
              </div>

              <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                <Checkbox
                  id="sendInvitation"
                  checked={sendInvitation}
                  onCheckedChange={(checked) => setSendInvitation(checked === true)}
                />
                <div className="flex-1">
                  <label
                    htmlFor="sendInvitation"
                    className="text-sm font-medium cursor-pointer"
                  >
                    <Mail className="h-4 w-4 inline mr-1" />
                    Envoyer l'invitation au portail à cet email
                  </label>
                  <p className="text-xs text-slate-600 mt-1">
                    Le patient recevra un email pour créer son compte et accéder au portail
                  </p>
                </div>
              </div>

              {error && <AlertBanner type="error" message={error} />}
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {currentEmail ? "Mise à jour..." : "Ajout..."}
                  </>
                ) : (
                  currentEmail ? "Mettre à jour" : "Ajouter"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

