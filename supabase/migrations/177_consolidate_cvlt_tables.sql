-- ============================================================================
-- eFondaMental Platform - Consolidate CVLT Tables
-- ============================================================================
-- This migration consolidates responses_wais3_cvlt into responses_cvlt
-- Both WAIS-III and WAIS-IV CVLT use identical questions and scoring logic
-- ============================================================================

-- Step 1: Add questionnaire_version column to track which variant was used
ALTER TABLE responses_cvlt
ADD COLUMN IF NOT EXISTS questionnaire_version TEXT CHECK (questionnaire_version IN ('WAIS-III', 'WAIS-IV'));

COMMENT ON COLUMN responses_cvlt.questionnaire_version IS 'Tracks whether this response came from WAIS-III or WAIS-IV variant (both use same questions/scoring)';

-- Step 2: Migrate existing data from responses_wais3_cvlt to responses_cvlt
-- Only migrate if there's data that doesn't conflict with existing visit_id
INSERT INTO responses_cvlt (
    id,
    visit_id,
    patient_id,
    patient_age,
    years_of_education,
    patient_sex,
    trial_1,
    trial_2,
    trial_3,
    trial_4,
    trial_5,
    list_b,
    sdfr,
    sdcr,
    ldfr,
    ldcr,
    semantic_clustering,
    serial_clustering,
    perseverations,
    intrusions,
    recognition_hits,
    false_positives,
    discriminability,
    primacy,
    recency,
    response_bias,
    cvlt_delai,
    trial_1_std,
    trial_5_std,
    total_1_5_std,
    list_b_std,
    sdfr_std,
    sdcr_std,
    ldfr_std,
    ldcr_std,
    semantic_std,
    serial_std,
    persev_std,
    intru_std,
    recog_std,
    false_recog_std,
    discrim_std,
    primacy_std,
    recency_std,
    bias_std,
    questionnaire_version,
    completed_by,
    completed_at,
    created_at,
    updated_at
)
SELECT 
    id,
    visit_id,
    patient_id,
    patient_age,
    years_of_education,
    patient_sex,
    trial_1,
    trial_2,
    trial_3,
    trial_4,
    trial_5,
    list_b,
    sdfr,
    sdcr,
    ldfr,
    ldcr,
    semantic_clustering,
    serial_clustering,
    perseverations,
    intrusions,
    recognition_hits,
    false_positives,
    discriminability,
    primacy,
    recency,
    response_bias,
    cvlt_delai,
    trial_1_std,
    trial_5_std,
    total_1_5_std,
    list_b_std,
    sdfr_std,
    sdcr_std,
    ldfr_std,
    ldcr_std,
    semantic_std,
    serial_std,
    persev_std,
    intru_std,
    recog_std,
    false_recog_std,
    discrim_std,
    primacy_std,
    recency_std,
    bias_std,
    'WAIS-III' as questionnaire_version,
    completed_by,
    completed_at,
    created_at,
    updated_at
FROM responses_wais3_cvlt
ON CONFLICT (visit_id) DO NOTHING;

-- Step 3: Update get_visit_detail RPC to query only responses_cvlt for both variants
-- The RPC currently checks both tables, we need to consolidate to one

-- Drop the existing function first (required when changing return type or structure)
DROP FUNCTION IF EXISTS get_visit_detail(UUID);

