import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

import {
  getComputedFields,
  normalizeQuestionnaireCode,
} from '@/lib/services/import-scoring.service';

type ImportQuestionnaireResponse = {
  code: string;
  responses: Record<string, any>;
};

type ImportVisit = {
  visit_type: string;
  questionnaires?: ImportQuestionnaireResponse[];
};

type ImportPatient = {
  medical_record_number: string;
  visits?: ImportVisit[];
};

const MOCK_PATH = path.resolve(process.cwd(), 'mock-import-data-bipolar.json');

const SCREENING_REQUIRED = [
  'ASRM',
  'QIDS_SR16',
  'MDQ',
  'BIPOLAR_DIAGNOSTIC',
  'BIPOLAR_ORIENTATION',
];

const INITIAL_REQUIRED = [
  'TOBACCO',
  'FAGERSTROM',
  'PHYSICAL_PARAMS',
  'BLOOD_PRESSURE',
  'ECG',
  'SLEEP_APNEA',
  'BIOLOGICAL_ASSESSMENT',
  'MADRS',
  'YMRS',
  'CGI',
  'EGF',
  'ALDA',
  'ETAT_PATIENT',
  'FAST',
  'EQ5D5L',
  'PRISE_M',
  'STAI_YA',
  'MARS',
  'MATHYS',
  'PSQI',
  'EPWORTH',
  'QIDS_SR16',
  'ASRS',
  'CTQ',
  'BIS10',
  'ALS18',
  'AIM',
  'WURS25',
  'AQ12',
  'CSM',
  'CTI',
  'SOCIAL',
  'DSM5_HUMEUR',
  'DSM5_PSYCHOTIC',
  'DSM5_COMORBID',
  'DIVA',
  'FAMILY_HISTORY',
  'CSSRS',
  'ISA',
  'SIS',
  'SUICIDE_HISTORY',
  'PERINATALITE',
  'PATHO_NEURO',
  'PATHO_CARDIO',
  'PATHO_ENDOC',
  'PATHO_DERMATO',
  'PATHO_URINAIRE',
  'ANTECEDENTS_GYNECO',
  'PATHO_HEPATO_GASTRO',
  'PATHO_ALLERGIQUE',
  'AUTRES_PATHO',
  'CVLT',
  'TMT',
  'STROOP',
  'FLUENCES_VERBALES',
  'MEM3_SPATIAL',
  'WAIS4_CRITERIA',
  'WAIS4_LEARNING',
  'WAIS4_MATRICES',
  'WAIS4_CODE',
  'WAIS4_DIGIT_SPAN',
  'WAIS4_SIMILITUDES',
  'WAIS3_CRITERIA',
  'WAIS3_LEARNING',
  'WAIS3_VOCABULAIRE',
  'WAIS3_MATRICES',
  'WAIS3_CODE_SYMBOLES',
  'WAIS3_DIGIT_SPAN',
  'WAIS3_CPT2',
  'COBRA',
  'CPT3',
  'SCIP',
  'TEST_COMMISSIONS',
  'ASRM',
];

const BIANNUAL_REQUIRED = [
  'TOBACCO',
  'FAGERSTROM',
  'PHYSICAL_PARAMS',
  'BLOOD_PRESSURE',
  'SLEEP_APNEA',
  'BIOLOGICAL_ASSESSMENT',
  'MADRS',
  'YMRS',
  'CGI',
  'EGF',
  'ALDA',
  'ETAT_PATIENT',
  'FAST',
  'HUMEUR_ACTUELS',
  'HUMEUR_DEPUIS_VISITE',
  'PSYCHOTIQUES',
  'ISA_FOLLOWUP',
  'SUICIDE_BEHAVIOR_FOLLOWUP',
  'CSSRS',
  'SUIVI_RECOMMANDATIONS',
  'RECOURS_AUX_SOINS',
  'TRAITEMENT_NON_PHARMACOLOGIQUE',
  'ARRETS_DE_TRAVAIL',
  'SOMATIQUE_CONTRACEPTIF',
  'STATUT_PROFESSIONNEL',
];

