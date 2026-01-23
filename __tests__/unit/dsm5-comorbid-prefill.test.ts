import { describe, it, expect } from 'vitest';

import { DSM5_COMORBID_DEFINITION } from '@/lib/constants/questionnaires-dsm5';
import { normalizeResponseForQuestionnaireForm } from '@/lib/utils/questionnaire-prefill';

describe('DSM5 comorbid prefill normalization', () => {
  it('normalizes boolean-ish values to the questionnaire option codes', () => {
    const input = {
      has_anxiety_disorder: 'true',
      gad_present: 'false',
      social_phobia_present: 't',
      ocd_present: 'f',
      ptsd_present: 1,
      cannabis_present: 0,
      agoraphobia_no_panic_present: 'Non',
    };

    const out = normalizeResponseForQuestionnaireForm(DSM5_COMORBID_DEFINITION, input);

    expect(out.has_anxiety_disorder).toBe('oui');
    expect(out.gad_present).toBe('non');
    expect(out.social_phobia_present).toBe('oui');
    expect(out.ocd_present).toBe('non');
    expect(out.ptsd_present).toBe('oui');
    expect(out.cannabis_present).toBe('non');
    expect(out.agoraphobia_no_panic_present).toBe('non');
  });

  it('backfills panic_disorder_* from legacy panic_no_agoraphobia_*', () => {
    const input = {
      has_anxiety_disorder: 'oui',
      panic_disorder_present: null,
      panic_disorder_type: null,
      panic_disorder_age_debut: null,
      panic_disorder_symptoms_past_month: null,

      // Legacy fields containing the real data
      panic_no_agoraphobia_present: 'Oui',
      panic_no_agoraphobia_age_debut: '21',
      panic_no_agoraphobia_symptoms_past_month: 't',
    };

    const out = normalizeResponseForQuestionnaireForm(DSM5_COMORBID_DEFINITION, input);

    expect(out.panic_disorder_present).toBe('oui');
    expect(out.panic_disorder_type).toBe('sans_agoraphobie');
    expect(out.panic_disorder_age_debut).toBe(21);
    expect(out.panic_disorder_symptoms_past_month).toBe('oui');
  });

  it('backfills panic_disorder_* from legacy panic_with_agoraphobia_*', () => {
    const input = {
      has_anxiety_disorder: 'oui',
      panic_disorder_present: undefined,
      panic_disorder_type: undefined,
      panic_disorder_age_debut: undefined,
      panic_disorder_symptoms_past_month: undefined,

      // Legacy fields containing the real data
      panic_with_agoraphobia_present: true,
      panic_with_agoraphobia_age_debut: 33,
      panic_with_agoraphobia_symptoms_past_month: 'Oui',
    };

    const out = normalizeResponseForQuestionnaireForm(DSM5_COMORBID_DEFINITION, input);

    expect(out.panic_disorder_present).toBe('oui');
    expect(out.panic_disorder_type).toBe('avec_agoraphobie');
    expect(out.panic_disorder_age_debut).toBe(33);
    expect(out.panic_disorder_symptoms_past_month).toBe('oui');
  });

  it('does not overwrite panic_disorder_* when already present', () => {
    const input = {
      has_anxiety_disorder: 'oui',
      panic_disorder_present: 'non',
      panic_disorder_type: null,

      // Legacy fields disagree, but should not override current fields
      panic_with_agoraphobia_present: true,
    };

    const out = normalizeResponseForQuestionnaireForm(DSM5_COMORBID_DEFINITION, input);
    expect(out.panic_disorder_present).toBe('non');
  });
});

