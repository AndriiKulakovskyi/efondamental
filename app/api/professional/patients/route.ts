import { NextRequest, NextResponse } from "next/server";
import { requireProfessional, getUserContext } from "@/lib/rbac/middleware";
import { createPatient, checkDuplicatePatient } from "@/lib/services/patient.service";
import { getPathologyByType } from "@/lib/services/center.service";
import { invitePatient } from "@/lib/services/user-provisioning.service";
import { PathologyType } from "@/lib/types/enums";
import { logPatientCreation } from "@/lib/services/audit.service";

// Validate age is at least 15 years
function validateAge(dateOfBirth: string): boolean {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 15;
}

// Validate gender value
function validateGender(gender: string | null): boolean {
  if (!gender) return false;
  return gender === 'M' || gender === 'F';
}

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
      yearsOfEducation,
      medicalRecordNumber,
      maidenName,
      gender,
      placeOfBirth,
      email,
      phone,
      address,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelationship,
      pathology,
      assignedTo,
    } = body;

    // Validate date of birth (must be at least 15 years old)
    if (!dateOfBirth || !validateAge(dateOfBirth)) {
      return NextResponse.json(
        { error: "Patient must be at least 15 years old" },
        { status: 400 }
      );
    }

    // Validate gender (must be M or F)
    if (!validateGender(gender)) {
      return NextResponse.json(
        { error: "Sex at birth is required and must be Male (M) or Female (F)" },
        { status: 400 }
      );
    }

    // Get pathology ID
    const pathologyData = await getPathologyByType(pathology as PathologyType);
    if (!pathologyData) {
      return NextResponse.json(
        { error: "Invalid pathology" },
        { status: 400 }
      );
    }

    // Check for duplicate patient (same name, DOB, and place of birth)
    const duplicateCheck = await checkDuplicatePatient(
      context.profile.center_id,
      firstName,
      lastName,
      dateOfBirth,
      placeOfBirth || null
    );

    if (duplicateCheck.isDuplicate) {
      return NextResponse.json(
        { error: `A patient with the same name, date of birth, and place of birth already exists (MRN: ${duplicateCheck.existingMrn})` },
        { status: 409 }
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
      maiden_name: maidenName || null,
      date_of_birth: dateOfBirth,
      years_of_education: yearsOfEducation ? parseInt(yearsOfEducation) : null,
      gender: gender,
      place_of_birth: placeOfBirth || null,
      email: email || null,
      phone: phone || null,
      address: address || null,
      emergency_contact: emergencyContact,
      active: true,
      assigned_to: assignedTo || context.user.id,
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

    // Send patient invitation if email is provided
    let invitationResult = null;
    if (email) {
      try {
        invitationResult = await invitePatient({
          patientId: patient.id,
          email,
          firstName,
          lastName,
          centerId: context.profile.center_id,
          invitedBy: context.user.id,
        });

        if (!invitationResult.success) {
          console.warn('Failed to send patient invitation:', invitationResult.error);
          // Don't fail patient creation, just log the warning
        }
      } catch (inviteError) {
        console.error('Error sending patient invitation:', inviteError);
        // Patient creation succeeds even if invitation fails
      }
    }

    return NextResponse.json({ 
      patient,
      invitation: invitationResult?.success ? {
        sent: true,
        invitationId: invitationResult.invitationId,
      } : {
        sent: false,
        reason: !email ? 'No email provided' : invitationResult?.error || 'Failed to send',
      }
    }, { status: 201 });
  } catch (error) {
    console.error("Failed to create patient:", error);
    
    // Handle specific database errors
    const errorMessage = error instanceof Error ? error.message : "Failed to create patient";
    
    if (errorMessage.includes("duplicate key") && errorMessage.includes("medical_record_number")) {
      return NextResponse.json(
        { error: "A patient with this Medical Record Number already exists" },
        { status: 409 }
      );
    }

    if (errorMessage.includes("duplicate key") && errorMessage.includes("idx_patients_unique_identity")) {
      return NextResponse.json(
        { error: "A patient with the same name, date of birth, and place of birth already exists in this center" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