const ANNUAL_REQUIRED = [
  // Nurse (7)
  'TOBACCO',
  'FAGERSTROM',
  'PHYSICAL_PARAMS',
  'BLOOD_PRESSURE',
  'ECG',
  'SLEEP_APNEA',
  'BIOLOGICAL_ASSESSMENT',
  // Thymic (7)
  'MADRS',
  'ALDA',
  'YMRS',
  'FAST',
  'CGI',
  'EGF',
  'ETAT_PATIENT',
  // Medical
  'DSM5_HUMEUR',
  'DSM5_PSYCHOTIC',
  'DSM5_COMORBID',
  'DIVA',
  'FAMILY_HISTORY',
  'CSSRS',
  'ISA_FOLLOWUP',
  'SIS',
  'SUICIDE_HISTORY',
  'PERINATALITE',
  'PATHO_NEURO',
  'PATHO_CARDIO',
  'PATHO_ENDOC',
  'PATHO_DERMATO',
  'PATHO_URINAIRE',
  'ANTECEDENTS_GYNECO',
  'PATHO_HEPATO_GASTRO',
  'PATHO_ALLERGIQUE',
  'AUTRES_PATHO',
  'SUIVI_RECOMMANDATIONS',
  'RECOURS_AUX_SOINS',
  'TRAITEMENT_NON_PHARMACOLOGIQUE',
  'ARRETS_DE_TRAVAIL',
  'SOMATIQUE_CONTRACEPTIF',
  'STATUT_PROFESSIONNEL',
  // Neuropsych
  'CVLT',
  'TMT',
  'STROOP',
  'FLUENCES_VERBALES',
  'MEM3_SPATIAL',
  'WAIS3_CRITERIA',
  'WAIS3_LEARNING',
  'WAIS3_VOCABULAIRE',
  'WAIS3_MATRICES',
  'WAIS3_CODE_SYMBOLES',
  'WAIS3_DIGIT_SPAN',
  'WAIS3_CPT2',
  'WAIS4_CRITERIA',
  'WAIS4_LEARNING',
  'WAIS4_MATRICES',
  'WAIS4_CODE',
  'WAIS4_DIGIT_SPAN',
  'WAIS4_SIMILITUDES',
  'COBRA',
  'CPT3',
  'TEST_COMMISSIONS',
  'SCIP',
  // Auto ETAT
  'EQ5D5L',
  'PRISE_M',
  'STAI_YA',
  'MARS',
  'MATHYS',
  'ASRM',
  'QIDS_SR16',
  'PSQI',
  'EPWORTH',
];

const YES_NO_FR_VALUES = new Set(['oui', 'non', 'yes', 'no']);
const SLEEP_APNEA_YES_NO_FR_FIELDS = [
  'has_cpap_device',
  'snoring',
  'tiredness',
  'observed_apnea',
  'hypertension',
  'bmi_over_35',
  'age_over_50',
  'large_neck',
  'male_gender',
];

describe('mock-import-data-bipolar.json', () => {
  it('should exist and be valid JSON array', () => {
    const raw = fs.readFileSync(MOCK_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    expect(Array.isArray(parsed)).toBe(true);
  });

  it('should include required questionnaire sets per visit type', () => {
    const patients = JSON.parse(fs.readFileSync(MOCK_PATH, 'utf8')) as ImportPatient[];

    for (const p of patients) {
      const visits = p.visits || [];
      const screeningVisits = visits.filter(v => v.visit_type === 'screening');
      const initialVisits = visits.filter(v => v.visit_type === 'initial_evaluation');
      const biannualVisits = visits.filter(v => v.visit_type === 'biannual_followup');
      const annualVisits = visits.filter(v => v.visit_type === 'annual_evaluation');

      expect(screeningVisits.length).toBeGreaterThan(0);
      expect(initialVisits.length).toBeGreaterThan(0);
      expect(biannualVisits.length).toBeGreaterThan(0);
      expect(annualVisits.length).toBeGreaterThan(0);

      for (const v of screeningVisits) {
        const codes = (v.questionnaires || []).map(q => q.code);
        expect(new Set(codes)).toEqual(new Set(SCREENING_REQUIRED));
      }

      for (const v of initialVisits) {
        const codes = new Set((v.questionnaires || []).map(q => q.code));
        for (const req of INITIAL_REQUIRED) {
          expect(codes.has(req)).toBe(true);
        }
      }

      for (const v of biannualVisits) {
        const codes = new Set((v.questionnaires || []).map(q => q.code));
        for (const req of BIANNUAL_REQUIRED) {
          expect(codes.has(req)).toBe(true);
        }
      }

      for (const v of annualVisits) {
        const codes = new Set((v.questionnaires || []).map(q => q.code));
        for (const req of ANNUAL_REQUIRED) {
          expect(codes.has(req)).toBe(true);
        }
      }
    }
  });

  it('should not contain computed fields in any questionnaire responses', () => {
    const patients = JSON.parse(fs.readFileSync(MOCK_PATH, 'utf8')) as ImportPatient[];

    for (const p of patients) {
      for (const v of p.visits || []) {
        for (const q of v.questionnaires || []) {
          const code = normalizeQuestionnaireCode(q.code);
          const computed = new Set(getComputedFields(code));
          for (const key of Object.keys(q.responses || {})) {
            expect(computed.has(key)).toBe(false);
          }
        }
      }
    }
  });

  it('should use DB-native enum values for known yes_no_fr fields', () => {
    const patients = JSON.parse(fs.readFileSync(MOCK_PATH, 'utf8')) as ImportPatient[];

    for (const p of patients) {
      for (const v of p.visits || []) {
        for (const q of v.questionnaires || []) {
          const code = normalizeQuestionnaireCode(q.code);

          if (code === 'SLEEP_APNEA') {
            for (const f of SLEEP_APNEA_YES_NO_FR_FIELDS) {
              const val = q.responses?.[f];
              if (val === undefined || val === null) continue;
              expect(typeof val).toBe('string');
              expect(YES_NO_FR_VALUES.has(val)).toBe(true);
            }
          }

          if (code === 'TOBACCO') {
            const val = q.responses?.has_substitution;
            if (val === undefined || val === null) continue;
            expect(typeof val).toBe('string');
            expect(YES_NO_FR_VALUES.has(val)).toBe(true);
          }
        }
      }
    }
  });
});

