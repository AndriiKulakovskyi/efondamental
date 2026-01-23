// Bipolar Initial Evaluation - Nurse Module Integration Tests
// Tests for all 7 questionnaires in the nurse module using service layer
// This version uses the service layer to ensure computed fields are calculated

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { SupabaseClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import {
  createTestAdminClient,
  createProfessionalClient,
} from '../utils/supabase-test-client';
import {
  cleanupNurseModuleData,
  generateTobaccoResponses,
  generateFagerstromResponses,
  generatePhysicalParamsResponses,
  generateBloodPressureResponses,
  generateSleepApneaResponses,
  generateBiologicalAssessmentResponses,
  generateEcgResponses,
} from '../utils/test-helpers';
import {
  saveTobaccoForTest,
  saveFagerstromForTest,
  savePhysicalParamsForTest,
  saveBloodPressureForTest,
  saveSleepApneaForTest,
  saveBiologicalAssessmentForTest,
  saveEcgForTest,
} from '../utils/nurse-test-helpers';

// ============================================================================
// Configuration
// ============================================================================

const USE_SEEDED_DATA = true;
const SKIP_CLEANUP = true;

interface TestConfig {
  centerId: string;
  patientId: string;
  patientMrn: string;
  patientGender?: string;
  screeningVisitId: string;
  initialEvalVisitId: string;
  professionalId: string;
  professionalEmail: string;
}

function loadTestConfig(): TestConfig | null {
  const configPath = path.resolve(__dirname, '../test-config.json');
  if (fs.existsSync(configPath)) {
    const content = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(content) as TestConfig;
  }
  return null;
}

// ============================================================================
// Test Suite
// ============================================================================

describe('Bipolar Initial Evaluation - Nurse Module Integration Tests (Service Layer)', () => {
  let adminClient: SupabaseClient;
  let professionalClient: SupabaseClient;
  let visitId: string;
  let patientId: string;
  let patientGender: string;

  beforeAll(async () => {
    adminClient = createTestAdminClient();

    if (USE_SEEDED_DATA) {
      const config = loadTestConfig();
      if (config && config.initialEvalVisitId) {
        visitId = config.initialEvalVisitId;
        patientId = config.patientId;
        patientGender = config.patientGender || 'M';
        console.log(`Using seeded initial evaluation visit: ${visitId}`);
        console.log(`Patient ID: ${patientId}, Gender: ${patientGender}`);

        // Clean up any existing nurse module data for fresh tests
        await cleanupNurseModuleData(adminClient, visitId);
      } else {
        throw new Error(
          'Test config not found or missing initialEvalVisitId. Run npm run seed:test first.'
        );
      }
    } else {
      throw new Error(
        'Dynamic test setup not implemented. Use USE_SEEDED_DATA = true.'
      );
    }

    professionalClient = await createProfessionalClient();
  });

  afterAll(async () => {
    if (!SKIP_CLEANUP) {
      await cleanupNurseModuleData(adminClient, visitId);
    } else {
      console.log('Skipping cleanup - nurse module data persisted for verification');
    }
  });

  // ==========================================================================
  // SERVICE LAYER SUBMISSION TESTS
  // ==========================================================================

  describe('1. Tobacco Assessment (via Service Layer)', () => {
    it('should save non-smoker status with computed fields', async () => {
      const responses = generateTobaccoResponses({ status: 'non_smoker' });

      const data = await saveTobaccoForTest(adminClient, {
        visit_id: visitId,
        patient_id: patientId,
        ...responses,
      });

      expect(data).toBeDefined();
      expect(data.smoking_status).toBe('non_smoker');
      expect(data.pack_years).toBeNull();
      expect(data.visit_id).toBe(visitId);
    });

    it('should save current smoker and handle upsert behavior', async () => {
      const responses = generateTobaccoResponses({
        status: 'current_smoker',
        packYears: 20,
        hasSubstitution: true,
      });

      const data = await saveTobaccoForTest(adminClient, {
        visit_id: visitId,
        patient_id: patientId,
        ...responses,
      });

      expect(data).toBeDefined();
      expect(data.smoking_status).toBe('current_smoker');
      expect(data.pack_years).toBe(20);
      expect(data.has_substitution).toBe(true);
    });
  });

  describe('2. Fagerstrom Test (via Service Layer)', () => {
    it('should compute total_score, dependence_level, and interpretation', async () => {
      // First ensure tobacco status is current_smoker
      await saveTobaccoForTest(adminClient, {
        visit_id: visitId,
        patient_id: patientId,
        smoking_status: 'current_smoker',
        pack_years: 10,
      });

      const responses = generateFagerstromResponses();

      const data = await saveFagerstromForTest(adminClient, {
        visit_id: visitId,
        patient_id: patientId,
        ...responses,
      });

      expect(data).toBeDefined();
      expect(data.total_score).not.toBeNull();
      expect(data.dependence_level).not.toBeNull();
      expect(data.interpretation).not.toBeNull();
      expect(typeof data.total_score).toBe('number');
      expect(['none', 'low', 'moderate', 'high', 'very_high']).toContain(data.dependence_level);
    });
  });

  describe('3. Physical Parameters (via Service Layer)', () => {
    it('should compute BMI from height and weight', async () => {
      const responses = generatePhysicalParamsResponses();

      const data = await savePhysicalParamsForTest(adminClient, {
        visit_id: visitId,
        patient_id: patientId,
        ...responses,
      });

      expect(data).toBeDefined();
      expect(data.bmi).not.toBeNull();
      expect(typeof data.bmi).toBe('number');
      expect(data.bmi).toBeGreaterThan(0);
      
      // Verify BMI calculation
      if (data.height_cm && data.weight_kg) {
        // BMI is rounded to 1 decimal in the shared implementation.
        const expectedBMI = Math.round((data.weight_kg / Math.pow(data.height_cm / 100, 2)) * 10) / 10;
        expect(data.bmi).toBeCloseTo(expectedBMI, 1);
      }
    });
  });

  describe('4. Blood Pressure (via Service Layer)', () => {
    it('should compute tension_lying and tension_standing strings', async () => {
      const responses = generateBloodPressureResponses();

      const data = await saveBloodPressureForTest(adminClient, {
        visit_id: visitId,
        patient_id: patientId,
        ...responses,
      });

      expect(data).toBeDefined();
      expect(data.tension_lying).not.toBeNull();
      expect(data.tension_standing).not.toBeNull();
      expect(data.tension_lying).toMatch(/^\d+\/\d+$/);
      expect(data.tension_standing).toMatch(/^\d+\/\d+$/);
    });
  });

  describe('5. Sleep Apnea (via Service Layer)', () => {
    it('should compute STOP-Bang score, risk_level, and interpretation for undiagnosed patients', async () => {
      const responses = generateSleepApneaResponses({ diagnosed: false });

      const data = await saveSleepApneaForTest(adminClient, {
        visit_id: visitId,
        patient_id: patientId,
        ...responses,
      });

      expect(data).toBeDefined();
      expect(data.stop_bang_score).not.toBeNull();
      expect(data.risk_level).not.toBeNull();
      expect(data.interpretation).not.toBeNull();
      expect(typeof data.stop_bang_score).toBe('number');
      expect(['low', 'intermediate', 'high']).toContain(data.risk_level);
    });

    it('should handle diagnosed sleep apnea patients (skip STOP-Bang)', async () => {
      const responses = generateSleepApneaResponses({ diagnosed: true });

      const data = await saveSleepApneaForTest(adminClient, {
        visit_id: visitId,
        patient_id: patientId,
        ...responses,
      });

      expect(data).toBeDefined();
      expect(data.diagnosed_sleep_apnea).toBe('yes');
      // STOP-Bang score is still computed, but risk classification is not applicable.
      expect(data.stop_bang_score).toBe(0);
      expect(data.risk_level).toBeNull();
    });
  });

  describe('6. Biological Assessment (via Service Layer)', () => {
    it('should compute rapport_total_hdl and calcemie_corrigee', async () => {
      const responses = generateBiologicalAssessmentResponses();

      const data = await saveBiologicalAssessmentForTest(adminClient, {
        visit_id: visitId,
        patient_id: patientId,
        ...responses,
      });

      expect(data).toBeDefined();
      
      if (data.cholesterol_total && data.hdl && data.hdl > 0) {
        expect(data.rapport_total_hdl).not.toBeNull();
        const expectedRatio = Math.round((data.cholesterol_total / data.hdl) * 100) / 100;
        expect(data.rapport_total_hdl).toBeCloseTo(expectedRatio, 2);
      }

      if (data.calcemie && data.protidemie) {
        expect(data.calcemie_corrigee).not.toBeNull();
        const expectedCalcemie = Math.round((data.calcemie / 0.55 + data.protidemie / 160) * 100) / 100;
        expect(data.calcemie_corrigee).toBeCloseTo(expectedCalcemie, 2);
      }
    });
  });

  describe('7. ECG (via Service Layer)', () => {
    it('should compute QTc and interpretation with patient gender', async () => {
      const responses = generateEcgResponses({ performed: true });

      const data = await saveEcgForTest(adminClient, {
        visit_id: visitId,
        patient_id: patientId,
        ...responses,
      }, patientGender as 'M' | 'F');

      expect(data).toBeDefined();
      
      if (data.ecg_performed === 'yes' && data.qt_measured && data.rr_measured) {
        expect(data.qtc_calculated).not.toBeNull();
        expect(data.interpretation).not.toBeNull();
        
        // Verify QTc calculation (Bazett formula)
        const expectedQTc = data.qt_measured / Math.sqrt(data.rr_measured);
        expect(data.qtc_calculated).toBeCloseTo(expectedQTc, 3);
      }
    });
  });

  // ==========================================================================
  // VISIT COMPLETION TRACKING TESTS
  // ==========================================================================

  describe('Visit Completion Tracking', () => {
    beforeAll(async () => {
      // Ensure ALL 7 nurse questionnaires are submitted before testing completion
      // This mimics what a healthcare professional would do in the real application
      
      // 1. Tobacco
      await saveTobaccoForTest(adminClient, {
        visit_id: visitId,
        patient_id: patientId,
        ...generateTobaccoResponses({ status: 'current_smoker', packYears: 10 }),
      });
      
      // 2. Fagerstrom
      await saveFagerstromForTest(adminClient, {
        visit_id: visitId,
        patient_id: patientId,
        ...generateFagerstromResponses(),
      });
      
      // 3. Physical Parameters
      await savePhysicalParamsForTest(adminClient, {
        visit_id: visitId,
        patient_id: patientId,
        ...generatePhysicalParamsResponses(),
      });
      
      // 4. Blood Pressure
      await saveBloodPressureForTest(adminClient, {
        visit_id: visitId,
        patient_id: patientId,
        ...generateBloodPressureResponses(),
      });
      
      // 5. Sleep Apnea
      await saveSleepApneaForTest(adminClient, {
        visit_id: visitId,
        patient_id: patientId,
        ...generateSleepApneaResponses({ diagnosed: false }),
      });
      
      // 6. Biological Assessment
      await saveBiologicalAssessmentForTest(adminClient, {
        visit_id: visitId,
        patient_id: patientId,
        ...generateBiologicalAssessmentResponses(),
      });
      
      // 7. ECG
      await saveEcgForTest(adminClient, {
        visit_id: visitId,
        patient_id: patientId,
        ...generateEcgResponses({ performed: true }),
      }, patientGender as 'M' | 'F');
    });

    it('should have all 7 nurse module questionnaires completed', async () => {
      // Verify all questionnaire tables have entries for this visit
      const [tobacco, fagerstrom, physicalParams, bloodPressure, sleepApnea, biological, ecg] = await Promise.all([
        adminClient.from('bipolar_nurse_tobacco').select('id').eq('visit_id', visitId).single(),
        adminClient.from('bipolar_nurse_fagerstrom').select('id').eq('visit_id', visitId).single(),
        adminClient.from('bipolar_nurse_physical_params').select('id').eq('visit_id', visitId).single(),
        adminClient.from('bipolar_nurse_blood_pressure').select('id').eq('visit_id', visitId).single(),
        adminClient.from('bipolar_nurse_sleep_apnea').select('id').eq('visit_id', visitId).single(),
        adminClient.from('bipolar_nurse_biological_assessment').select('id').eq('visit_id', visitId).single(),
        adminClient.from('bipolar_nurse_ecg').select('id').eq('visit_id', visitId).single(),
      ]);

      expect(tobacco.data).toBeDefined();
      expect(fagerstrom.data).toBeDefined();
      expect(physicalParams.data).toBeDefined();
      expect(bloodPressure.data).toBeDefined();
      expect(sleepApnea.data).toBeDefined();
      expect(biological.data).toBeDefined();
      expect(ecg.data).toBeDefined();
    });

    it('should calculate completion percentage based on completed nurse questionnaires', async () => {
      const tables = [
        'bipolar_nurse_tobacco',
        'bipolar_nurse_fagerstrom',
        'bipolar_nurse_physical_params',
        'bipolar_nurse_blood_pressure',
        'bipolar_nurse_sleep_apnea',
        'bipolar_nurse_biological_assessment',
        'bipolar_nurse_ecg',
      ];

      let completed = 0;
      for (const table of tables) {
        const { data } = await adminClient
          .from(table)
          .select('id')
          .eq('visit_id', visitId)
          .single();
        
        if (data) completed++;
      }

      // Nurse module has 7 questionnaires
      expect(completed).toBe(7);
      const percentage = Math.round((completed / 7) * 100);
      expect(percentage).toBe(100);
    });

    it('should verify visit completion status can be updated', async () => {
      // This simulates what the visit page would do after rendering all modules
      // Note: Actual completion percentage includes ALL modules (nurse, neuropsy, medical, etc.)
      // We're just testing the mechanism here
      
      const { error: updateError } = await adminClient
        .from('visits')
        .update({
          completion_percentage: 12, // 7 out of ~58 total questionnaires
          completed_questionnaires: 7,
          total_questionnaires: 58,
          completion_updated_at: new Date().toISOString(),
        })
        .eq('id', visitId);

      expect(updateError).toBeNull();

      // Verify the update
      const { data: visit } = await adminClient
        .from('visits')
        .select('completion_percentage, completed_questionnaires, total_questionnaires')
        .eq('id', visitId)
        .single();

      expect(visit?.completion_percentage).toBe(12);
      expect(visit?.completed_questionnaires).toBe(7);
      expect(visit?.total_questionnaires).toBe(58);
    });
  });

  // ==========================================================================
  // DATA INTEGRITY & VALIDATION TESTS
  // ==========================================================================

  describe('Data Integrity & Constraints', () => {
    it('should enforce unique constraint on visit_id (upsert behavior)', async () => {
      // First submission
      const responses1 = generateTobaccoResponses({ status: 'non_smoker' });
      const data1 = await saveTobaccoForTest(adminClient, {
        visit_id: visitId,
        patient_id: patientId,
        ...responses1,
      });

      expect(data1.smoking_status).toBe('non_smoker');

      // Second submission (should upsert, not error)
      const responses2 = generateTobaccoResponses({ status: 'current_smoker', packYears: 5 });
      const data2 = await saveTobaccoForTest(adminClient, {
        visit_id: visitId,
        patient_id: patientId,
        ...responses2,
      });

      expect(data2.smoking_status).toBe('current_smoker');
      expect(data2.pack_years).toBe(5);
      expect(data2.id).toBe(data1.id); // Same record, updated
    });

    it('should verify all computed fields are non-null after service layer submission', async () => {
      // Read back all data and verify computed fields exist
      const [fagerstrom, physicalParams, bloodPressure, sleepApnea, biological, ecg] = await Promise.all([
        adminClient.from('bipolar_nurse_fagerstrom').select('*').eq('visit_id', visitId).single(),
        adminClient.from('bipolar_nurse_physical_params').select('*').eq('visit_id', visitId).single(),
        adminClient.from('bipolar_nurse_blood_pressure').select('*').eq('visit_id', visitId).single(),
        adminClient.from('bipolar_nurse_sleep_apnea').select('*').eq('visit_id', visitId).single(),
        adminClient.from('bipolar_nurse_biological_assessment').select('*').eq('visit_id', visitId).single(),
        adminClient.from('bipolar_nurse_ecg').select('*').eq('visit_id', visitId).single(),
      ]);

      // Fagerstrom computed fields
      expect(fagerstrom.data?.total_score).not.toBeNull();
      expect(fagerstrom.data?.dependence_level).not.toBeNull();
      expect(fagerstrom.data?.interpretation).not.toBeNull();

      // Physical params computed fields
      expect(physicalParams.data?.bmi).not.toBeNull();

      // Blood pressure computed fields
      expect(bloodPressure.data?.tension_lying).not.toBeNull();
      expect(bloodPressure.data?.tension_standing).not.toBeNull();

      // Sleep apnea computed fields (if undiagnosed)
      if (sleepApnea.data?.diagnosed_sleep_apnea === 'no') {
        expect(sleepApnea.data?.stop_bang_score).not.toBeNull();
        expect(sleepApnea.data?.risk_level).not.toBeNull();
      }

      // Biological assessment computed fields
      if (biological.data?.cholesterol_total && biological.data?.hdl) {
        expect(biological.data?.rapport_total_hdl).not.toBeNull();
      }

      // ECG computed fields
      if (ecg.data?.ecg_performed === 'yes' && ecg.data?.qt_measured && ecg.data?.rr_measured) {
        expect(ecg.data?.qtc_calculated).not.toBeNull();
        expect(ecg.data?.interpretation).not.toBeNull();
      }
    });
  });

  // ==========================================================================
  // END-TO-END FLOW VERIFICATION
  // ==========================================================================

  describe('End-to-End Application Flow', () => {
    it('should retrieve all nurse module data as the application would', async () => {
      // This simulates what the visit page would do to display data
      const nurseData = await Promise.all([
        adminClient.from('bipolar_nurse_tobacco').select('*').eq('visit_id', visitId).single(),
        adminClient.from('bipolar_nurse_fagerstrom').select('*').eq('visit_id', visitId).single(),
        adminClient.from('bipolar_nurse_physical_params').select('*').eq('visit_id', visitId).single(),
        adminClient.from('bipolar_nurse_blood_pressure').select('*').eq('visit_id', visitId).single(),
        adminClient.from('bipolar_nurse_sleep_apnea').select('*').eq('visit_id', visitId).single(),
        adminClient.from('bipolar_nurse_biological_assessment').select('*').eq('visit_id', visitId).single(),
        adminClient.from('bipolar_nurse_ecg').select('*').eq('visit_id', visitId).single(),
      ]);

      // All questionnaires should be retrievable
      nurseData.forEach(result => {
        expect(result.error).toBeNull();
        expect(result.data).toBeDefined();
      });

      // Verify visit exists and has completion tracking
      const { data: visit } = await adminClient
        .from('visits')
        .select('id, visit_type, completion_percentage, completed_questionnaires')
        .eq('id', visitId)
        .single();

      expect(visit).toBeDefined();
      expect(visit?.visit_type).toBe('initial_evaluation');
      expect(visit?.completion_percentage).toBeGreaterThanOrEqual(0);
    });
  });
});
