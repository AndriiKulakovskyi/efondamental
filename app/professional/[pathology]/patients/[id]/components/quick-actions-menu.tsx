"use client";

import { useState } from "react";
import { MoreVertical, UserCog, Mail, Calendar, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ReassignPatientDialog } from "./reassign-patient-dialog";
import { EditPatientEmail } from "./edit-patient-email";
import { DeletePatientDialog } from "./delete-patient-dialog";
import Link from "next/link";

interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
}

interface QuickActionsMenuProps {
  patientId: string;
  patientFirstName: string;
  patientLastName: string;
  currentEmail: string | null;
  currentAssignedTo: string | null;
  createdBy: string;
  currentUserId: string;
  doctors: Doctor[];
  pathology: string;
}

export function QuickActionsMenu({
  patientId,
  patientFirstName,
  patientLastName,
  currentEmail,
  currentAssignedTo,
  createdBy,
  currentUserId,
  doctors,
  pathology,
}: QuickActionsMenuProps) {
  const [showReassignDialog, setShowReassignDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const patientName = `${patientFirstName} ${patientLastName}`;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <MoreVertical className="h-4 w-4" />
            Actions rapides
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {currentUserId === createdBy && (
            <>
              <DropdownMenuItem onClick={() => setShowReassignDialog(true)}>
                <UserCog className="mr-2 h-4 w-4" />
                Réassigner médecin
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          
          <DropdownMenuItem onClick={() => setShowEmailDialog(true)}>
            <Mail className="mr-2 h-4 w-4" />
            Modifier l'email
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link href={`/professional/${pathology}/patients/${patientId}/visits/new`}>
              <Calendar className="mr-2 h-4 w-4" />
              Planifier une visite
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer patient
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialogs */}
      {showReassignDialog && (
        <ReassignPatientDialog
          patientId={patientId}
          patientName={patientName}
          currentAssignedTo={currentAssignedTo}
          createdBy={createdBy}
          currentUserId={currentUserId}
          doctors={doctors}
          onSuccess={() => setShowReassignDialog(false)}
        />
      )}

      {showEmailDialog && (
        <EditPatientEmail
          patientId={patientId}
          currentEmail={currentEmail}
          patientFirstName={patientFirstName}
          patientLastName={patientLastName}
        />
      )}

      {showDeleteDialog && (
        <DeletePatientDialog
          patientId={patientId}
          patientFirstName={patientFirstName}
          patientLastName={patientLastName}
          pathology={pathology}
        />
      )}
    </>
  );
}
