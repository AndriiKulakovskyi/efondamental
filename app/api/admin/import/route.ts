import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/rbac/middleware";
import { importPatientData, validateImportData, ImportPatient } from "@/lib/services/import.service";
import { logAuditEvent } from "@/lib/services/audit.service";

export async function POST(request: NextRequest) {
  try {
    const profile = await requireAdmin();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const centerId = formData.get("centerId") as string;
    const pathologyId = formData.get("pathologyId") as string;

    // Validate required fields
    if (!file || !centerId || !pathologyId) {
      return NextResponse.json(
        { error: "Missing file, center ID, or pathology ID" },
        { status: 400 }
      );
    }

    if (file.type !== "application/json") {
      return NextResponse.json(
        { error: "Invalid file type. Only JSON files are allowed." },
        { status: 400 }
      );
    }

    // Parse the JSON file
    const fileContent = await file.text();
    let patients: ImportPatient[];
    try {
      patients = JSON.parse(fileContent);
      if (!Array.isArray(patients)) {
        throw new Error("JSON file must contain an array of patient objects.");
      }
    } catch (parseError: any) {
      return NextResponse.json(
        { error: `Invalid JSON file: ${parseError.message}` },
        { status: 400 }
      );
    }

    if (patients.length === 0) {
      return NextResponse.json(
        { error: "File contains no patient data" },
        { status: 400 }
      );
    }

    // Validate the data structure
    const validation = validateImportData(patients);
    if (!validation.valid) {
      return NextResponse.json(
        { 
          error: "Data validation failed", 
          validationErrors: validation.errors 
        },
        { status: 400 }
      );
    }

    // Import the data
    const result = await importPatientData(
      patients,
      centerId,
      pathologyId,
      profile.id
    );

    // Log audit event
    await logAuditEvent({
      userId: profile.id,
      action: "import_patient_data",
      entityType: "patients",
      centerId: centerId,
      metadata: {
        pathologyId: pathologyId,
        fileName: file.name,
        fileSize: file.size,
        patientsAttempted: patients.length,
        importedPatients: result.importedPatients,
        importedVisits: result.importedVisits,
        importedResponses: result.importedResponses,
        errorsCount: result.errors.length,
        warningsCount: result.warnings.length,
      },
    });

    return NextResponse.json({
      success: true,
      importedPatients: result.importedPatients,
      importedVisits: result.importedVisits,
      importedResponses: result.importedResponses,
      errors: result.errors,
      warnings: result.warnings,
    });
  } catch (error) {
    console.error("Failed to import patient data:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to import data" },
      { status: 500 }
    );
  }
}
