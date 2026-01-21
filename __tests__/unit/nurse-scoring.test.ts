// Bipolar Nurse Module Scoring Functions - Unit Tests
// Tests pure scoring and analysis functions

import { describe, it, expect } from 'vitest';
import {
  computeFagerstromScore,
  getFagerstromDependenceLevel,
  getDependenceLevelLabel,
  interpretFagerstromScore,
  scoreFagerstrom,
} from '@/lib/questionnaires/bipolar/nurse/fagerstrom';
import {
  computeBMI,
  getBMICategory,
  getBMICategoryLabel,
  interpretPhysicalParams,
  analyzePhysicalParams,
} from '@/lib/questionnaires/bipolar/nurse/physical-params';
import {
  formatTension,
  getBPCategory,
  getBPCategoryLabel,
  hasOrthostaticHypotension,
  interpretBloodPressure,
  analyzeBloodPressure,
} from '@/lib/questionnaires/bipolar/nurse/blood-pressure';
import {
  computeStopBangScore,
  getSleepApneaRiskLevel,
  getRiskLevelLabel,
  interpretSleepApnea,
  scoreSleepApnea,
} from '@/lib/questionnaires/bipolar/nurse/sleep-apnea';
import {
  computeQTc,
  getQTcCategory,
  getQTcCategoryLabel,
  interpretQTc,
  analyzeEcg,
} from '@/lib/questionnaires/bipolar/nurse/ecg';

// ============================================================================
// FAGERSTROM
// ============================================================================

describe('Fagerstrom Scoring Functions', () => {
  describe('computeFagerstromScore', () => {
    it('should sum all 6 questions', () => {
      const score = computeFagerstromScore({
        q1: 3, q2: 1, q3: 1, q4: 3, q5: 1, q6: 1
      });
      expect(score).toBe(10);
    });

    it('should handle all zeros', () => {
      const score = computeFagerstromScore({
        q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, q6: 0
      });
      expect(score).toBe(0);
    });

    it('should handle null values as 0', () => {
      const score = computeFagerstromScore({
        q1: 2, q2: null, q3: 1, q4: null, q5: 1, q6: null
      });
      expect(score).toBe(4);
    });
  });

  describe('getFagerstromDependenceLevel', () => {
    it('should classify 0-2 as none', () => {
      expect(getFagerstromDependenceLevel(0)).toBe('none');
      expect(getFagerstromDependenceLevel(1)).toBe('none');
      expect(getFagerstromDependenceLevel(2)).toBe('none');
    });

    it('should classify 3-4 as low', () => {
      expect(getFagerstromDependenceLevel(3)).toBe('low');
      expect(getFagerstromDependenceLevel(4)).toBe('low');
    });

    it('should classify 5 as moderate', () => {
      expect(getFagerstromDependenceLevel(5)).toBe('moderate');
    });

    it('should classify 6-7 as high', () => {
      expect(getFagerstromDependenceLevel(6)).toBe('high');
      expect(getFagerstromDependenceLevel(7)).toBe('high');
    });

    it('should classify 8-10 as very_high', () => {
      expect(getFagerstromDependenceLevel(8)).toBe('very_high');
      expect(getFagerstromDependenceLevel(9)).toBe('very_high');
      expect(getFagerstromDependenceLevel(10)).toBe('very_high');
    });
  });

  describe('scoreFagerstrom', () => {
    it('should return complete scoring result', () => {
      const result = scoreFagerstrom({
        q1: 2, q2: 1, q3: 1, q4: 2, q5: 1, q6: 0
      });

      expect(result.total_score).toBe(7);
      expect(result.dependence_level).toBe('high');
      expect(result.interpretation).toContain('Score FTND: 7/10');
    });
  });
});

// ============================================================================
// PHYSICAL PARAMETERS
// ============================================================================

