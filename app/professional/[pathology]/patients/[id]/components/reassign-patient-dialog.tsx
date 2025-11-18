"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertBanner } from "@/components/ui/alert-banner";
import { Loader2, UserCog } from "lucide-react";

interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
}

interface ReassignPatientDialogProps {
  patientId: string;
  patientName: string;
  currentAssignedTo: string | null;
  createdBy: string;
  currentUserId: string;
  doctors: Doctor[];
  onSuccess?: () => void;
}

export function ReassignPatientDialog({
  patientId,
  patientName,
  currentAssignedTo,
  createdBy,
  currentUserId,
  doctors,
  onSuccess,
}: ReassignPatientDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string>(currentAssignedTo || "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Only show if current user is the creator
  if (currentUserId !== createdBy) {
    return null;
  }

  const handleReassign = async () => {
    if (!selectedDoctor) {
      setError("Veuillez sélectionner un médecin");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/professional/patients/${patientId}/reassign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedTo: selectedDoctor }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Échec de la réassignation du patient");
      }

      setOpen(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur s'est produite");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-start">
          <UserCog className="w-4 h-4 mr-2" />
          Réassigner médecin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Réassigner patient</DialogTitle>
          <DialogDescription>
            Changer le médecin assigné pour {patientName}. Seul le créateur du dossier patient peut réassigner.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="doctor">Médecin assigné</Label>
            <Select
              value={selectedDoctor}
              onValueChange={setSelectedDoctor}
              disabled={isSubmitting}
            >
              <SelectTrigger id="doctor">
                <SelectValue placeholder="Sélectionner un médecin" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    Dr. {doctor.first_name} {doctor.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && <AlertBanner type="error" message={error} />}
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button onClick={handleReassign} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Réassignation...
              </>
            ) : (
              "Réassigner"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

