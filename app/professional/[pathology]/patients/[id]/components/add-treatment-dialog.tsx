"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MedicationForm } from "../treatment/components/medication-form";

interface AddTreatmentDialogProps {
  patientId: string;
  patientName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTreatmentDialog({ 
  patientId, 
  patientName,
  open,
  onOpenChange
}: AddTreatmentDialogProps) {
  // When medication is added successfully, close the dialog
  const handleSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un traitement</DialogTitle>
          <DialogDescription>
            Ajouter un nouveau traitement psychotrope pour {patientName}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2">
          <MedicationForm 
            patientId={patientId} 
            onMedicationAdded={handleSuccess} 
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