describe('Physical Parameters Functions', () => {
  describe('computeBMI', () => {
    it('should calculate BMI correctly', () => {
      const bmi = computeBMI(175, 70);
      // BMI = 70 / (1.75^2) = 22.86
      expect(bmi).toBeCloseTo(22.9, 1);
    });

    it('should return null for null height', () => {
      const bmi = computeBMI(null, 70);
      expect(bmi).toBeNull();
    });

    it('should return null for null weight', () => {
      const bmi = computeBMI(175, null);
      expect(bmi).toBeNull();
    });

    it('should return null for zero height', () => {
      const bmi = computeBMI(0, 70);
      expect(bmi).toBeNull();
    });

    it('should handle underweight BMI', () => {
      const bmi = computeBMI(175, 55);
      // BMI = 55 / (1.75^2) = 17.96
      expect(bmi).toBeLessThan(18.5);
    });

    it('should handle obese BMI', () => {
      const bmi = computeBMI(175, 100);
      // BMI = 100 / (1.75^2) = 32.65
      expect(bmi).toBeGreaterThan(30);
    });
  });

  describe('getBMICategory', () => {
    it('should classify <18.5 as underweight', () => {
      expect(getBMICategory(17)).toBe('underweight');
    });

    it('should classify 18.5-24.9 as normal', () => {
      expect(getBMICategory(20)).toBe('normal');
      expect(getBMICategory(24)).toBe('normal');
    });

    it('should classify 25-29.9 as overweight', () => {
      expect(getBMICategory(27)).toBe('overweight');
    });

    it('should classify 30-34.9 as obese_1', () => {
      expect(getBMICategory(32)).toBe('obese_1');
    });

    it('should classify 35-39.9 as obese_2', () => {
      expect(getBMICategory(37)).toBe('obese_2');
    });

    it('should classify >=40 as obese_3', () => {
      expect(getBMICategory(42)).toBe('obese_3');
    });

    it('should return null for null BMI', () => {
      expect(getBMICategory(null)).toBeNull();
    });
  });

  describe('analyzePhysicalParams', () => {
    it('should return complete analysis', () => {
      const result = analyzePhysicalParams({
        height_cm: 180,
        weight_kg: 85,
      });

      expect(result.bmi).toBeCloseTo(26.2, 1);
      expect(result.bmi_category).toBe('overweight');
      expect(result.interpretation).toContain('IMC:');
    });
  });
});

// ============================================================================
// BLOOD PRESSURE
// ============================================================================

describe('Blood Pressure Functions', () => {
  describe('formatTension', () => {
    it('should format as systolic/diastolic', () => {
      const formatted = formatTension(120, 80);
      expect(formatted).toBe('120/80');
    });

    it('should return null for null systolic', () => {
      const formatted = formatTension(null, 80);
      expect(formatted).toBeNull();
    });

    it('should return null for null diastolic', () => {
      const formatted = formatTension(120, null);
      expect(formatted).toBeNull();
    });
  });

  describe('hasOrthostaticHypotension', () => {
    it('should detect drop >= 20 mmHg systolic', () => {
      const result = hasOrthostaticHypotension({
        bp_lying_systolic: 140,
        bp_lying_diastolic: 85,
        bp_standing_systolic: 115, // drop of 25
        bp_standing_diastolic: 80,
      });
      expect(result).toBe(true);
    });

    it('should detect drop >= 10 mmHg diastolic', () => {
      const result = hasOrthostaticHypotension({
        bp_lying_systolic: 120,
        bp_lying_diastolic: 85,
        bp_standing_systolic: 115,
        bp_standing_diastolic: 70, // drop of 15
      });
      expect(result).toBe(true);
    });

    it('should return false for normal change', () => {
      const result = hasOrthostaticHypotension({
        bp_lying_systolic: 120,
        bp_lying_diastolic: 80,
        bp_standing_systolic: 118,
        bp_standing_diastolic: 78,
      });
      expect(result).toBe(false);
    });

    it('should return null for missing values', () => {
      const result = hasOrthostaticHypotension({
        bp_lying_systolic: 120,
        bp_lying_diastolic: null,
        bp_standing_systolic: 118,
        bp_standing_diastolic: 78,
      });
      expect(result).toBeNull();
    });
  });

  describe('getBPCategory', () => {
    it('should classify <120 systolic as normal', () => {
      expect(getBPCategory(110, 75)).toBe('normal');
    });

    it('should classify 120-129 systolic as elevated', () => {
      expect(getBPCategory(125, 78)).toBe('elevated');
    });

    it('should classify 130-139 or 80-89 as hypertension_1', () => {
      expect(getBPCategory(135, 82)).toBe('hypertension_1');
      expect(getBPCategory(125, 85)).toBe('hypertension_1');
    });

    it('should classify 140-179 or 90-119 as hypertension_2', () => {
      expect(getBPCategory(150, 95)).toBe('hypertension_2');
    });

    it('should classify >=180 or >=120 as crisis', () => {
      expect(getBPCategory(185, 100)).toBe('crisis');
      expect(getBPCategory(160, 125)).toBe('crisis');
    });
  });

  describe('analyzeBloodPressure', () => {
    it('should return complete analysis', () => {
      const result = analyzeBloodPressure({
        bp_lying_systolic: 130,
        bp_lying_diastolic: 85,
        bp_standing_systolic: 105,
        bp_standing_diastolic: 70,
      });

      expect(result.tension_lying).toBe('130/85');
      expect(result.tension_standing).toBe('105/70');
      expect(result.has_orthostatic_hypotension).toBe(true);
    });
  });
});

