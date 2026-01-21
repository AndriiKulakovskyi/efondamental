// Bipolar Screening Scoring Functions - Unit Tests
// Tests pure scoring and interpretation functions

import { describe, it, expect } from 'vitest';
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
// ASRM (Altman Self-Rating Mania Scale)
// ============================================================================

describe('ASRM Scoring Functions', () => {
  describe('computeAsrmScore', () => {
    it('should compute score as sum of q1-q5', () => {
      const score = computeAsrmScore({
        q1: 0,
        q2: 1,
        q3: 2,
        q4: 3,
        q5: 4,
      });
      expect(score).toBe(10);
    });

    it('should handle all zeros', () => {
      const score = computeAsrmScore({
        q1: 0,
        q2: 0,
        q3: 0,
        q4: 0,
        q5: 0,
      });
      expect(score).toBe(0);
    });

    it('should handle maximum score', () => {
      const score = computeAsrmScore({
        q1: 4,
        q2: 4,
        q3: 4,
        q4: 4,
        q5: 4,
      });
      expect(score).toBe(20);
    });
  });

  describe('interpretAsrmScore', () => {
    it('should interpret score below cutoff as non-suggestive', () => {
      const interpretation = interpretAsrmScore(5);
      expect(interpretation).toContain('non suggestif');
      expect(interpretation).toContain('score < 6');
    });

    it('should interpret score at cutoff as suggestive', () => {
      const interpretation = interpretAsrmScore(ASRM_CUTOFF);
      expect(interpretation).toContain('suggestif');
      expect(interpretation).toContain('score >= 6');
    });

    it('should interpret score above cutoff as suggestive', () => {
      const interpretation = interpretAsrmScore(15);
      expect(interpretation).toContain('suggestif');
      expect(interpretation).toContain('maniaque/hypomaniaque');
    });
  });

  describe('scoreAsrm', () => {
    it('should return complete scoring result', () => {
      const result = scoreAsrm({
        q1: 1,
        q2: 2,
        q3: 1,
        q4: 2,
        q5: 1,
      });
      
      expect(result.total_score).toBe(7);
      expect(result.is_positive).toBe(true);
      expect(result.interpretation).toContain('suggestif');
    });
  });
});

// ============================================================================
// QIDS-SR16 (Quick Inventory of Depressive Symptomatology)
// ============================================================================

