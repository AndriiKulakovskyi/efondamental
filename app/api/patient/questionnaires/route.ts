// eFondaMental Platform - Patient Questionnaires API
// GET endpoint for retrieving pending auto-questionnaires for patient

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getPendingAutoQuestionnairesForPatient } from '@/lib/services/questionnaire.service';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Get user profile to get patient_id
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id, role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'Profil non trouvé' },
        { status: 404 }
      );
    }

    // Verify user is a patient
    if (profile.role !== 'patient') {
      return NextResponse.json(
        { error: 'Accès réservé aux patients' },
        { status: 403 }
      );
    }

    // Get patient record
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (patientError || !patient) {
      return NextResponse.json(
        { error: 'Dossier patient non trouvé' },
        { status: 404 }
      );
    }

    // Get pending questionnaires
    const questionnaires = await getPendingAutoQuestionnairesForPatient(patient.id);

    return NextResponse.json({ questionnaires });
  } catch (error) {
    console.error('Error fetching patient questionnaires:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des questionnaires' },
      { status: 500 }
    );
  }
}