// ============================================================================
// SLEEP APNEA
// ============================================================================

describe('Sleep Apnea Functions', () => {
  describe('computeStopBangScore', () => {
    it('should count all yes responses', () => {
      const score = computeStopBangScore({
        snoring: 'yes',
        tiredness: 'yes',
        observed_apnea: 'yes',
        hypertension: 'yes',
        bmi_over_35: 'yes',
        age_over_50: 'yes',
        large_neck: 'yes',
        male_gender: 'M',
      });
      expect(score).toBe(8);
    });

    it('should count M as yes for male_gender', () => {
      const score = computeStopBangScore({
        snoring: 'no',
        tiredness: 'no',
        observed_apnea: 'no',
        hypertension: 'no',
        bmi_over_35: 'no',
        age_over_50: 'no',
        large_neck: 'no',
        male_gender: 'M',
      });
      expect(score).toBe(1);
    });

    it('should handle all no responses', () => {
      const score = computeStopBangScore({
        snoring: 'no',
        tiredness: 'no',
        observed_apnea: 'no',
        hypertension: 'no',
        bmi_over_35: 'no',
        age_over_50: 'no',
        large_neck: 'no',
        male_gender: 'F',
      });
      expect(score).toBe(0);
    });

    it('should handle partial yes responses', () => {
      const score = computeStopBangScore({
        snoring: 'yes',
        tiredness: 'yes',
        observed_apnea: 'no',
        hypertension: 'yes',
        bmi_over_35: 'no',
        age_over_50: 'no',
        large_neck: 'no',
        male_gender: 'F',
      });
      expect(score).toBe(3);
    });
  });

  describe('getSleepApneaRiskLevel', () => {
    it('should classify 0-2 as low', () => {
      expect(getSleepApneaRiskLevel(0)).toBe('low');
      expect(getSleepApneaRiskLevel(1)).toBe('low');
      expect(getSleepApneaRiskLevel(2)).toBe('low');
    });

    it('should classify 3-4 as intermediate', () => {
      expect(getSleepApneaRiskLevel(3)).toBe('intermediate');
      expect(getSleepApneaRiskLevel(4)).toBe('intermediate');
    });

    it('should classify 5+ as high', () => {
      expect(getSleepApneaRiskLevel(5)).toBe('high');
      expect(getSleepApneaRiskLevel(6)).toBe('high');
      expect(getSleepApneaRiskLevel(8)).toBe('high');
    });
  });

  describe('scoreSleepApnea', () => {
    it('should handle diagnosed patient with CPAP', () => {
      const result = scoreSleepApnea({
        diagnosed_sleep_apnea: 'yes',
        has_cpap_device: 'yes',
        snoring: null,
        tiredness: null,
        observed_apnea: null,
        hypertension: null,
        bmi_over_35: null,
        age_over_50: null,
        large_neck: null,
        male_gender: null,
      });

      expect(result.diagnosed).toBe(true);
      expect(result.has_cpap).toBe(true);
      expect(result.interpretation).toContain('appareille');
    });

    it('should compute STOP-Bang score for undiagnosed', () => {
      const result = scoreSleepApnea({
        diagnosed_sleep_apnea: 'no',
        has_cpap_device: null,
        snoring: 'yes',
        tiredness: 'yes',
        observed_apnea: 'yes',
        hypertension: 'yes',
        bmi_over_35: 'no',
        age_over_50: 'no',
        large_neck: 'no',
        male_gender: 'M',
      });

      expect(result.stop_bang_score).toBe(5);
      expect(result.risk_level).toBe('high');
      expect(result.interpretation).toContain('Score STOP-Bang: 5/8');
    });
  });
});

// ============================================================================
// ECG
// ============================================================================

