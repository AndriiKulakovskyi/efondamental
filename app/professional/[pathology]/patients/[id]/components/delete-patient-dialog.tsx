"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertBanner } from "@/components/ui/alert-banner";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";

interface DeletePatientDialogProps {
  patientId: string;
  patientFirstName: string;
  patientLastName: string;
  pathology: string;
}

export function DeletePatientDialog({
  patientId,
  patientFirstName,
  patientLastName,
  pathology,
}: DeletePatientDialogProps) {
  const router = useRouter();
  const [showFirstConfirm, setShowFirstConfirm] = useState(false);
  const [showSecondConfirm, setShowSecondConfirm] = useState(false);
  const [lastNameInput, setLastNameInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFirstConfirm = () => {
    setShowFirstConfirm(false);
    setShowSecondConfirm(true);
    setLastNameInput("");
    setError(null);
  };

  const handleCancelFirst = () => {
    setShowFirstConfirm(false);
  };

  const handleCancelSecond = () => {
    setShowSecondConfirm(false);
    setLastNameInput("");
    setError(null);
  };

  const handleFinalDelete = async () => {
    // Validate last name
    if (lastNameInput.trim().toLowerCase() !== patientLastName.toLowerCase()) {
      setError("The last name you entered does not match. Please try again.");
      return;
    }

    setError(null);
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/professional/patients/${patientId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirmationLastName: lastNameInput.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete patient");
      }

      // Success - redirect to patients list
      router.push(`/professional/${pathology}/patients`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete patient");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setShowFirstConfirm(true)}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete Patient
      </Button>

      {/* First Confirmation Dialog */}
      <Dialog open={showFirstConfirm} onOpenChange={setShowFirstConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Delete Patient?
            </DialogTitle>
            <DialogDescription>
              You are about to delete the patient record for this patient.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="font-semibold text-slate-900">
                {patientFirstName} {patientLastName}
              </div>
              <div className="text-sm text-slate-600 mt-1">
                This action will deactivate the patient record and all associated data.
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="text-sm text-amber-800">
                <strong>Warning:</strong> This action cannot be easily undone. All patient data
                will be deactivated but preserved for audit purposes.
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelFirst}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleFirstConfirm}>
              Continue to Final Confirmation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Second Confirmation Dialog with Last Name Verification */}
      <Dialog open={showSecondConfirm} onOpenChange={setShowSecondConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Final Confirmation Required
            </DialogTitle>
            <DialogDescription>
              To prevent accidental deletion, please type the patient's last name exactly as shown below to confirm.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-sm text-red-800 font-semibold mb-2">
                Patient to be deleted:
              </div>
              <div className="text-lg font-bold text-red-900">
                {patientFirstName} {patientLastName}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-slate-700">
                Type the patient's last name to confirm:{" "}
                <span className="font-semibold text-slate-900">{patientLastName}</span>
              </Label>
              <Input
                id="lastName"
                type="text"
                value={lastNameInput}
                onChange={(e) => {
                  setLastNameInput(e.target.value);
                  setError(null);
                }}
                placeholder={`Type "${patientLastName}" here`}
                className="font-medium"
                disabled={isDeleting}
                autoComplete="off"
              />
            </div>

            {error && <AlertBanner type="error" message={error} />}

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="text-xs text-slate-600">
                <strong>Note:</strong> This will deactivate the patient record. All clinical
                data (visits, evaluations, questionnaires) will be preserved for audit
                compliance but the patient will no longer appear in active patient lists.
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelSecond}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleFinalDelete}
              disabled={
                isDeleting ||
                lastNameInput.trim().toLowerCase() !== patientLastName.toLowerCase()
              }
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Permanently Delete Patient
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