describe('QIDS-SR16 Scoring Functions', () => {
  describe('computeQidsScore', () => {
    it('should use domain MAX for sleep questions', () => {
      const score = computeQidsScore({
        q1: 3, q2: 1, q3: 0, q4: 0, // sleep domain, max = 3
        q5: 0,
        q6: 0, q7: 0, q8: 0, q9: 0, // appetite/weight domain, max = 0
        q10: 0, q11: 0, q12: 0, q13: 0, q14: 0,
        q15: 0, q16: 0, // psychomotor domain, max = 0
      });
      expect(score).toBe(3); // Only sleep domain contributes
    });

    it('should use domain MAX for appetite/weight questions', () => {
      const score = computeQidsScore({
        q1: 0, q2: 0, q3: 0, q4: 0,
        q5: 0,
        q6: 2, q7: 3, q8: 1, q9: 0, // max = 3
        q10: 0, q11: 0, q12: 0, q13: 0, q14: 0,
        q15: 0, q16: 0,
      });
      expect(score).toBe(3);
    });

    it('should use domain MAX for psychomotor questions', () => {
      const score = computeQidsScore({
        q1: 0, q2: 0, q3: 0, q4: 0,
        q5: 0,
        q6: 0, q7: 0, q8: 0, q9: 0,
        q10: 0, q11: 0, q12: 0, q13: 0, q14: 0,
        q15: 2, q16: 3, // max = 3
      });
      expect(score).toBe(3);
    });

    it('should sum all components correctly', () => {
      const score = computeQidsScore({
        q1: 1, q2: 2, q3: 1, q4: 0, // max = 2
        q5: 2,
        q6: 1, q7: 2, q8: 1, q9: 0, // max = 2
        q10: 2, q11: 2, q12: 2, q13: 2, q14: 2,
        q15: 1, q16: 2, // max = 2
      });
      // max(1,2,1,0) + 2 + max(1,2,1,0) + 2 + 2 + 2 + 2 + 2 + max(1,2)
      // = 2 + 2 + 2 + 2 + 2 + 2 + 2 + 2 + 2 = 18
      expect(score).toBe(18);
    });
  });

  describe('interpretQidsScore', () => {
    it('should interpret score <=5 as none', () => {
      expect(interpretQidsScore(5)).toBe('Pas de depression');
    });

    it('should interpret score 6-10 as mild', () => {
      expect(interpretQidsScore(8)).toBe('Depression legere');
    });

    it('should interpret score 11-15 as moderate', () => {
      expect(interpretQidsScore(13)).toBe('Depression moderee');
    });

    it('should interpret score 16-20 as severe', () => {
      expect(interpretQidsScore(18)).toBe('Depression severe');
    });

    it('should interpret score >20 as very severe', () => {
      expect(interpretQidsScore(24)).toBe('Depression tres severe');
    });

    it('should handle boundary values correctly', () => {
      expect(interpretQidsScore(10)).toBe('Depression legere');
      expect(interpretQidsScore(11)).toBe('Depression moderee');
      expect(interpretQidsScore(15)).toBe('Depression moderee');
      expect(interpretQidsScore(16)).toBe('Depression severe');
      expect(interpretQidsScore(20)).toBe('Depression severe');
      expect(interpretQidsScore(21)).toBe('Depression tres severe');
    });
  });

  describe('scoreQids', () => {
    it('should return complete scoring result', () => {
      const result = scoreQids({
        q1: 2, q2: 1, q3: 0, q4: 0,
        q5: 2,
        q6: 1, q7: 1, q8: 0, q9: 0,
        q10: 2, q11: 2, q12: 2, q13: 2, q14: 2,
        q15: 1, q16: 1,
      });

      // max(2,1,0,0) + 2 + max(1,1,0,0) + 2 + 2 + 2 + 2 + 2 + max(1,1)
      // = 2 + 2 + 1 + 2 + 2 + 2 + 2 + 2 + 1 = 16
      expect(result.total_score).toBe(16);
      expect(result.severity).toBe('severe');
      expect(result.interpretation).toBe('Depression severe');
    });
  });
});

// ============================================================================
// MDQ (Mood Disorder Questionnaire)
// ============================================================================

