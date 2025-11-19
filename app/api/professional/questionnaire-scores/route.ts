// eFondaMental Platform - Professional Questionnaire Scores API
// GET endpoint for retrieving questionnaire scores for a visit

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getResponsesWithInterpretation } from '@/lib/services/questionnaire.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const visitId = searchParams.get('visitId');

    if (!visitId) {
      return NextResponse.json(
        { error: 'visitId est requis' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Get user profile
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

    // Verify user is a professional
    if (profile.role !== 'healthcare_professional') {
      return NextResponse.json(
        { error: 'Accès réservé aux professionnels de santé' },
        { status: 403 }
      );
    }

    // Get responses with interpretation
    const responses = await getResponsesWithInterpretation(visitId);

    return NextResponse.json({ responses });
  } catch (error) {
    console.error('Error fetching questionnaire scores:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des scores' },
      { status: 500 }
    );
  }
}

