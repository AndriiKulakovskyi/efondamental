import { NextRequest, NextResponse } from "next/server";
import { requireProfessional, getUserContext } from "@/lib/rbac/middleware";
import { getPatientById, deletePatient, updatePatient, checkDuplicatePatient } from "@/lib/services/patient.service";
import { invitePatient } from "@/lib/services/user-provisioning.service";
import { logAuditEvent } from "@/lib/services/audit.service";
import { AuditAction } from "@/lib/types/enums";

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
function validateGender(gender: string | null | undefined): boolean {
  if (gender === undefined) return true; // Not updating gender
  if (gender === null) return false; // Explicitly setting to null is not allowed
  return gender === 'M' || gender === 'F';
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireProfessional();
    const context = await getUserContext();

    if (!context?.profile.center_id) {
      return NextResponse.json(
        { error: "No center assigned" },
        { status: 400 }
      );
    }

    const { id } = await params;
    const patient = await getPatientById(id);

    if (!patient) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 404 }
      );
    }

    // Verify patient belongs to the professional's center
    if (patient.center_id !== context.profile.center_id) {
      return NextResponse.json(
        { error: "Unauthorized: Patient does not belong to your center" },
        { status: 403 }
      );
    }

    return NextResponse.json({ patient });
  } catch (error) {
    console.error("Failed to fetch patient:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch patient" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireProfessional();
    const context = await getUserContext();

    if (!context?.profile.center_id) {
      return NextResponse.json(
        { error: "No center assigned" },
        { status: 400 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { 
      first_name,
      last_name,
      marital_name,
      date_of_birth,
      years_of_education,
      gender,
      maiden_name,
      birth_city,
      birth_department,
      birth_country,
      hospital_id,
      social_security_number,
      email, 
      phone,
      street_number_and_name,
      building_details,
      postal_code,
      city,
      phone_private,
      phone_professional,
      phone_mobile,
      address,
      patient_sector,
      referred_by,
      visit_purpose,
      gp_report_consent,
      psychiatrist_report_consent,
      center_awareness_source,
      emergency_contact,
      sendInvitation 
    } = body;

    // Get patient to verify center access
    const patient = await getPatientById(id);

    if (!patient) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 404 }
      );
    }

    // Verify patient belongs to the professional's center
    if (patient.center_id !== context.profile.center_id) {
      return NextResponse.json(
        { error: "Unauthorized: Patient does not belong to your center" },
        { status: 403 }
      );
    }

    // Validate date of birth if provided
    if (date_of_birth !== undefined && !validateAge(date_of_birth)) {
      return NextResponse.json(
        { error: "Patient must be at least 15 years old" },
        { status: 400 }
      );
    }

    // Validate gender if provided
    if (!validateGender(gender)) {
      return NextResponse.json(
        { error: "Sex at birth must be Male (M) or Female (F)" },
        { status: 400 }
      );
    }

    // Check for duplicate patient if identifying fields are changing
    const newFirstName = first_name ?? patient.first_name;
    const newLastName = last_name ?? patient.last_name;
    const newDateOfBirth = date_of_birth ?? patient.date_of_birth;
    // Use birth_city as the primary geographic identifier for duplicate detection
    const newPlaceOfBirth = birth_city !== undefined ? birth_city : (patient as any).birth_city || (patient as any).place_of_birth;

    // Only check for duplicates if any of the identifying fields changed
    if (first_name !== undefined || last_name !== undefined || date_of_birth !== undefined || birth_city !== undefined) {
      const duplicateCheck = await checkDuplicatePatient(
        context.profile.center_id,
        newFirstName,
        newLastName,
        newDateOfBirth,
        newPlaceOfBirth,
        id // Exclude current patient from check
      );

      if (duplicateCheck.isDuplicate) {
        return NextResponse.json(
          { error: `A patient with the same name, date of birth, and place of birth already exists (MRN: ${duplicateCheck.existingMrn})` },
          { status: 409 }
        );
      }
    }

    // Build update object with only provided fields
    const updates: Record<string, any> = {};
    const changes: Record<string, any> = {};

    if (first_name !== undefined) {
      updates.first_name = first_name;
      if (patient.first_name !== first_name) {
        changes.first_name = { old: patient.first_name, new: first_name };
      }
    }
    if (last_name !== undefined) {
      updates.last_name = last_name;
      if (patient.last_name !== last_name) {
        changes.last_name = { old: patient.last_name, new: last_name };
      }
    }
    if (date_of_birth !== undefined) {
      updates.date_of_birth = date_of_birth;
      if (patient.date_of_birth !== date_of_birth) {
        changes.date_of_birth = { old: patient.date_of_birth, new: date_of_birth };
      }
    }
    if (years_of_education !== undefined) {
      updates.years_of_education = years_of_education;
      if ((patient as any).years_of_education !== years_of_education) {
        changes.years_of_education = { old: (patient as any).years_of_education, new: years_of_education };
      }
    }
    if (maiden_name !== undefined) {
      updates.maiden_name = maiden_name;
      if ((patient as any).maiden_name !== maiden_name) {
        changes.maiden_name = { old: (patient as any).maiden_name, new: maiden_name };
      }
    }
    if (marital_name !== undefined) {
      updates.marital_name = marital_name;
      if ((patient as any).marital_name !== marital_name) {
        changes.marital_name = { old: (patient as any).marital_name, new: marital_name };
      }
    }
    if (gender !== undefined) {
      updates.gender = gender;
      if (patient.gender !== gender) {
        changes.gender = { old: patient.gender, new: gender };
      }
    }
    if (birth_city !== undefined) {
      updates.birth_city = birth_city;
      if ((patient as any).birth_city !== birth_city) {
        changes.birth_city = { old: (patient as any).birth_city, new: birth_city };
      }
    }
    if (birth_department !== undefined) {
      updates.birth_department = birth_department;
      if ((patient as any).birth_department !== birth_department) {
        changes.birth_department = { old: (patient as any).birth_department, new: birth_department };
      }
    }
    if (birth_country !== undefined) {
      updates.birth_country = birth_country;
      if ((patient as any).birth_country !== birth_country) {
        changes.birth_country = { old: (patient as any).birth_country, new: birth_country };
      }
    }
    if (hospital_id !== undefined) {
      updates.hospital_id = hospital_id;
      if ((patient as any).hospital_id !== hospital_id) {
        changes.hospital_id = { old: (patient as any).hospital_id, new: hospital_id };
      }
    }
    if (social_security_number !== undefined) {
      updates.social_security_number = social_security_number;
      if ((patient as any).social_security_number !== social_security_number) {
        changes.social_security_number = { old: (patient as any).social_security_number, new: social_security_number };
      }
    }
    if (email !== undefined) {
      updates.email = email;
      if (patient.email !== email) {
        changes.email = { old: patient.email, new: email };
      }
    }
    if (phone !== undefined) {
      updates.phone = phone;
      if (patient.phone !== phone) {
        changes.phone = { old: patient.phone, new: phone };
      }
    }
    if (phone_private !== undefined) {
      updates.phone_private = phone_private;
      if ((patient as any).phone_private !== phone_private) {
        changes.phone_private = { old: (patient as any).phone_private, new: phone_private };
      }
    }
    if (phone_professional !== undefined) {
      updates.phone_professional = phone_professional;
      if ((patient as any).phone_professional !== phone_professional) {
        changes.phone_professional = { old: (patient as any).phone_professional, new: phone_professional };
      }
    }
    if (phone_mobile !== undefined) {
      updates.phone_mobile = phone_mobile;
      if ((patient as any).phone_mobile !== phone_mobile) {
        changes.phone_mobile = { old: (patient as any).phone_mobile, new: phone_mobile };
      }
    }
    if (address !== undefined) {
      updates.address = address;
      if (patient.address !== address) {
        changes.address = { old: patient.address, new: address };
      }
    }
    if (street_number_and_name !== undefined) {
      updates.street_number_and_name = street_number_and_name;
      if ((patient as any).street_number_and_name !== street_number_and_name) {
        changes.street_number_and_name = { old: (patient as any).street_number_and_name, new: street_number_and_name };
      }
    }
    if (building_details !== undefined) {
      updates.building_details = building_details;
      if ((patient as any).building_details !== building_details) {
        changes.building_details = { old: (patient as any).building_details, new: building_details };
      }
    }
    if (postal_code !== undefined) {
      updates.postal_code = postal_code;
      if ((patient as any).postal_code !== postal_code) {
        changes.postal_code = { old: (patient as any).postal_code, new: postal_code };
      }
    }
    if (city !== undefined) {
      updates.city = city;
      if ((patient as any).city !== city) {
        changes.city = { old: (patient as any).city, new: city };
      }
    }
    if (patient_sector !== undefined) {
      updates.patient_sector = patient_sector;
      if ((patient as any).patient_sector !== patient_sector) {
        changes.patient_sector = { old: (patient as any).patient_sector, new: patient_sector };
      }
    }
    if (referred_by !== undefined) {
      updates.referred_by = referred_by;
      if ((patient as any).referred_by !== referred_by) {
        changes.referred_by = { old: (patient as any).referred_by, new: referred_by };
      }
    }
    if (visit_purpose !== undefined) {
      updates.visit_purpose = visit_purpose;
      if ((patient as any).visit_purpose !== visit_purpose) {
        changes.visit_purpose = { old: (patient as any).visit_purpose, new: visit_purpose };
      }
    }
    if (gp_report_consent !== undefined) {
      updates.gp_report_consent = gp_report_consent;
      if ((patient as any).gp_report_consent !== gp_report_consent) {
        changes.gp_report_consent = { old: (patient as any).gp_report_consent, new: gp_report_consent };
      }
    }
    if (psychiatrist_report_consent !== undefined) {
      updates.psychiatrist_report_consent = psychiatrist_report_consent;
      if ((patient as any).psychiatrist_report_consent !== psychiatrist_report_consent) {
        changes.psychiatrist_report_consent = { old: (patient as any).psychiatrist_report_consent, new: psychiatrist_report_consent };
      }
    }
    if (center_awareness_source !== undefined) {
      updates.center_awareness_source = center_awareness_source;
      if ((patient as any).center_awareness_source !== center_awareness_source) {
        changes.center_awareness_source = { old: (patient as any).center_awareness_source, new: center_awareness_source };
      }
    }
    if (emergency_contact !== undefined) {
      updates.emergency_contact = emergency_contact;
      changes.emergency_contact = { old: patient.emergency_contact, new: emergency_contact };
    }

    // Update patient with all provided fields
    const updatedPatient = await updatePatient(id, updates);

    // Log audit event only if there are changes
    if (Object.keys(changes).length > 0) {
      await logAuditEvent({
        userId: context.user.id,
        action: AuditAction.UPDATE,
        entityType: "patient",
        entityId: id,
        centerId: context.profile.center_id,
        changes
      });
    }

    // Send invitation if requested and email was updated
    let invitationResult = null;
    if (sendInvitation && email) {
      try {
        invitationResult = await invitePatient({
          patientId: id,
          email,
          firstName: updatedPatient.first_name,
          lastName: updatedPatient.last_name,
          centerId: context.profile.center_id,
          invitedBy: context.user.id,
        });

        if (!invitationResult.success) {
          console.warn('Failed to send patient invitation:', invitationResult.error);
        }
      } catch (inviteError) {
        console.error('Error sending patient invitation:', inviteError);
      }
    }

    return NextResponse.json({
      patient: updatedPatient,
      invitation: invitationResult?.success ? {
        sent: true,
        invitationId: invitationResult.invitationId,
      } : null,
    }, { status: 200 });
  } catch (error) {
    console.error("Failed to update patient:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update patient" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireProfessional();
    const context = await getUserContext();

    if (!context?.profile.center_id) {
      return NextResponse.json(
        { error: "No center assigned" },
        { status: 400 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { confirmationLastName } = body;

    // Get patient to verify last name and center access
    const patient = await getPatientById(id);

    if (!patient) {
      return NextResponse.json(
        { error: "Patient not found" },
        { status: 404 }
      );
    }

    // Verify patient belongs to the professional's center
    if (patient.center_id !== context.profile.center_id) {
      return NextResponse.json(
        { error: "Unauthorized: Patient does not belong to your center" },
        { status: 403 }
      );
    }

    // Verify last name matches (case-insensitive)
    if (patient.last_name.toLowerCase() !== confirmationLastName.toLowerCase()) {
      return NextResponse.json(
        { error: "Last name does not match. Deletion cancelled." },
        { status: 400 }
      );
    }

    // Log audit event before deletion
    await logAuditEvent({
      userId: context.user.id,
      action: AuditAction.DELETE,
      entityType: "patient",
      entityId: id,
      centerId: context.profile.center_id,
      changes: { 
        patientName: `${patient.first_name} ${patient.last_name}`,
        medicalRecordNumber: patient.medical_record_number
      }
    });

    // Delete the patient (soft delete with cleanup)
    await deletePatient(id, context.user.id);

    return NextResponse.json(
      { 
        success: true,
        message: "Patient deleted successfully" 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete patient:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete patient" },
      { status: 500 }
    );
  }
}