describe('MDQ Scoring Functions', () => {
  describe('computeMdqQ1Score', () => {
    it('should sum all 13 q1 items', () => {
      const score = computeMdqQ1Score({
        q1_1: 1, q1_2: 1, q1_3: 1, q1_4: 1, q1_5: 1,
        q1_6: 1, q1_7: 1, q1_8: 0, q1_9: 0, q1_10: 0,
        q1_11: 0, q1_12: 0, q1_13: 0,
      });
      expect(score).toBe(7);
    });

    it('should handle all zeros', () => {
      const score = computeMdqQ1Score({
        q1_1: 0, q1_2: 0, q1_3: 0, q1_4: 0, q1_5: 0,
        q1_6: 0, q1_7: 0, q1_8: 0, q1_9: 0, q1_10: 0,
        q1_11: 0, q1_12: 0, q1_13: 0,
      });
      expect(score).toBe(0);
    });

    it('should handle all ones', () => {
      const score = computeMdqQ1Score({
        q1_1: 1, q1_2: 1, q1_3: 1, q1_4: 1, q1_5: 1,
        q1_6: 1, q1_7: 1, q1_8: 1, q1_9: 1, q1_10: 1,
        q1_11: 1, q1_12: 1, q1_13: 1,
      });
      expect(score).toBe(13);
    });
  });

  describe('isMdqPositive', () => {
    it('should return true when all criteria met', () => {
      const result = isMdqPositive({
        q1_1: 1, q1_2: 1, q1_3: 1, q1_4: 1, q1_5: 1,
        q1_6: 1, q1_7: 1, q1_8: 0, q1_9: 0, q1_10: 0,
        q1_11: 0, q1_12: 0, q1_13: 0,
        q2: 1,
        q3: 2,
      });
      expect(result).toBe(true);
    });

    it('should return false when q1_score < 7', () => {
      const result = isMdqPositive({
        q1_1: 1, q1_2: 1, q1_3: 1, q1_4: 1, q1_5: 1,
        q1_6: 0, q1_7: 0, q1_8: 0, q1_9: 0, q1_10: 0,
        q1_11: 0, q1_12: 0, q1_13: 0,
        q2: 1,
        q3: 2,
      });
      expect(result).toBe(false);
    });

    it('should return false when q2 != 1', () => {
      const result = isMdqPositive({
        q1_1: 1, q1_2: 1, q1_3: 1, q1_4: 1, q1_5: 1,
        q1_6: 1, q1_7: 1, q1_8: 0, q1_9: 0, q1_10: 0,
        q1_11: 0, q1_12: 0, q1_13: 0,
        q2: 0,
        q3: 2,
      });
      expect(result).toBe(false);
    });

    it('should return false when q3 < 2', () => {
      const result = isMdqPositive({
        q1_1: 1, q1_2: 1, q1_3: 1, q1_4: 1, q1_5: 1,
        q1_6: 1, q1_7: 1, q1_8: 0, q1_9: 0, q1_10: 0,
        q1_11: 0, q1_12: 0, q1_13: 0,
        q2: 1,
        q3: 1,
      });
      expect(result).toBe(false);
    });

    it('should return true at exact thresholds', () => {
      expect(isMdqPositive({
        q1_1: 1, q1_2: 1, q1_3: 1, q1_4: 1, q1_5: 1,
        q1_6: 1, q1_7: 1, q1_8: 0, q1_9: 0, q1_10: 0,
        q1_11: 0, q1_12: 0, q1_13: 0,
        q2: 1,
        q3: 2,
      })).toBe(true);
      expect(isMdqPositive({
        q1_1: 1, q1_2: 1, q1_3: 1, q1_4: 1, q1_5: 1,
        q1_6: 1, q1_7: 1, q1_8: 1, q1_9: 0, q1_10: 0,
        q1_11: 0, q1_12: 0, q1_13: 0,
        q2: 1,
        q3: 3,
      })).toBe(true);
    });
  });

  describe('interpretMdqScore', () => {
    it('should interpret positive screening correctly', () => {
      const interpretation = interpretMdqScore({
        q1_1: 1, q1_2: 1, q1_3: 1, q1_4: 1, q1_5: 1,
        q1_6: 1, q1_7: 1, q1_8: 0, q1_9: 0, q1_10: 0,
        q1_11: 0, q1_12: 0, q1_13: 0,
        q2: 1,
        q3: 2,
      });
      expect(interpretation).toContain('Positif');
      expect(interpretation).toContain('Depistage positif');
    });

    it('should interpret negative screening correctly', () => {
      const interpretation = interpretMdqScore({
        q1_1: 1, q1_2: 1, q1_3: 1, q1_4: 0, q1_5: 0,
        q1_6: 0, q1_7: 0, q1_8: 0, q1_9: 0, q1_10: 0,
        q1_11: 0, q1_12: 0, q1_13: 0,
        q2: 1,
        q3: 2,
      });
      expect(interpretation).toContain('Negatif');
      expect(interpretation).toContain('Depistage negatif');
    });
  });

  describe('scoreMdq', () => {
    it('should return complete scoring result for positive screen', () => {
      const result = scoreMdq({
        q1_1: 1, q1_2: 1, q1_3: 1, q1_4: 1, q1_5: 1,
        q1_6: 1, q1_7: 1, q1_8: 0, q1_9: 0, q1_10: 0,
        q1_11: 0, q1_12: 0, q1_13: 0,
        q2: 1,
        q3: 2,
      });

      expect(result.q1_score).toBe(7);
      expect(result.is_positive).toBe(true);
      expect(result.interpretation).toContain('Positif');
    });

    it('should return complete scoring result for negative screen', () => {
      const result = scoreMdq({
        q1_1: 1, q1_2: 1, q1_3: 0, q1_4: 0, q1_5: 0,
        q1_6: 0, q1_7: 0, q1_8: 0, q1_9: 0, q1_10: 0,
        q1_11: 0, q1_12: 0, q1_13: 0,
        q2: 0,
        q3: 1,
      });

      expect(result.q1_score).toBe(2);
      expect(result.is_positive).toBe(false);
      expect(result.interpretation).toContain('Negatif');
    });
  });
});

