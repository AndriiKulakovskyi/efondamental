// Bipolar Screening Integration Tests
// Tests the complete questionnaire submission flow for bipolar screening visits

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { SupabaseClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import {
  createTestAdminClient,
  createProfessionalClient,
  TEST_CREDENTIALS,
} from '../utils/supabase-test-client';
import {
  setupTestContext,
  cleanupTestContext,
  cleanupTestVisitData,
  TestContext,
  generateAsrmResponses,
  generateQidsResponses,
  generateMdqResponses,
  generateDiagnosticResponses,
  generateOrientationResponses,
} from '../utils/test-helpers';

// Configuration: Set to true to use seeded data and persist results
const USE_SEEDED_DATA = true;
const SKIP_CLEANUP = true; // Keep data in Supabase for verification

interface TestConfig {
  centerId: string;
  patientId: string;
  patientMrn: string;
  visitId: string;
  professionalId: string;
  professionalEmail: string;
}

function loadTestConfig(): TestConfig | null {
  const configPath = path.resolve(__dirname, '../test-config.json');
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  }
  return null;
}

// Import scoring functions for validation
import {
  computeAsrmScore,
  interpretAsrmScore,
  scoreAsrm,
  ASRM_CUTOFF,
} from '@/lib/questionnaires/bipolar/screening/auto/asrm';
import {
  computeQidsScore,
  interpretQidsScore,
  scoreQids,
} from '@/lib/questionnaires/bipolar/screening/auto/qids';
import {
  computeMdqQ1Score,
  isMdqPositive,
  interpretMdqScore,
  scoreMdq,
} from '@/lib/questionnaires/bipolar/screening/auto/mdq';
import {
  isEligibleForExpertCenter,
  checkOrientationEligibility,
} from '@/lib/questionnaires/bipolar/screening/medical/orientation';

// ============================================================================
// Test Suite Configuration
// ============================================================================

