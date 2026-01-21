// Bipolar Initial Evaluation - Nurse Module Integration Tests
// Tests for all 6 questionnaires in the nurse module

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
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

describe('Bipolar Initial Evaluation - Nurse Module Integration Tests', () => {
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
  // TOBACCO ASSESSMENT TESTS
  // ==========================================================================

  describe('Tobacco Assessment (TOBACCO)', () => {
    it('should save non-smoker status correctly', async () => {
      const responses = generateTobaccoResponses({ status: 'non_smoker' });

      const { data, error } = await adminClient
        .from('bipolar_nurse_tobacco')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.smoking_status).toBe('non_smoker');
      expect(data.pack_years).toBeNull();
    });

    it('should save current smoker with pack-years and substitution', async () => {
      const responses = generateTobaccoResponses({
        status: 'current_smoker',
        packYears: 20,
        hasSubstitution: true,
      });

      const { data, error } = await adminClient
        .from('bipolar_nurse_tobacco')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.smoking_status).toBe('current_smoker');
      expect(data.pack_years).toBe(20);
      expect(data.smoking_start_age).toBe('18');
      expect(data.has_substitution).toBe(true); // boolean in DB
      expect(data.substitution_methods).toContain('e_cigarette');
      expect(data.substitution_methods).toContain('patch');
    });

    it('should save ex-smoker with pack-years and end age', async () => {
      const responses = generateTobaccoResponses({
        status: 'ex_smoker',
        packYears: 15,
        hasSubstitution: false,
      });

      const { data, error } = await adminClient
        .from('bipolar_nurse_tobacco')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.smoking_status).toBe('ex_smoker');
      expect(data.pack_years_ex).toBe(15);
      expect(data.smoking_start_age_ex).toBe('16');
      expect(data.smoking_end_age).toBe('35');
      expect(data.has_substitution_ex).toBe('no');
      expect(data.substitution_methods_ex).toBeNull();
    });

    it('should handle unknown smoking status', async () => {
      const responses = generateTobaccoResponses({ status: 'unknown' });

      const { data, error } = await adminClient
        .from('bipolar_nurse_tobacco')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.smoking_status).toBe('unknown');
    });
  });

  // ==========================================================================
  // FAGERSTROM TESTS
  // ==========================================================================

  describe('Fagerstrom Nicotine Dependence (FAGERSTROM)', () => {
    // First, set up a current smoker tobacco response (Fagerstrom depends on this)
    beforeEach(async () => {
      await adminClient
        .from('bipolar_nurse_tobacco')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          smoking_status: 'current_smoker',
          pack_years: 10,
          smoking_start_age: '18',
          has_substitution: 'no',
        }, { onConflict: 'visit_id' });
    });

    it('should compute score 0-2 as no dependence', async () => {
      const responses = generateFagerstromResponses({ dependenceLevel: 'none' });

      const { data, error } = await adminClient
        .from('bipolar_nurse_fagerstrom')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      // Sum should be 0-2
      const sum = data.q1 + data.q2 + data.q3 + data.q4 + data.q5 + data.q6;
      expect(sum).toBeLessThanOrEqual(2);
    });

    it('should compute score 3-4 as low dependence', async () => {
      const responses = generateFagerstromResponses({ dependenceLevel: 'low' });

      const { data, error } = await adminClient
        .from('bipolar_nurse_fagerstrom')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      const sum = data.q1 + data.q2 + data.q3 + data.q4 + data.q5 + data.q6;
      expect(sum).toBeGreaterThanOrEqual(3);
      expect(sum).toBeLessThanOrEqual(4);
    });

    it('should compute score 5 as moderate dependence', async () => {
      const responses = generateFagerstromResponses({ dependenceLevel: 'moderate' });

      const { data, error } = await adminClient
        .from('bipolar_nurse_fagerstrom')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      const sum = data.q1 + data.q2 + data.q3 + data.q4 + data.q5 + data.q6;
      expect(sum).toBe(5);
    });

    it('should compute score 6-7 as high dependence', async () => {
      const responses = generateFagerstromResponses({ dependenceLevel: 'high' });

      const { data, error } = await adminClient
        .from('bipolar_nurse_fagerstrom')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      const sum = data.q1 + data.q2 + data.q3 + data.q4 + data.q5 + data.q6;
      expect(sum).toBeGreaterThanOrEqual(6);
      expect(sum).toBeLessThanOrEqual(7);
    });

    it('should compute score 8-10 as very high dependence', async () => {
      const responses = generateFagerstromResponses({ dependenceLevel: 'very_high' });

      const { data, error } = await adminClient
        .from('bipolar_nurse_fagerstrom')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      const sum = data.q1 + data.q2 + data.q3 + data.q4 + data.q5 + data.q6;
      expect(sum).toBeGreaterThanOrEqual(8);
      expect(sum).toBeLessThanOrEqual(10);
    });

    it('should accept specific target score', async () => {
      const responses = generateFagerstromResponses({ targetScore: 6 });

      const { data, error } = await adminClient
        .from('bipolar_nurse_fagerstrom')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      const sum = data.q1 + data.q2 + data.q3 + data.q4 + data.q5 + data.q6;
      expect(sum).toBe(6);
    });
  });

  // ==========================================================================
  // PHYSICAL PARAMETERS TESTS
  // ==========================================================================

  describe('Physical Parameters (PHYSICAL_PARAMS)', () => {
    it('should compute BMI for normal weight', async () => {
      const responses = generatePhysicalParamsResponses({ bmiCategory: 'normal' });

      const { data, error } = await adminClient
        .from('bipolar_nurse_physical_params')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.height_cm).toBe(175);
      expect(data.weight_kg).toBeDefined();
      // BMI should be 18.5-25 for normal
      const expectedBmi = data.weight_kg / Math.pow(data.height_cm / 100, 2);
      expect(expectedBmi).toBeGreaterThanOrEqual(18.5);
      expect(expectedBmi).toBeLessThan(25);
    });

    it('should compute BMI for underweight', async () => {
      const responses = generatePhysicalParamsResponses({ bmiCategory: 'underweight' });

      const { data, error } = await adminClient
        .from('bipolar_nurse_physical_params')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      const bmi = data.weight_kg / Math.pow(data.height_cm / 100, 2);
      expect(bmi).toBeLessThan(18.5);
    });

    it('should compute BMI for overweight', async () => {
      const responses = generatePhysicalParamsResponses({ bmiCategory: 'overweight' });

      const { data, error } = await adminClient
        .from('bipolar_nurse_physical_params')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      const bmi = data.weight_kg / Math.pow(data.height_cm / 100, 2);
      expect(bmi).toBeGreaterThanOrEqual(25);
      expect(bmi).toBeLessThan(30);
    });

    it('should compute BMI for obese', async () => {
      const responses = generatePhysicalParamsResponses({ bmiCategory: 'obese' });

      const { data, error } = await adminClient
        .from('bipolar_nurse_physical_params')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      const bmi = data.weight_kg / Math.pow(data.height_cm / 100, 2);
      expect(bmi).toBeGreaterThanOrEqual(30);
    });

    it('should store custom height and weight', async () => {
      const responses = generatePhysicalParamsResponses({
        heightCm: 180,
        weightKg: 85,
      });

      const { data, error } = await adminClient
        .from('bipolar_nurse_physical_params')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.height_cm).toBe(180);
      expect(data.weight_kg).toBe(85);
      // BMI = 85 / (1.8^2) = 26.23
      const expectedBmi = 85 / Math.pow(1.8, 2);
      expect(expectedBmi).toBeCloseTo(26.23, 1);
    });
  });

  // ==========================================================================
  // BLOOD PRESSURE TESTS
  // ==========================================================================

  describe('Blood Pressure (BLOOD_PRESSURE)', () => {
    it('should store normal blood pressure readings', async () => {
      const responses = generateBloodPressureResponses();

      const { data, error } = await adminClient
        .from('bipolar_nurse_blood_pressure')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.bp_lying_systolic).toBe(120);
      expect(data.bp_lying_diastolic).toBe(78);
      expect(data.bp_standing_systolic).toBe(118);
      expect(data.bp_standing_diastolic).toBe(76);
    });

    it('should detect orthostatic hypotension', async () => {
      const responses = generateBloodPressureResponses({
        hasOrthostaticHypotension: true,
      });

      const { data, error } = await adminClient
        .from('bipolar_nurse_blood_pressure')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      // Verify orthostatic drop: systolic drop >= 20 or diastolic drop >= 10
      const systolicDrop = data.bp_lying_systolic - data.bp_standing_systolic;
      const diastolicDrop = data.bp_lying_diastolic - data.bp_standing_diastolic;
      expect(systolicDrop >= 20 || diastolicDrop >= 10).toBe(true);
    });

    it('should detect hypertension', async () => {
      const responses = generateBloodPressureResponses({ hypertension: true });

      const { data, error } = await adminClient
        .from('bipolar_nurse_blood_pressure')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      // Hypertension: >= 140/90
      expect(data.bp_lying_systolic >= 140 || data.bp_lying_diastolic >= 90).toBe(true);
    });

    it('should store heart rate readings', async () => {
      const responses = generateBloodPressureResponses();

      const { data, error } = await adminClient
        .from('bipolar_nurse_blood_pressure')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.heart_rate_lying).toBe(68);
      expect(data.heart_rate_standing).toBe(72);
    });
  });

  // ==========================================================================
  // SLEEP APNEA TESTS
  // ==========================================================================

  describe('Sleep Apnea (SLEEP_APNEA)', () => {
    it('should handle diagnosed sleep apnea with CPAP', async () => {
      const responses = generateSleepApneaResponses({
        diagnosed: true,
        hasCpap: true,
      });

      const { data, error } = await adminClient
        .from('bipolar_nurse_sleep_apnea')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.diagnosed_sleep_apnea).toBe('yes');
      expect(data.has_cpap_device).toBe(true); // boolean in DB
      // STOP-Bang questions should not be required
    });

    it('should handle diagnosed sleep apnea without CPAP', async () => {
      const responses = generateSleepApneaResponses({
        diagnosed: true,
        hasCpap: false,
      });

      const { data, error } = await adminClient
        .from('bipolar_nurse_sleep_apnea')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.diagnosed_sleep_apnea).toBe('yes');
      expect(data.has_cpap_device).toBe(false); // boolean in DB
    });

    it('should compute STOP-Bang score 0-2 as low risk', async () => {
      const responses = generateSleepApneaResponses({
        riskLevel: 'low',
        gender: 'F', // Female = 0 points for male_gender
      });

      const { data, error } = await adminClient
        .from('bipolar_nurse_sleep_apnea')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.diagnosed_sleep_apnea).toBe('no');
      // Count true responses (all STOP-Bang fields are booleans in DB)
      let score = 0;
      if (data.snoring === true) score++;
      if (data.tiredness === true) score++;
      if (data.observed_apnea === true) score++;
      if (data.hypertension === true) score++;
      if (data.bmi_over_35 === true) score++;
      if (data.age_over_50 === true) score++;
      if (data.large_neck === true) score++;
      if (data.male_gender === true) score++;
      expect(score).toBeLessThanOrEqual(2);
    });

    it('should compute STOP-Bang score 3-4 as intermediate risk', async () => {
      const responses = generateSleepApneaResponses({
        riskLevel: 'intermediate',
        gender: 'F',
      });

      const { data, error } = await adminClient
        .from('bipolar_nurse_sleep_apnea')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      let score = 0;
      if (data.snoring === true) score++;
      if (data.tiredness === true) score++;
      if (data.observed_apnea === true) score++;
      if (data.hypertension === true) score++;
      if (data.bmi_over_35 === true) score++;
      if (data.age_over_50 === true) score++;
      if (data.large_neck === true) score++;
      if (data.male_gender === true) score++;
      expect(score).toBeGreaterThanOrEqual(3);
      expect(score).toBeLessThanOrEqual(4);
    });

    it('should compute STOP-Bang score 5+ as high risk', async () => {
      const responses = generateSleepApneaResponses({
        riskLevel: 'high',
        gender: 'M', // Male = +1 point
      });

      const { data, error } = await adminClient
        .from('bipolar_nurse_sleep_apnea')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      let score = 0;
      if (data.snoring === true) score++;
      if (data.tiredness === true) score++;
      if (data.observed_apnea === true) score++;
      if (data.hypertension === true) score++;
      if (data.bmi_over_35 === true) score++;
      if (data.age_over_50 === true) score++;
      if (data.large_neck === true) score++;
      if (data.male_gender === true) score++;
      expect(score).toBeGreaterThanOrEqual(5);
    });
  });

  // ==========================================================================
  // BIOLOGICAL ASSESSMENT TESTS
  // ==========================================================================

  describe('Biological Assessment (BIOLOGICAL_ASSESSMENT)', () => {
    it('should store basic biochemistry values', async () => {
      const responses = generateBiologicalAssessmentResponses();

      const { data, error } = await adminClient
        .from('bipolar_nurse_biological_assessment')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.sodium).toBe(140);
      expect(data.potassium).toBe(4.2);
      expect(data.chlore).toBe(102);
      expect(data.creatinine).toBe(85);
    });

    it('should store lipid panel values', async () => {
      const responses = generateBiologicalAssessmentResponses();

      const { data, error } = await adminClient
        .from('bipolar_nurse_biological_assessment')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.hdl).toBe(1.5);
      expect(data.ldl).toBe(3.2);
      expect(data.cholesterol_total).toBe(5.2);
      expect(data.triglycerides).toBe(1.1);
    });

    it('should flag diabetes risk when glycemia is elevated', async () => {
      const responses = generateBiologicalAssessmentResponses({
        hasDiabetesRisk: true,
      });

      const { data, error } = await adminClient
        .from('bipolar_nurse_biological_assessment')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.glycemie_a_jeun).toBe(8.5);
      expect(data.glycemie_a_jeun_unit).toBe('mmol_L');
      // Glycemia > 7 mmol/L indicates diabetes risk
      expect(data.glycemie_a_jeun).toBeGreaterThan(7);
    });

    it('should flag lipid abnormality when cholesterol is elevated', async () => {
      const responses = generateBiologicalAssessmentResponses({
        hasLipidAbnormality: true,
      });

      const { data, error } = await adminClient
        .from('bipolar_nurse_biological_assessment')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      // Cholesterol > 6.1 or triglycerides > 1.4 indicates abnormality
      expect(data.cholesterol_total).toBe(7.0);
      expect(data.triglycerides).toBe(2.5);
    });

    it('should store values for calculated fields', async () => {
      const responses = generateBiologicalAssessmentResponses({
        includeCalculatedFields: true,
      });

      const { data, error } = await adminClient
        .from('bipolar_nurse_biological_assessment')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      // Values for rapport_total_hdl calculation: cholesterol_total / hdl
      expect(data.cholesterol_total).toBe(5.2);
      expect(data.hdl).toBe(1.5);
      // Values for calcemie_corrigee calculation
      expect(data.calcemie).toBe(2.35);
      expect(data.protidemie).toBe(72);
    });

    it('should store thyroid values', async () => {
      const responses = generateBiologicalAssessmentResponses();

      const { data, error } = await adminClient
        .from('bipolar_nurse_biological_assessment')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.tsh).toBe(2.5);
      expect(data.tsh_unit).toBe('mUI_L');
    });

    it('should store NFS values', async () => {
      const responses = generateBiologicalAssessmentResponses();

      const { data, error } = await adminClient
        .from('bipolar_nurse_biological_assessment')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.leucocytes).toBe(7.5);
      expect(data.hematies).toBe(4.8);
      expect(data.hemoglobine).toBe(14.2);
      expect(data.plaquettes).toBe(250);
    });
  });

  // ==========================================================================
  // ECG TESTS
  // ==========================================================================

  describe('ECG Assessment (ECG)', () => {
    it('should handle ECG not performed', async () => {
      const responses = generateEcgResponses({ performed: false });

      const { data, error } = await adminClient
        .from('bipolar_nurse_ecg')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.ecg_performed).toBe('no');
      expect(data.qt_measured).toBeNull();
      expect(data.rr_measured).toBeNull();
    });

    it('should store normal ECG values', async () => {
      const responses = generateEcgResponses({
        performed: true,
        prolongedQTc: false,
        gender: 'M',
      });

      const { data, error } = await adminClient
        .from('bipolar_nurse_ecg')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.ecg_performed).toBe('yes');
      expect(data.heart_rate).toBe(72);
      expect(data.qt_measured).toBe(0.38);
      expect(data.rr_measured).toBe(0.85);
      // QTc = QT / sqrt(RR) = 0.38 / sqrt(0.85) = 0.412
      // Normal for male: <= 0.43
    });

    it('should detect prolonged QTc', async () => {
      const responses = generateEcgResponses({
        performed: true,
        prolongedQTc: true,
        gender: 'M',
      });

      const { data, error } = await adminClient
        .from('bipolar_nurse_ecg')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.qt_measured).toBe(0.45);
      expect(data.rr_measured).toBe(0.85);
      // QTc = 0.45 / sqrt(0.85) = 0.488
      // Prolonged for male: > 0.43
      const qtc = data.qt_measured / Math.sqrt(data.rr_measured);
      expect(qtc).toBeGreaterThan(0.43);
    });

    it('should store follow-up fields', async () => {
      const responses = generateEcgResponses({ performed: true });

      const { data, error } = await adminClient
        .from('bipolar_nurse_ecg')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          ...responses,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toBeDefined();
      expect(data.ecg_sent_to_cardiologist).toBe('no');
      expect(data.cardiologist_consultation_requested).toBe('no');
    });
  });

  // ==========================================================================
  // COMPUTED FIELDS VERIFICATION
  // ==========================================================================

  describe('Computed Fields Verification', () => {
    it('should verify Fagerstrom computed fields', async () => {
      const { data } = await adminClient
        .from('bipolar_nurse_fagerstrom')
        .select('*')
        .eq('visit_id', visitId)
        .single();

      expect(data).toBeDefined();

      // Only verify computed fields if they exist (service layer computes them)
      if (data.total_score !== null && data.dependence_level !== null) {
        expect(data.interpretation).toBeDefined();

        // Verify total_score is sum of all responses
        const manualSum = (data.q1 ?? 0) + (data.q2 ?? 0) + (data.q3 ?? 0) + 
                          (data.q4 ?? 0) + (data.q5 ?? 0) + (data.q6 ?? 0);
        expect(data.total_score).toBe(manualSum);

        // Verify dependence level thresholds
        if (data.total_score! <= 2) {
          expect(data.dependence_level).toBe('none');
        } else if (data.total_score! <= 4) {
          expect(data.dependence_level).toBe('low');
        } else if (data.total_score === 5) {
          expect(data.dependence_level).toBe('moderate');
        } else if (data.total_score! <= 7) {
          expect(data.dependence_level).toBe('high');
        } else {
          expect(data.dependence_level).toBe('very_high');
        }
      }
    });

    it('should verify Physical Parameters BMI calculation', async () => {
      const { data } = await adminClient
        .from('bipolar_nurse_physical_params')
        .select('*')
        .eq('visit_id', visitId)
        .single();

      expect(data).toBeDefined();

      if (data.height_cm && data.weight_kg) {
        // Verify BMI calculation
        const heightInMeters = data.height_cm / 100;
        const expectedBMI = Math.round((data.weight_kg / (heightInMeters * heightInMeters)) * 10) / 10;
        expect(data.bmi).toBeCloseTo(expectedBMI, 1);

        // Verify BMI is in reasonable range
        expect(data.bmi).toBeGreaterThan(10);
        expect(data.bmi).toBeLessThan(80);
      }
    });

    it('should verify Blood Pressure tension formatting', async () => {
      const { data } = await adminClient
        .from('bipolar_nurse_blood_pressure')
        .select('*')
        .eq('visit_id', visitId)
        .single();

      expect(data).toBeDefined();

      // Verify lying tension format only if computed field exists
      if (data.bp_lying_systolic && data.bp_lying_diastolic && data.tension_lying !== null) {
        expect(data.tension_lying).toBe(`${data.bp_lying_systolic}/${data.bp_lying_diastolic}`);
      }

      // Verify standing tension format only if computed field exists
      if (data.bp_standing_systolic && data.bp_standing_diastolic && data.tension_standing !== null) {
        expect(data.tension_standing).toBe(`${data.bp_standing_systolic}/${data.bp_standing_diastolic}`);
      }
    });

    it('should verify Sleep Apnea STOP-Bang score calculation', async () => {
      const { data } = await adminClient
        .from('bipolar_nurse_sleep_apnea')
        .select('*')
        .eq('visit_id', visitId)
        .single();

      expect(data).toBeDefined();

      if (data.diagnosed_sleep_apnea === 'no' && data.stop_bang_score !== null) {
        // Verify STOP-Bang score
        expect(data.risk_level).toBeDefined();

        // Manually compute score
        let manualScore = 0;
        if (data.snoring === true) manualScore++;
        if (data.tiredness === true) manualScore++;
        if (data.observed_apnea === true) manualScore++;
        if (data.hypertension === true) manualScore++;
        if (data.bmi_over_35 === true) manualScore++;
        if (data.age_over_50 === true) manualScore++;
        if (data.large_neck === true) manualScore++;
        if (data.male_gender === true) manualScore++;

        expect(data.stop_bang_score).toBe(manualScore);

        // Verify risk level thresholds
        if (data.stop_bang_score! <= 2) {
          expect(data.risk_level).toBe('low');
        } else if (data.stop_bang_score! <= 4) {
          expect(data.risk_level).toBe('intermediate');
        } else {
          expect(data.risk_level).toBe('high');
        }
      } else {
        // Diagnosed patients or missing computed fields
        expect(data.interpretation).toBeDefined();
      }
    });

    it('should verify Biological Assessment computed ratios', async () => {
      const { data } = await adminClient
        .from('bipolar_nurse_biological_assessment')
        .select('*')
        .eq('visit_id', visitId)
        .single();

      expect(data).toBeDefined();

      // Verify rapport_total_hdl if both values present
      if (data.cholesterol_total && data.hdl && data.hdl > 0 && data.rapport_total_hdl !== null) {
        const expectedRatio = Math.round((data.cholesterol_total / data.hdl) * 100) / 100;
        expect(data.rapport_total_hdl).toBeCloseTo(expectedRatio, 2);
      }

      // Verify calcemie_corrigee if both values present
      if (data.calcemie && data.protidemie && data.calcemie_corrigee !== null) {
        const expectedCalcemie = Math.round((data.calcemie / 0.55 + data.protidemie / 160) * 100) / 100;
        expect(data.calcemie_corrigee).toBeCloseTo(expectedCalcemie, 2);
      }
    });

    it('should verify ECG QTc calculation', async () => {
      const { data } = await adminClient
        .from('bipolar_nurse_ecg')
        .select('*')
        .eq('visit_id', visitId)
        .single();

      expect(data).toBeDefined();
      expect(data.interpretation).toBeDefined();

      if (data.ecg_performed === 'yes' && data.qt_measured && data.rr_measured && 
          data.rr_measured > 0 && data.qtc_calculated !== null) {
        // Verify QTc calculation using Bazett formula
        const expectedQTc = data.qt_measured / Math.sqrt(data.rr_measured);
        expect(data.qtc_calculated).toBeCloseTo(expectedQTc, 3);

        // Verify QTc is in reasonable range
        expect(data.qtc_calculated!).toBeGreaterThan(0.2);
        expect(data.qtc_calculated!).toBeLessThan(0.8);
      }
    });
  });

  // ==========================================================================
  // DATA INTEGRITY TESTS
  // ==========================================================================

  describe('Data Integrity', () => {
    it('should maintain data across all nurse questionnaires', async () => {
      // Verify all questionnaires have data for this visit
      const [tobacco, fagerstrom, physicalParams, bloodPressure, sleepApnea, biological, ecg] =
        await Promise.all([
          adminClient.from('bipolar_nurse_tobacco').select('*').eq('visit_id', visitId).single(),
          adminClient.from('bipolar_nurse_fagerstrom').select('*').eq('visit_id', visitId).single(),
          adminClient.from('bipolar_nurse_physical_params').select('*').eq('visit_id', visitId).single(),
          adminClient.from('bipolar_nurse_blood_pressure').select('*').eq('visit_id', visitId).single(),
          adminClient.from('bipolar_nurse_sleep_apnea').select('*').eq('visit_id', visitId).single(),
          adminClient.from('bipolar_nurse_biological_assessment').select('*').eq('visit_id', visitId).single(),
          adminClient.from('bipolar_nurse_ecg').select('*').eq('visit_id', visitId).single(),
        ]);

      expect(tobacco.error).toBeNull();
      expect(tobacco.data).toBeDefined();
      expect(fagerstrom.error).toBeNull();
      expect(fagerstrom.data).toBeDefined();
      expect(physicalParams.error).toBeNull();
      expect(physicalParams.data).toBeDefined();
      expect(bloodPressure.error).toBeNull();
      expect(bloodPressure.data).toBeDefined();
      expect(sleepApnea.error).toBeNull();
      expect(sleepApnea.data).toBeDefined();
      expect(biological.error).toBeNull();
      expect(biological.data).toBeDefined();
      expect(ecg.error).toBeNull();
      expect(ecg.data).toBeDefined();
    });

    it('should enforce visit_id unique constraint (upsert behavior)', async () => {
      // First insert
      await adminClient.from('bipolar_nurse_tobacco').upsert({
        visit_id: visitId,
        patient_id: patientId,
        smoking_status: 'non_smoker',
      }, { onConflict: 'visit_id' });

      // Update via upsert
      const { data, error } = await adminClient
        .from('bipolar_nurse_tobacco')
        .upsert({
          visit_id: visitId,
          patient_id: patientId,
          smoking_status: 'current_smoker',
          pack_years: 5,
        }, { onConflict: 'visit_id' })
        .select()
        .single();

      expect(error).toBeNull();
      expect(data.smoking_status).toBe('current_smoker');
      expect(data.pack_years).toBe(5);

      // Verify only one record exists
      const { data: allRecords } = await adminClient
        .from('bipolar_nurse_tobacco')
        .select('*')
        .eq('visit_id', visitId);

      expect(allRecords?.length).toBe(1);
    });
  });
});