-- Recreate the RPC function with updated CVLT queries
CREATE FUNCTION get_visit_detail(p_visit_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
BEGIN
    -- Main query that consolidates all questionnaire responses
    SELECT json_build_object(
        'visit', (SELECT row_to_json(v.*) FROM visits v WHERE v.id = p_visit_id),
        
        -- Auto-questionnaires (Screening)
        'asrm', (SELECT row_to_json(r.*) FROM responses_asrm r WHERE r.visit_id = p_visit_id),
        'qids', (SELECT row_to_json(r.*) FROM responses_qids_sr16 r WHERE r.visit_id = p_visit_id),
        'mdq', (SELECT row_to_json(r.*) FROM responses_mdq r WHERE r.visit_id = p_visit_id),
        
        -- CVLT - Now unified for both WAIS-III and WAIS-IV
        'cvlt', (SELECT row_to_json(r.*) FROM responses_cvlt r WHERE r.visit_id = p_visit_id),
        'wais3_cvlt', (SELECT row_to_json(r.*) FROM responses_cvlt r WHERE r.visit_id = p_visit_id),
        
        -- TMT
        'tmt', (SELECT row_to_json(r.*) FROM responses_tmt r WHERE r.visit_id = p_visit_id),
        'wais3_tmt', (SELECT row_to_json(r.*) FROM responses_wais3_tmt r WHERE r.visit_id = p_visit_id),
        
        -- Stroop
        'stroop', (SELECT row_to_json(r.*) FROM responses_stroop r WHERE r.visit_id = p_visit_id),
        'wais3_stroop', (SELECT row_to_json(r.*) FROM responses_wais3_stroop r WHERE r.visit_id = p_visit_id),
        
        -- Fluences Verbales
        'fluences_verbales', (SELECT row_to_json(r.*) FROM responses_fluences_verbales r WHERE r.visit_id = p_visit_id),
        'wais3_fluences_verbales', (SELECT row_to_json(r.*) FROM responses_wais3_fluences_verbales r WHERE r.visit_id = p_visit_id),
        
        -- COBRA
        'cobra', (SELECT row_to_json(r.*) FROM responses_cobra r WHERE r.visit_id = p_visit_id),
        
        -- CPT3
        'cpt3', (SELECT row_to_json(r.*) FROM responses_cpt3 r WHERE r.visit_id = p_visit_id),
        
        -- WAIS-IV
        'wais4_similitudes', (SELECT row_to_json(r.*) FROM responses_wais4_similitudes r WHERE r.visit_id = p_visit_id),
        'wais4_matrices', (SELECT row_to_json(r.*) FROM responses_wais4_matrices r WHERE r.visit_id = p_visit_id),
        'wais4_code', (SELECT row_to_json(r.*) FROM responses_wais4_code r WHERE r.visit_id = p_visit_id),
        'wais4_digit_span', (SELECT row_to_json(r.*) FROM responses_wais4_digit_span r WHERE r.visit_id = p_visit_id),
        'wais4_criteria', (SELECT row_to_json(r.*) FROM responses_wais4_criteria r WHERE r.visit_id = p_visit_id),
        
        -- Test Commissions
        'test_commissions', (SELECT row_to_json(r.*) FROM responses_test_commissions r WHERE r.visit_id = p_visit_id),
        
        -- SCIP
        'scip', (SELECT row_to_json(r.*) FROM responses_scip r WHERE r.visit_id = p_visit_id),
        
        -- WAIS-III
        'wais3_criteria', (SELECT row_to_json(r.*) FROM responses_wais3_criteria r WHERE r.visit_id = p_visit_id),
        'wais3_learning', (SELECT row_to_json(r.*) FROM responses_wais3_learning r WHERE r.visit_id = p_visit_id),
        'wais3_vocabulaire', (SELECT row_to_json(r.*) FROM responses_wais3_vocabulaire r WHERE r.visit_id = p_visit_id),
        'wais3_matrices', (SELECT row_to_json(r.*) FROM responses_wais3_matrices r WHERE r.visit_id = p_visit_id),
        'wais3_code_symboles', (SELECT row_to_json(r.*) FROM responses_wais3_code_symboles r WHERE r.visit_id = p_visit_id),
        'wais3_digit_span', (SELECT row_to_json(r.*) FROM responses_wais3_digit_span r WHERE r.visit_id = p_visit_id),
        'wais3_cpt2', (SELECT row_to_json(r.*) FROM responses_wais3_cpt2 r WHERE r.visit_id = p_visit_id),
        'wais3_mem3_spatial', (SELECT row_to_json(r.*) FROM responses_wais3_mem3_spatial r WHERE r.visit_id = p_visit_id)
        
        -- Add other questionnaires as needed
    ) INTO result;
    
    RETURN result;
END;
$$;

-- Step 4: Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_visit_detail(UUID) TO authenticated;

-- Step 5: Drop the old WAIS-III CVLT table (after confirming migration was successful)
-- Commented out for safety - uncomment after verifying data migration
-- DROP TABLE IF EXISTS responses_wais3_cvlt;

COMMENT ON TABLE responses_cvlt IS 'California Verbal Learning Test responses - unified for both WAIS-III and WAIS-IV variants (identical questions and scoring)';

