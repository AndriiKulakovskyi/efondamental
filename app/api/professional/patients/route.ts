import { NextRequest, NextResponse } from "next/server";
import { requireProfessional, getUserContext } from "@/lib/rbac/middleware";
import { createPatient } from "@/lib/services/patient.service";
import { getPathologyByType } from "@/lib/services/center.service";
import { PathologyType } from "@/lib/types/enums";
import { logPatientCreation } from "@/lib/services/audit.service";

export async function POST(request: NextRequest) {
  try {
    await requireProfessional();
    const context = await getUserContext();

    if (!context?.profile.center_id) {
      return NextResponse.json(
        { error: "No center assigned" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      firstName,
      lastName,
      dateOfBirth,
      medicalRecordNumber,
      gender,
      email,
      phone,
      address,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelationship,
      pathology,
    } = body;

    // Get pathology ID
    const pathologyData = await getPathologyByType(pathology as PathologyType);
    if (!pathologyData) {
      return NextResponse.json(
        { error: "Invalid pathology" },
        { status: 400 }
      );
    }

    // Create emergency contact object if provided
    const emergencyContact =
      emergencyContactName && emergencyContactPhone
        ? {
            name: emergencyContactName,
            phone: emergencyContactPhone,
            relationship: emergencyContactRelationship || "",
          }
        : null;

    // Create patient
    const patient = await createPatient({
      center_id: context.profile.center_id,
      pathology_id: pathologyData.id,
      medical_record_number: medicalRecordNumber,
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dateOfBirth,
      gender: gender || null,
      email: email || null,
      phone: phone || null,
      address: address || null,
      emergency_contact: emergencyContact,
      active: true,
      created_by: context.user.id,
      metadata: {},
    });

    // Log audit event
    await logPatientCreation(
      context.user.id,
      patient.id,
      context.profile.center_id,
      { firstName, lastName, medicalRecordNumber }
    );

    return NextResponse.json({ patient }, { status: 201 });
  } catch (error) {
    console.error("Failed to create patient:", error);
    return NextResponse.json(
      { error: "Failed to create patient" },
      { status: 500 }
    );
  }
}