// ============================================================================
// Orientation (Eligibility)
// ============================================================================

describe('Orientation Eligibility Functions', () => {
  describe('checkOrientationEligibility', () => {
    it('should return eligible when all criteria met', () => {
      const result = checkOrientationEligibility({
        trouble_bipolaire_ou_suspicion: 'oui',
        etat_thymique_compatible: 'oui',
        prise_en_charge_100_ou_accord: 'oui',
        accord_evaluation_centre_expert: 'oui',
        accord_transmission_cr: 'oui',
      });

      expect(result.is_eligible).toBe(true);
      expect(result.missing_criteria).toEqual([]);
    });

    it('should identify missing criteria', () => {
      const result = checkOrientationEligibility({
        trouble_bipolaire_ou_suspicion: 'oui',
        etat_thymique_compatible: 'non',
        prise_en_charge_100_ou_accord: 'oui',
        accord_evaluation_centre_expert: 'oui',
        accord_transmission_cr: 'oui',
      });

      expect(result.is_eligible).toBe(false);
      expect(result.missing_criteria).toContain('Etat thymique compatible');
    });

    it('should list all missing criteria', () => {
      const result = checkOrientationEligibility({
        trouble_bipolaire_ou_suspicion: 'non',
        etat_thymique_compatible: 'non',
        prise_en_charge_100_ou_accord: 'non',
        accord_evaluation_centre_expert: 'non',
        accord_transmission_cr: 'non',
      });

      expect(result.is_eligible).toBe(false);
      expect(result.missing_criteria).toHaveLength(5);
    });
  });

  describe('isEligibleForExpertCenter', () => {
    it('should return true when all criteria are oui', () => {
      const result = isEligibleForExpertCenter({
        trouble_bipolaire_ou_suspicion: 'oui',
        etat_thymique_compatible: 'oui',
        prise_en_charge_100_ou_accord: 'oui',
        accord_evaluation_centre_expert: 'oui',
        accord_transmission_cr: 'oui',
      });

      expect(result).toBe(true);
    });

    it('should return false when any criterion is non', () => {
      const result = isEligibleForExpertCenter({
        trouble_bipolaire_ou_suspicion: 'oui',
        etat_thymique_compatible: 'oui',
        prise_en_charge_100_ou_accord: 'non',
        accord_evaluation_centre_expert: 'oui',
        accord_transmission_cr: 'oui',
      });

      expect(result).toBe(false);
    });

    it('should return false when multiple criteria are non', () => {
      const result = isEligibleForExpertCenter({
        trouble_bipolaire_ou_suspicion: 'non',
        etat_thymique_compatible: 'non',
        prise_en_charge_100_ou_accord: 'oui',
        accord_evaluation_centre_expert: 'oui',
        accord_transmission_cr: 'oui',
      });

      expect(result).toBe(false);
    });
  });
});