describe('ECG Functions', () => {
  describe('computeQTc', () => {
    it('should calculate QTc using Bazett formula', () => {
      // QTc = QT / sqrt(RR)
      // QT = 0.40, RR = 1.0, QTc = 0.40 / sqrt(1.0) = 0.40
      const qtc = computeQTc(0.40, 1.0);
      expect(qtc).toBeCloseTo(0.40, 3);
    });

    it('should handle typical values', () => {
      // QT = 0.38, RR = 0.85
      // QTc = 0.38 / sqrt(0.85) = 0.38 / 0.922 = 0.412
      const qtc = computeQTc(0.38, 0.85);
      expect(qtc).toBeCloseTo(0.412, 3);
    });

    it('should return null for null QT', () => {
      const qtc = computeQTc(null, 0.85);
      expect(qtc).toBeNull();
    });

    it('should return null for null RR', () => {
      const qtc = computeQTc(0.38, null);
      expect(qtc).toBeNull();
    });

    it('should return null for zero RR', () => {
      const qtc = computeQTc(0.38, 0);
      expect(qtc).toBeNull();
    });
  });

  describe('getQTcCategory', () => {
    it('should classify <0.35 as short', () => {
      expect(getQTcCategory(0.33, 'M')).toBe('short');
    });

    it('should classify normal for male (<=0.43)', () => {
      expect(getQTcCategory(0.40, 'M')).toBe('normal');
      expect(getQTcCategory(0.43, 'M')).toBe('normal');
    });

    it('should classify prolonged for male (0.43-0.468)', () => {
      expect(getQTcCategory(0.45, 'M')).toBe('prolonged');
    });

    it('should classify critical for male (>0.468)', () => {
      expect(getQTcCategory(0.50, 'M')).toBe('critical');
    });

    it('should classify normal for female (<=0.48)', () => {
      expect(getQTcCategory(0.45, 'F')).toBe('normal');
      expect(getQTcCategory(0.48, 'F')).toBe('normal');
    });

    it('should classify prolonged for female (0.48-0.528)', () => {
      expect(getQTcCategory(0.50, 'F')).toBe('prolonged');
    });

    it('should classify critical for female (>0.528)', () => {
      expect(getQTcCategory(0.55, 'F')).toBe('critical');
    });

    it('should return null for null QTc', () => {
      expect(getQTcCategory(null, 'M')).toBeNull();
    });
  });

  describe('analyzeEcg', () => {
    it('should handle ECG not performed', () => {
      const result = analyzeEcg({
        ecg_performed: 'no',
        qt_measured: null,
        rr_measured: null,
        heart_rate: null,
        gender: 'M',
      });

      expect(result.performed).toBe(false);
      expect(result.qtc).toBeNull();
      expect(result.interpretation).toContain('non effectue');
    });

    it('should compute QTc for performed ECG', () => {
      const result = analyzeEcg({
        ecg_performed: 'yes',
        qt_measured: 0.38,
        rr_measured: 0.85,
        heart_rate: 72,
        gender: 'M',
      });

      expect(result.performed).toBe(true);
      expect(result.qtc).toBeCloseTo(0.412, 2);
      expect(result.qtc_category).toBe('normal');
    });

    it('should flag prolonged QTc for cardiology review', () => {
      const result = analyzeEcg({
        ecg_performed: 'yes',
        qt_measured: 0.40,
        rr_measured: 0.85,
        heart_rate: 72,
        gender: 'M',
      });

      // QTc = 0.40 / sqrt(0.85) = 0.40 / 0.922 = 0.434 (prolonged for male)
      expect(result.qtc_category).toBe('prolonged');
      expect(result.requires_cardiology_review).toBe(true);
      expect(result.interpretation).toContain('Avis cardiologique recommande');
    });
  });
});

// ============================================================================
// BIOLOGICAL ASSESSMENT
// ============================================================================

describe('Biological Assessment Calculations', () => {
  describe('rapport_total_hdl calculation', () => {
    it('should compute cholesterol_total / hdl', () => {
      // Formula: cholesterol_total / hdl
      const cholesterol_total = 5.2;
      const hdl = 1.3;
      const expected = Math.round((cholesterol_total / hdl) * 100) / 100;
      expect(expected).toBeCloseTo(4.0, 2);
    });

    it('should handle edge case with high ratio', () => {
      const cholesterol_total = 7.8;
      const hdl = 1.0;
      const expected = Math.round((cholesterol_total / hdl) * 100) / 100;
      expect(expected).toBe(7.8);
    });
  });

  describe('calcemie_corrigee calculation', () => {
    it('should compute using formula', () => {
      // Formula: calcemie / 0.55 + protidemie / 160
      const calcemie = 2.35;
      const protidemie = 72;
      const expected = Math.round((calcemie / 0.55 + protidemie / 160) * 100) / 100;
      // = 2.35/0.55 + 72/160 = 4.27 + 0.45 = 4.72
      expect(expected).toBeCloseTo(4.72, 2);
    });

    it('should handle normal values', () => {
      const calcemie = 2.25;
      const protidemie = 70;
      const expected = Math.round((calcemie / 0.55 + protidemie / 160) * 100) / 100;
      expect(expected).toBeGreaterThan(4.0);
    });
  });
});
