"use client";

import { useState } from "react";
import { PatientFull } from "@/lib/types/database.types";
import { PatientSearch } from "./patient-search";
import { EnhancedPatientsTable } from "./enhanced-patients-table";

interface PatientsTableWithSearchProps {
  patients: PatientFull[];
  pathology: string;
}

export function PatientsTableWithSearch({ patients, pathology }: PatientsTableWithSearchProps) {
  const [filteredPatients, setFilteredPatients] = useState<PatientFull[]>(patients);

  return (
    <div className="space-y-4">
      <PatientSearch 
        pathology={pathology} 
        initialPatients={patients}
        onFilterChange={setFilteredPatients}
      />
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <EnhancedPatientsTable patients={filteredPatients} pathology={pathology} />
      </div>
    </div>
  );
}