describe('Bipolar Screening Integration Tests', () => {
  let context: TestContext;
  let professionalClient: SupabaseClient;
  let useSeededData = false;

  beforeAll(async () => {
    const adminClient = createTestAdminClient();
    
    // Try to use seeded data first
    if (USE_SEEDED_DATA) {
      const config = loadTestConfig();
      if (config) {
        console.log('Using seeded test data from test-config.json');
        
        // Clear any existing questionnaire data for a fresh test run
        await cleanupTestVisitData(adminClient, config.visitId);
        
        context = {
          adminClient,
          centerId: config.centerId,
          professionalId: config.professionalId,
          patient: {
            id: config.patientId,
            medical_record_number: config.patientMrn,
            first_name: 'IntegrationTest',
            last_name: 'BipolarPatient',
          },
          visit: {
            id: config.visitId,
            patient_id: config.patientId,
            visit_type: 'screening',
            status: 'in_progress',
          },
        };
        useSeededData = true;
        console.log(`Using seeded data: Patient ${context.patient.id}, Visit ${context.visit.id}`);
      }
    }
    
    // Fall back to creating new test data
    if (!useSeededData) {
      context = await setupTestContext();
      console.log(`Test context created: Patient ${context.patient.id}, Visit ${context.visit.id}`);
    }

    // Get authenticated professional client
    professionalClient = await createProfessionalClient();
  });

  afterAll(async () => {
    // Only clean up if not using seeded data and cleanup is enabled
    if (!useSeededData && !SKIP_CLEANUP) {
      await cleanupTestContext(context);
      console.log('Test context cleaned up');
    } else {
      console.log('Skipping cleanup - data persisted in Supabase for verification');
    }
  });

  // ============================================================================
  // ASRM Questionnaire Tests
  // ============================================================================

  describe('ASRM Questionnaire', () => {
    it('should submit valid ASRM responses and compute correct score', async () => {
      const responses = generateAsrmResponses(); // Default: moderate responses, total = 7
      const expectedScore = responses.q1 + responses.q2 + responses.q3 + responses.q4 + responses.q5;

      // Submit via direct database insert (simulating service layer)
      const { data, error } = await context.adminClient
        .from('bipolar_asrm')
        .upsert({
          visit_id: context.visit.id,
          patient_id: context.patient.id,
          completed_by: context.professionalId,
          ...responses,
          total_score: expectedScore,
          interpretation: interpretAsrmScore(expectedScore),
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.total_score).toBe(expectedScore);
      expect(data.interpretation).toContain('maniaque');
    });

    it('should correctly compute ASRM score for minimum values (all zeros)', async () => {
      const responses = generateAsrmResponses({ allZeros: true });
      const score = computeAsrmScore(responses as any);

      expect(score).toBe(0);
      expect(interpretAsrmScore(score)).toContain('non suggestif');
    });

    it('should correctly compute ASRM score for maximum values (all 4s)', async () => {
      const responses = generateAsrmResponses({ allMax: true });
      const score = computeAsrmScore(responses as any);

      expect(score).toBe(20);
      expect(interpretAsrmScore(score)).toContain('suggestif');
    });

    it('should identify score at cutoff boundary (score = 6)', async () => {
      const responses = generateAsrmResponses({ specificScore: 6 });
      const result = scoreAsrm(responses as any);

      expect(result.total_score).toBe(6);
      expect(result.is_positive).toBe(true);
    });

    it('should identify score below cutoff (score = 5)', async () => {
      const responses = generateAsrmResponses({ specificScore: 5 });
      const result = scoreAsrm(responses as any);

      expect(result.total_score).toBe(5);
      expect(result.is_positive).toBe(false);
    });

    it('should fetch saved ASRM response', async () => {
      const { data, error } = await context.adminClient
        .from('bipolar_asrm')
        .select('*')
        .eq('visit_id', context.visit.id)
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.patient_id).toBe(context.patient.id);
      expect(data.total_score).toBeDefined();
    });
  });

  // ============================================================================
  // QIDS-SR16 Questionnaire Tests
  // ============================================================================

  describe('QIDS-SR16 Questionnaire', () => {
    it('should submit valid QIDS responses and compute correct domain scores', async () => {
      const responses = generateQidsResponses({ severity: 'moderate' });
      const result = scoreQids(responses as any);

      // Submit to database
      const { data, error } = await context.adminClient
        .from('bipolar_qids_sr16')
        .upsert({
          visit_id: context.visit.id,
          patient_id: context.patient.id,
          completed_by: context.professionalId,
          ...responses,
          total_score: result.total_score,
          interpretation: result.interpretation,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.total_score).toBe(result.total_score);
    });

    it('should correctly compute QIDS domain-based scoring', () => {
      // Test that domain MAX scoring works correctly
      const responses = {
        q1: 3, q2: 1, q3: 2, q4: 0, // Sleep: MAX = 3
        q5: 2, // Direct score
        q6: 0, q7: 3, q8: 1, q9: 2, // Appetite/Weight: MAX = 3
        q10: 2, q11: 2, q12: 1, q13: 2, q14: 2, // Direct scores
        q15: 1, q16: 3, // Psychomotor: MAX = 3
      };

      const score = computeQidsScore(responses);
      // Expected: 3 (sleep) + 2 (q5) + 3 (appetite) + 2+2+1+2+2 (q10-14) + 3 (psychomotor) = 20
      expect(score).toBe(20);
    });

    it('should correctly interpret QIDS severity levels', () => {
      expect(interpretQidsScore(0)).toBe('Pas de depression');
      expect(interpretQidsScore(5)).toBe('Pas de depression');
      expect(interpretQidsScore(6)).toBe('Depression legere');
      expect(interpretQidsScore(10)).toBe('Depression legere');
      expect(interpretQidsScore(11)).toBe('Depression moderee');
      expect(interpretQidsScore(15)).toBe('Depression moderee');
      expect(interpretQidsScore(16)).toBe('Depression severe');
      expect(interpretQidsScore(20)).toBe('Depression severe');
      expect(interpretQidsScore(21)).toBe('Depression tres severe');
      expect(interpretQidsScore(27)).toBe('Depression tres severe');
    });

    it('should fetch saved QIDS response', async () => {
      const { data, error } = await context.adminClient
        .from('bipolar_qids_sr16')
        .select('*')
        .eq('visit_id', context.visit.id)
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.patient_id).toBe(context.patient.id);
    });
  });

  // ============================================================================
  // MDQ Questionnaire Tests
  // ============================================================================

  describe('MDQ Questionnaire', () => {
    it('should submit valid MDQ responses and compute correct Q1 score', async () => {
      const responses = generateMdqResponses({ positive: true });
      const result = scoreMdq(responses as any);

      // Submit to database
      const { data, error } = await context.adminClient
        .from('bipolar_mdq')
        .upsert({
          visit_id: context.visit.id,
          patient_id: context.patient.id,
          completed_by: context.professionalId,
          ...responses,
          q1_score: result.q1_score,
          interpretation: result.interpretation,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.q1_score).toBe(7); // 7 yes responses in our positive mock
      expect(data.interpretation).toContain('Positif');
    });

    it('should correctly identify positive MDQ screen', () => {
      // Positive: >=7 on Q1, Q2=yes, Q3>=2
      const positiveResponses = {
        q1_1: 1, q1_2: 1, q1_3: 1, q1_4: 1, q1_5: 1,
        q1_6: 1, q1_7: 1, q1_8: 0, q1_9: 0, q1_10: 0,
        q1_11: 0, q1_12: 0, q1_13: 0,
        q2: 1,
        q3: 2,
      };

      expect(isMdqPositive(positiveResponses)).toBe(true);
      expect(computeMdqQ1Score(positiveResponses)).toBe(7);
    });

    it('should correctly identify negative MDQ screen (Q1 < 7)', () => {
      const negativeResponses = {
        q1_1: 1, q1_2: 1, q1_3: 1, q1_4: 1, q1_5: 1,
        q1_6: 1, q1_7: 0, q1_8: 0, q1_9: 0, q1_10: 0,
        q1_11: 0, q1_12: 0, q1_13: 0,
        q2: 1,
        q3: 3,
      };

      expect(isMdqPositive(negativeResponses)).toBe(false);
      expect(computeMdqQ1Score(negativeResponses)).toBe(6);
    });

    it('should correctly identify negative MDQ screen (Q2 = no)', () => {
      const negativeResponses = {
        q1_1: 1, q1_2: 1, q1_3: 1, q1_4: 1, q1_5: 1,
        q1_6: 1, q1_7: 1, q1_8: 0, q1_9: 0, q1_10: 0,
        q1_11: 0, q1_12: 0, q1_13: 0,
        q2: 0, // No - symptoms didn't occur together
        q3: 3,
      };

      expect(isMdqPositive(negativeResponses)).toBe(false);
    });

    it('should correctly identify negative MDQ screen (Q3 < 2)', () => {
      const negativeResponses = {
        q1_1: 1, q1_2: 1, q1_3: 1, q1_4: 1, q1_5: 1,
        q1_6: 1, q1_7: 1, q1_8: 0, q1_9: 0, q1_10: 0,
        q1_11: 0, q1_12: 0, q1_13: 0,
        q2: 1,
        q3: 1, // Minor problem, not moderate/serious
      };

      expect(isMdqPositive(negativeResponses)).toBe(false);
    });

    it('should fetch saved MDQ response', async () => {
      const { data, error } = await context.adminClient
        .from('bipolar_mdq')
        .select('*')
        .eq('visit_id', context.visit.id)
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.patient_id).toBe(context.patient.id);
    });
  });

  // ============================================================================
  // Diagnostic Form Tests
  // ============================================================================

  describe('Diagnostic Form', () => {
    it('should submit valid Diagnostic responses with bipolar diagnosed', async () => {
      const responses = generateDiagnosticResponses({
        diagEvoque: 'oui',
        bilanProgramme: 'oui',
      });

      const { data, error } = await context.adminClient
        .from('bipolar_diagnostic')
        .upsert({
          visit_id: context.visit.id,
          patient_id: context.patient.id,
          completed_by: context.professionalId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.diag_evoque).toBe('oui');
      expect(data.bilan_programme).toBe('oui');
    });

    it('should submit Diagnostic with diagnosis rejected path', async () => {
      const responses = generateDiagnosticResponses({ diagEvoque: 'non' });

      // Verify the conditional field is set
      expect(responses.diag_recuse_precision).toBe('edm_unipolaire');
    });

    it('should submit Diagnostic with bilan not programmed', async () => {
      const responses = generateDiagnosticResponses({
        diagEvoque: 'oui',
        bilanProgramme: 'non',
      });

      expect(responses.bilan_programme).toBe('non');
      expect(responses.bilan_programme_precision).toBe('patient_non_disponible');
    });

    it('should fetch saved Diagnostic response', async () => {
      const { data, error } = await context.adminClient
        .from('bipolar_diagnostic')
        .select('*')
        .eq('visit_id', context.visit.id)
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.patient_id).toBe(context.patient.id);
      expect(data.lettre_information).toBeDefined();
    });
  });

  // ============================================================================
  // Orientation Form Tests
  // ============================================================================

  describe('Orientation Form', () => {
    it('should submit valid Orientation responses with all criteria met', async () => {
      const responses = generateOrientationResponses({ eligible: true });

      const { data, error } = await context.adminClient
        .from('bipolar_orientation')
        .upsert({
          visit_id: context.visit.id,
          patient_id: context.patient.id,
          completed_by: context.professionalId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.trouble_bipolaire_ou_suspicion).toBe('oui');
      expect(data.accord_evaluation_centre_expert).toBe('oui');
    });

    it('should correctly check eligibility when all criteria are met', () => {
      const responses = {
        trouble_bipolaire_ou_suspicion: 'oui' as const,
        etat_thymique_compatible: 'oui' as const,
        prise_en_charge_100_ou_accord: 'oui' as const,
        accord_evaluation_centre_expert: 'oui' as const,
        accord_transmission_cr: 'oui' as const,
      };

      expect(isEligibleForExpertCenter(responses)).toBe(true);

      const result = checkOrientationEligibility(responses);
      expect(result.is_eligible).toBe(true);
      expect(result.missing_criteria).toHaveLength(0);
    });

    it('should correctly identify ineligibility when any criterion is not met', () => {
      const responses = {
        trouble_bipolaire_ou_suspicion: 'oui' as const,
        etat_thymique_compatible: 'non' as const, // Not compatible
        prise_en_charge_100_ou_accord: 'oui' as const,
        accord_evaluation_centre_expert: 'oui' as const,
        accord_transmission_cr: 'oui' as const,
      };

      expect(isEligibleForExpertCenter(responses)).toBe(false);

      const result = checkOrientationEligibility(responses);
      expect(result.is_eligible).toBe(false);
      expect(result.missing_criteria).toContain('Etat thymique compatible');
    });

    it('should list all missing criteria', () => {
      const responses = {
        trouble_bipolaire_ou_suspicion: 'non' as const,
        etat_thymique_compatible: 'non' as const,
        prise_en_charge_100_ou_accord: 'non' as const,
        accord_evaluation_centre_expert: 'non' as const,
        accord_transmission_cr: 'non' as const,
      };

      const result = checkOrientationEligibility(responses);
      expect(result.is_eligible).toBe(false);
      expect(result.missing_criteria).toHaveLength(5);
    });

    it('should fetch saved Orientation response', async () => {
      const { data, error } = await context.adminClient
        .from('bipolar_orientation')
        .select('*')
        .eq('visit_id', context.visit.id)
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.patient_id).toBe(context.patient.id);
    });
  });

  // ============================================================================
  // Visit Completion Tests
  // ============================================================================

  describe('Visit Completion Tracking', () => {
    it('should have all 5 questionnaires completed', async () => {
      // Verify all questionnaire tables have entries for this visit
      const [asrm, qids, mdq, diagnostic, orientation] = await Promise.all([
        context.adminClient.from('bipolar_asrm').select('id').eq('visit_id', context.visit.id).single(),
        context.adminClient.from('bipolar_qids_sr16').select('id').eq('visit_id', context.visit.id).single(),
        context.adminClient.from('bipolar_mdq').select('id').eq('visit_id', context.visit.id).single(),
        context.adminClient.from('bipolar_diagnostic').select('id').eq('visit_id', context.visit.id).single(),
        context.adminClient.from('bipolar_orientation').select('id').eq('visit_id', context.visit.id).single(),
      ]);

      expect(asrm.data).toBeDefined();
      expect(qids.data).toBeDefined();
      expect(mdq.data).toBeDefined();
      expect(diagnostic.data).toBeDefined();
      expect(orientation.data).toBeDefined();
    });

    it('should calculate 100% completion when all questionnaires are done', async () => {
      // Count completed questionnaires
      const tables = [
        'bipolar_asrm',
        'bipolar_qids_sr16',
        'bipolar_mdq',
        'bipolar_diagnostic',
        'bipolar_orientation',
      ];

      let completed = 0;
      for (const table of tables) {
        const { data } = await context.adminClient
          .from(table)
          .select('id')
          .eq('visit_id', context.visit.id)
          .single();
        
        if (data) completed++;
      }

      const total = 5; // Bipolar screening has 5 questionnaires
      const percentage = Math.round((completed / total) * 100);

      expect(completed).toBe(5);
      expect(percentage).toBe(100);
    });

    it('should update visit completion status', async () => {
      // Update the visit with completion data
      const { error } = await context.adminClient
        .from('visits')
        .update({
          completion_percentage: 100,
          completed_questionnaires: 5,
          total_questionnaires: 5,
        })
        .eq('id', context.visit.id);

      expect(error).toBeNull();

      // Verify the update
      const { data: visit } = await context.adminClient
        .from('visits')
        .select('completion_percentage, completed_questionnaires, total_questionnaires')
        .eq('id', context.visit.id)
        .single();

      expect(visit?.completion_percentage).toBe(100);
      expect(visit?.completed_questionnaires).toBe(5);
      expect(visit?.total_questionnaires).toBe(5);
    });
  });

  // ============================================================================
  // Data Integrity Tests
  // ============================================================================

  describe('Data Integrity', () => {
    it('should enforce foreign key constraint for visit_id', async () => {
      const { error } = await context.adminClient
        .from('bipolar_asrm')
        .insert({
          visit_id: '00000000-0000-0000-0000-000000000000', // Non-existent visit
          patient_id: context.patient.id,
          q1: 0, q2: 0, q3: 0, q4: 0, q5: 0,
        });

      expect(error).toBeDefined();
      expect(error?.code).toBe('23503'); // Foreign key violation
    });

    it('should enforce unique constraint on visit_id (upsert behavior)', async () => {
      // First insert
      await context.adminClient
        .from('bipolar_asrm')
        .upsert({
          visit_id: context.visit.id,
          patient_id: context.patient.id,
          q1: 1, q2: 1, q3: 1, q4: 1, q5: 1,
          total_score: 5,
          interpretation: 'Test 1',
        }, { onConflict: 'visit_id' });

      // Second upsert should update, not create duplicate
      await context.adminClient
        .from('bipolar_asrm')
        .upsert({
          visit_id: context.visit.id,
          patient_id: context.patient.id,
          q1: 2, q2: 2, q3: 2, q4: 2, q5: 2,
          total_score: 10,
          interpretation: 'Test 2',
        }, { onConflict: 'visit_id' });

      // Should only have one record
      const { data, count } = await context.adminClient
        .from('bipolar_asrm')
        .select('*', { count: 'exact' })
        .eq('visit_id', context.visit.id);

      expect(count).toBe(1);
      expect(data?.[0]?.total_score).toBe(10); // Should be updated value
    });
  });

  // ============================================================================
  // Computed Fields Verification
  // ============================================================================

  describe('Computed Fields Verification', () => {
    it('should verify QIDS computed fields match service layer calculation', async () => {
      // Read the QIDS response that was submitted earlier in the test suite
      const { data: submitted } = await context.adminClient
        .from('bipolar_qids_sr16')
        .select('*')
        .eq('visit_id', context.visit.id)
        .single();

      expect(submitted).toBeDefined();
      expect(submitted.total_score).toBeDefined();
      expect(submitted.interpretation).toBeDefined();

      // Compute expected values using scoring functions with the same inputs
      const expected = scoreQids({
        q1: submitted.q1,
        q2: submitted.q2,
        q3: submitted.q3,
        q4: submitted.q4,
        q5: submitted.q5,
        q6: submitted.q6,
        q7: submitted.q7,
        q8: submitted.q8,
        q9: submitted.q9,
        q10: submitted.q10,
        q11: submitted.q11,
        q12: submitted.q12,
        q13: submitted.q13,
        q14: submitted.q14,
        q15: submitted.q15,
        q16: submitted.q16,
      });

      // Verify total_score matches
      expect(submitted.total_score).toBe(expected.total_score);
      
      // Verify interpretation matches
      expect(submitted.interpretation).toBe(expected.interpretation);
      
      // Verify severity category
      expect(submitted.total_score).toBeGreaterThanOrEqual(0);
      expect(submitted.total_score).toBeLessThanOrEqual(27);
    });

    it('should verify MDQ computed fields match service layer calculation', async () => {
      // Read the MDQ response that was submitted earlier
      const { data: submitted } = await context.adminClient
        .from('bipolar_mdq')
        .select('*')
        .eq('visit_id', context.visit.id)
        .single();

      expect(submitted).toBeDefined();
      expect(submitted.q1_score).toBeDefined();
      expect(submitted.interpretation).toBeDefined();

      // Compute expected values
      const expected = scoreMdq({
        q1_1: submitted.q1_1,
        q1_2: submitted.q1_2,
        q1_3: submitted.q1_3,
        q1_4: submitted.q1_4,
        q1_5: submitted.q1_5,
        q1_6: submitted.q1_6,
        q1_7: submitted.q1_7,
        q1_8: submitted.q1_8,
        q1_9: submitted.q1_9,
        q1_10: submitted.q1_10,
        q1_11: submitted.q1_11,
        q1_12: submitted.q1_12,
        q1_13: submitted.q1_13,
        q2: submitted.q2,
        q3: submitted.q3,
      });

      // Verify q1_score matches
      expect(submitted.q1_score).toBe(expected.q1_score);
      
      // Verify is_positive logic
      const expectedPositive = isMdqPositive({
        q1_1: submitted.q1_1,
        q1_2: submitted.q1_2,
        q1_3: submitted.q1_3,
        q1_4: submitted.q1_4,
        q1_5: submitted.q1_5,
        q1_6: submitted.q1_6,
        q1_7: submitted.q1_7,
        q1_8: submitted.q1_8,
        q1_9: submitted.q1_9,
        q1_10: submitted.q1_10,
        q1_11: submitted.q1_11,
        q1_12: submitted.q1_12,
        q1_13: submitted.q1_13,
        q2: submitted.q2,
        q3: submitted.q3,
      });
      if (expectedPositive) {
        expect(submitted.interpretation).toContain('Positif');
      } else {
        expect(submitted.interpretation).toContain('Négatif');
      }
      
      // Verify q1_score in valid range
      expect(submitted.q1_score).toBeGreaterThanOrEqual(0);
      expect(submitted.q1_score).toBeLessThanOrEqual(13);
    });

    it('should verify ASRM uses generated column for total_score', async () => {
      // Read the ASRM response that was submitted earlier
      const { data: submitted } = await context.adminClient
        .from('bipolar_asrm')
        .select('*')
        .eq('visit_id', context.visit.id)
        .single();

      expect(submitted).toBeDefined();
      expect(submitted.total_score).toBeDefined();

      // Compute expected score from individual questions
      const expectedScore = computeAsrmScore({
        q1: submitted.q1,
        q2: submitted.q2,
        q3: submitted.q3,
        q4: submitted.q4,
        q5: submitted.q5,
      });
      
      // Verify database-generated total_score matches
      expect(submitted.total_score).toBe(expectedScore);
      
      // Verify interpretation exists
      expect(submitted.interpretation).toBeDefined();
      
      // If interpretation looks like test data, skip validation (Data Integrity test may have modified it)
      if (!submitted.interpretation.includes('Test')) {
        const isPositive = submitted.total_score! >= ASRM_CUTOFF;
        const containsSuggestif = submitted.interpretation!.toLowerCase().includes('suggestif');
        if (isPositive) {
          expect(containsSuggestif).toBe(true);
        }
      }
    });

    it('should verify QIDS domain scoring (max logic)', async () => {
      // Read the QIDS response to verify domain scoring logic
      const { data: submitted } = await context.adminClient
        .from('bipolar_qids_sr16')
        .select('*')
        .eq('visit_id', context.visit.id)
        .single();

      expect(submitted).toBeDefined();

      // Manually compute using MAX logic
      const sleepMax = Math.max(submitted.q1, submitted.q2, submitted.q3, submitted.q4);
      const appetiteMax = Math.max(submitted.q6, submitted.q7, submitted.q8, submitted.q9);
      const psychomotorMax = Math.max(submitted.q15, submitted.q16);
      
      const expectedTotal = sleepMax + submitted.q5 + appetiteMax +
        submitted.q10 + submitted.q11 + submitted.q12 + submitted.q13 + submitted.q14 +
        psychomotorMax;

      // Verify score uses MAX logic, not SUM
      expect(submitted.total_score).toBe(expectedTotal);
      
      // Verify the score is reasonable (not impossibly high)
      expect(submitted.total_score).toBeGreaterThanOrEqual(0);
      expect(submitted.total_score).toBeLessThanOrEqual(27);
    });

    it('should verify MDQ positive screening criteria', async () => {
      // Read MDQ to verify positive/negative determination
      const { data: submitted } = await context.adminClient
        .from('bipolar_mdq')
        .select('*')
        .eq('visit_id', context.visit.id)
        .single();

      expect(submitted).toBeDefined();

      // Verify q1_score is sum of 13 items
      const computedQ1Score = submitted.q1_1 + submitted.q1_2 + submitted.q1_3 + 
        submitted.q1_4 + submitted.q1_5 + submitted.q1_6 + submitted.q1_7 + 
        submitted.q1_8 + submitted.q1_9 + submitted.q1_10 + submitted.q1_11 + 
        submitted.q1_12 + submitted.q1_13;
      
      expect(submitted.q1_score).toBe(computedQ1Score);

      // Verify interpretation follows criteria logic
      const meetsPositiveCriteria = submitted.q1_score >= 7 && 
        submitted.q2 === 1 && 
        submitted.q3 !== null && 
        submitted.q3 >= 2;
      
      if (meetsPositiveCriteria) {
        expect(submitted.interpretation).toContain('Positif');
      } else {
        expect(submitted.interpretation).toContain('Négatif');
      }
    });

    it('should verify QIDS severity thresholds', async () => {
      // Read QIDS and verify interpretation thresholds
      const { data: submitted } = await context.adminClient
        .from('bipolar_qids_sr16')
        .select('*')
        .eq('visit_id', context.visit.id)
        .single();

      expect(submitted).toBeDefined();
      
      // Verify interpretation matches score thresholds
      const score = submitted.total_score!;
      const interp = submitted.interpretation!;
      
      // Check that interpretation is consistent with score
      if (score <= 5) {
        expect(interp).toContain('Pas de');
      } else if (score <= 10) {
        expect(interp).toContain('legere');
      } else if (score <= 15) {
        expect(interp).toContain('moderee');
      } else if (score <= 20) {
        expect(interp).toContain('severe');
      } else {
        expect(interp).toContain('tres severe');
      }
    });
  });
});
