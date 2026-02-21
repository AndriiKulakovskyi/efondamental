"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateTimePicker } from "@/components/ui/date-picker";
import { AlertBanner } from "@/components/ui/alert-banner";
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Loader2,
  MoreVertical,
  ArrowLeft
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface VisitActionsProps {
  visitId: string;
  patientId: string;
  pathology: string;
  status: string;
  completionStatus: {
    totalQuestionnaires: number;
    completedQuestionnaires: number;
    completionPercentage: number;
  };
}

export default function VisitActions({
  visitId,
  patientId,
  pathology,
  status,
  completionStatus,
}: VisitActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");

  const handleAction = async (action: string, additionalData?: any) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/professional/visits/${visitId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          ...additionalData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${action} visit`);
      }

      router.refresh();
      
      if (action === "complete" || action === "cancel") {
        router.push(`/professional/${pathology}/patients/${patientId}`);
      }
      
      setShowRescheduleDialog(false);
      setShowCancelDialog(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartVisit = () => {
    handleAction("start");
  };

  const handleCompleteVisit = () => {
    if (completionStatus.completedQuestionnaires < completionStatus.totalQuestionnaires) {
      setError(
        `Impossible de terminer la visite. ${completionStatus.totalQuestionnaires - completionStatus.completedQuestionnaires} questionnaires restants.`
      );
      return;
    }
    handleAction("complete");
  };

  const handleReschedule = () => {
    if (!rescheduleDate) {
      setError("Veuillez sélectionner une nouvelle date");
      return;
    }
    handleAction("reschedule", { scheduledDate: rescheduleDate });
  };

  const handleCancel = () => {
    handleAction("cancel");
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        {/* Back to Patient Profile Button - Always visible */}
        <Link href={`/professional/${pathology}/patients/${patientId}`}>
          <Button variant="outline" className="w-full gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retourner à fiche patient
          </Button>
        </Link>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {status === "scheduled" && (
            <>
              <Button 
                onClick={handleStartVisit} 
                disabled={isLoading}
                variant="brand"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Démarrage...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Démarrer la visite
                  </>
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowRescheduleDialog(true)}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Reprogrammer
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setShowCancelDialog(true)}
                    className="text-red-600"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Supprimer la visite
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {status === "in_progress" && (
            <>
              <Button onClick={handleCompleteVisit} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Finalisation...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Terminer la visite
                  </>
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => setShowCancelDialog(true)}
                    className="text-red-600"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Supprimer la visite
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {status === "completed" && (
            <div className="text-sm text-slate-600 flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
              Visite terminée
            </div>
          )}

          {status === "cancelled" && (
            <div className="text-sm text-slate-600 flex items-center">
              <XCircle className="mr-2 h-5 w-5 text-red-600" />
              Visite annulée
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="absolute top-20 right-4 max-w-md">
          <AlertBanner type="error" message={error} />
        </div>
      )}

      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reprogrammer la visite</DialogTitle>
            <DialogDescription>
              Sélectionnez une nouvelle date et heure pour cette visite.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reschedule-date">Nouvelle date et heure</Label>
              <DateTimePicker
                id="reschedule-date"
                value={rescheduleDate}
                onChange={setRescheduleDate}
              />
            </div>
            {error && <AlertBanner type="error" message={error} />}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRescheduleDialog(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button onClick={handleReschedule} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Reprogrammation...
                </>
              ) : (
                "Reprogrammer"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer définitivement la visite ?</DialogTitle>
            <DialogDescription>
              Cette action est irréversible. La visite et toutes les réponses aux questionnaires associés seront définitivement supprimés de la base de données.
            </DialogDescription>
          </DialogHeader>
          {error && <AlertBanner type="error" message={error} />}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              disabled={isLoading}
            >
              Conserver la visite
            </Button>
            <Button 
              variant="destructive"
              onClick={handleCancel} 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                "Supprimer définitivement"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

