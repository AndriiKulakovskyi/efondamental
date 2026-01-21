// Bipolar Nurse Service Layer Tests
// Tests service functions that compute and save scores for nurse module

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { SupabaseClient } from '@supabase/supabase-js';

// Mock the Next.js cookies function
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: vi.fn(),
    set: vi.fn(),
    getAll: vi.fn(() => []),
  })),
}));

// Mock the createClient function before importing service
const mockSupabaseClient = {
  from: vi.fn(),
  auth: {
    getUser: vi.fn(),
  },
} as unknown as SupabaseClient;

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve(mockSupabaseClient)),
}));

// Now import services after mocks are set up
import {
  saveTobaccoResponse,
  saveFagerstromResponse,
  savePhysicalParamsResponse,
  saveBloodPressureResponse,
  saveSleepApneaResponse,
  saveBiologicalAssessmentResponse,
  saveEcgResponse,
} from '@/lib/services/bipolar-nurse.service';
import type {
  BipolarNurseTobaccoResponseInsert,
  BipolarNurseFagerstromResponseInsert,
  BipolarNursePhysicalParamsResponseInsert,
  BipolarNurseBloodPressureResponseInsert,
  BipolarNurseSleepApneaResponseInsert,
  BipolarNurseBiologicalAssessmentResponseInsert,
  BipolarNurseEcgResponseInsert,
} from '@/lib/types/database.types';

describe('Nurse Service Layer - Tobacco', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should save tobacco response without computation', async () => {
    const mockUpsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'test-id',
            visit_id: 'visit-1',
            patient_id: 'patient-1',
            status: 'current_smoker',
            cigarettes_per_day: 10,
            years_smoking: 15,
            has_substitution: true,
          },
          error: null,
        }),
      }),
    });

    (mockSupabaseClient.from as any).mockReturnValue({
      upsert: mockUpsert,
    });

    const input: BipolarNurseTobaccoResponseInsert = {
      visit_id: 'visit-1',
      patient_id: 'patient-1',
      status: 'current_smoker',
      cigarettes_per_day: 10,
      years_smoking: 15,
      has_substitution: true,
    };

    const result = await saveTobaccoResponse(input);

    expect(mockUpsert).toHaveBeenCalled();
    expect(result.status).toBe('current_smoker');
  });
});

describe('Nurse Service Layer - Fagerstrom', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should compute Fagerstrom score correctly', async () => {
    const mockUpsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'test-id',
            visit_id: 'visit-1',
            patient_id: 'patient-1',
            q1: 2,
            q2: 1,
            q3: 1,
            q4: 2,
            q5: 1,
            q6: 0,
            total_score: 7,
            dependence_level: 'high',
            interpretation: 'Score FTND: 7/10 - Dependance forte a la nicotine',
          },
          error: null,
        }),
      }),
    });

    (mockSupabaseClient.from as any).mockReturnValue({
      upsert: mockUpsert,
    });

    const input: BipolarNurseFagerstromResponseInsert = {
      visit_id: 'visit-1',
      patient_id: 'patient-1',
      q1: 2,
      q2: 1,
      q3: 1,
      q4: 2,
      q5: 1,
      q6: 0,
    };

    const result = await saveFagerstromResponse(input);

    expect(mockUpsert).toHaveBeenCalled();
    const upsertCall = mockUpsert.mock.calls[0][0];

    // Verify computed fields
    expect(upsertCall.total_score).toBe(7);
    expect(upsertCall.dependence_level).toBe('high');
    expect(upsertCall.interpretation).toContain('7/10');

    // Verify returned data
    expect(result.total_score).toBe(7);
    expect(result.dependence_level).toBe('high');
  });

  it('should handle null values in Fagerstrom', async () => {
    const mockUpsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'test-id',
            visit_id: 'visit-1',
            patient_id: 'patient-1',
            q1: 1,
            q2: null,
            q3: 1,
            q4: null,
            q5: 0,
            q6: null,
            total_score: 2,
            dependence_level: 'none',
            interpretation: 'Score FTND: 2/10 - Pas de dependance',
          },
          error: null,
        }),
      }),
    });

    (mockSupabaseClient.from as any).mockReturnValue({
      upsert: mockUpsert,
    });

    const input: BipolarNurseFagerstromResponseInsert = {
      visit_id: 'visit-1',
      patient_id: 'patient-1',
      q1: 1,
      q2: null,
      q3: 1,
      q4: null,
      q5: 0,
      q6: null,
    };

    const result = await saveFagerstromResponse(input);

    const upsertCall = mockUpsert.mock.calls[0][0];
    expect(upsertCall.total_score).toBe(2);
    expect(upsertCall.dependence_level).toBe('none');
  });
});

describe('Nurse Service Layer - Physical Parameters', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should compute BMI correctly', async () => {
    const mockUpsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'test-id',
            visit_id: 'visit-1',
            patient_id: 'patient-1',
            height_cm: 180,
            weight_kg: 85,
            bmi: 26.2,
          },
          error: null,
        }),
      }),
    });

    (mockSupabaseClient.from as any).mockReturnValue({
      upsert: mockUpsert,
    });

    const input: BipolarNursePhysicalParamsResponseInsert = {
      visit_id: 'visit-1',
      patient_id: 'patient-1',
      height_cm: 180,
      weight_kg: 85,
    };

    const result = await savePhysicalParamsResponse(input);

    expect(mockUpsert).toHaveBeenCalled();
    const upsertCall = mockUpsert.mock.calls[0][0];

    // Verify BMI computation: 85 / (1.8^2) = 26.23
    expect(upsertCall.bmi).toBeCloseTo(26.2, 1);
    expect(result.bmi).toBeCloseTo(26.2, 1);
  });

  it('should handle null values for BMI', async () => {
    const mockUpsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'test-id',
            visit_id: 'visit-1',
            patient_id: 'patient-1',
            height_cm: null,
            weight_kg: 85,
            bmi: null,
          },
          error: null,
        }),
      }),
    });

    (mockSupabaseClient.from as any).mockReturnValue({
      upsert: mockUpsert,
    });

    const input: BipolarNursePhysicalParamsResponseInsert = {
      visit_id: 'visit-1',
      patient_id: 'patient-1',
      height_cm: null,
      weight_kg: 85,
    };

    const result = await savePhysicalParamsResponse(input);

    const upsertCall = mockUpsert.mock.calls[0][0];
    expect(upsertCall.bmi).toBeNull();
  });
});

describe('Nurse Service Layer - Blood Pressure', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should format tension strings correctly', async () => {
    const mockUpsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'test-id',
            visit_id: 'visit-1',
            patient_id: 'patient-1',
            bp_lying_systolic: 130,
            bp_lying_diastolic: 85,
            bp_standing_systolic: 125,
            bp_standing_diastolic: 80,
            tension_lying: '130/85',
            tension_standing: '125/80',
          },
          error: null,
        }),
      }),
    });

    (mockSupabaseClient.from as any).mockReturnValue({
      upsert: mockUpsert,
    });

    const input: BipolarNurseBloodPressureResponseInsert = {
      visit_id: 'visit-1',
      patient_id: 'patient-1',
      bp_lying_systolic: 130,
      bp_lying_diastolic: 85,
      bp_standing_systolic: 125,
      bp_standing_diastolic: 80,
    };

    const result = await saveBloodPressureResponse(input);

    expect(mockUpsert).toHaveBeenCalled();
    const upsertCall = mockUpsert.mock.calls[0][0];

    // Verify tension formatting
    expect(upsertCall.tension_lying).toBe('130/85');
    expect(upsertCall.tension_standing).toBe('125/80');
  });

  it('should handle null values in blood pressure', async () => {
    const mockUpsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'test-id',
            visit_id: 'visit-1',
            patient_id: 'patient-1',
            bp_lying_systolic: 130,
            bp_lying_diastolic: null,
            bp_standing_systolic: null,
            bp_standing_diastolic: null,
            tension_lying: null,
            tension_standing: null,
          },
          error: null,
        }),
      }),
    });

    (mockSupabaseClient.from as any).mockReturnValue({
      upsert: mockUpsert,
    });

    const input: BipolarNurseBloodPressureResponseInsert = {
      visit_id: 'visit-1',
      patient_id: 'patient-1',
      bp_lying_systolic: 130,
      bp_lying_diastolic: null,
      bp_standing_systolic: null,
      bp_standing_diastolic: null,
    };

    const result = await saveBloodPressureResponse(input);

    const upsertCall = mockUpsert.mock.calls[0][0];
    expect(upsertCall.tension_lying).toBeNull();
    expect(upsertCall.tension_standing).toBeNull();
  });
});

describe('Nurse Service Layer - Sleep Apnea', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should compute STOP-Bang score for undiagnosed patient', async () => {
    const mockUpsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'test-id',
            visit_id: 'visit-1',
            patient_id: 'patient-1',
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
            stop_bang_score: 5,
            risk_level: 'high',
            interpretation: 'Score STOP-Bang: 5/8. Risque eleve d\'apnees du sommeil.',
          },
          error: null,
        }),
      }),
    });

    (mockSupabaseClient.from as any).mockReturnValue({
      upsert: mockUpsert,
    });

    const input: BipolarNurseSleepApneaResponseInsert = {
      visit_id: 'visit-1',
      patient_id: 'patient-1',
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
    };

    const result = await saveSleepApneaResponse(input);

    expect(mockUpsert).toHaveBeenCalled();
    const upsertCall = mockUpsert.mock.calls[0][0];

    // Verify STOP-Bang computation
    expect(upsertCall.stop_bang_score).toBe(5);
    expect(upsertCall.risk_level).toBe('high');
    expect(upsertCall.interpretation).toContain('5/8');
  });

  it('should handle diagnosed sleep apnea with CPAP', async () => {
    const mockUpsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'test-id',
            visit_id: 'visit-1',
            patient_id: 'patient-1',
            diagnosed_sleep_apnea: 'yes',
            has_cpap_device: 'yes',
            stop_bang_score: 0,
            risk_level: null,
            interpretation: 'Apnees du sommeil diagnostiquees. Patient appareille (CPAP).',
          },
          error: null,
        }),
      }),
    });

    (mockSupabaseClient.from as any).mockReturnValue({
      upsert: mockUpsert,
    });

    const input: BipolarNurseSleepApneaResponseInsert = {
      visit_id: 'visit-1',
      patient_id: 'patient-1',
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
    };

    const result = await saveSleepApneaResponse(input);

    const upsertCall = mockUpsert.mock.calls[0][0];
    expect(upsertCall.interpretation).toContain('appareille');
  });
});

describe('Nurse Service Layer - Biological Assessment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should compute rapport_total_hdl correctly', async () => {
    const mockUpsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'test-id',
            visit_id: 'visit-1',
            patient_id: 'patient-1',
            cholesterol_total: 5.2,
            hdl: 1.3,
            rapport_total_hdl: 4.0,
          },
          error: null,
        }),
      }),
    });

    (mockSupabaseClient.from as any).mockReturnValue({
      upsert: mockUpsert,
    });

    const input: BipolarNurseBiologicalAssessmentResponseInsert = {
      visit_id: 'visit-1',
      patient_id: 'patient-1',
      cholesterol_total: 5.2,
      hdl: 1.3,
      ldl: null,
      triglycerides: null,
      protidemie: null,
      calcemie: null,
    };

    const result = await saveBiologicalAssessmentResponse(input);

    expect(mockUpsert).toHaveBeenCalled();
    const upsertCall = mockUpsert.mock.calls[0][0];

    // Verify rapport computation: 5.2 / 1.3 = 4.0
    expect(upsertCall.rapport_total_hdl).toBeCloseTo(4.0, 2);
  });

  it('should compute calcemie_corrigee correctly', async () => {
    const mockUpsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'test-id',
            visit_id: 'visit-1',
            patient_id: 'patient-1',
            calcemie: 2.35,
            protidemie: 72,
            calcemie_corrigee: 4.72,
          },
          error: null,
        }),
      }),
    });

    (mockSupabaseClient.from as any).mockReturnValue({
      upsert: mockUpsert,
    });

    const input: BipolarNurseBiologicalAssessmentResponseInsert = {
      visit_id: 'visit-1',
      patient_id: 'patient-1',
      cholesterol_total: null,
      hdl: null,
      ldl: null,
      triglycerides: null,
      calcemie: 2.35,
      protidemie: 72,
    };

    const result = await saveBiologicalAssessmentResponse(input);

    const upsertCall = mockUpsert.mock.calls[0][0];

    // Verify calcemie_corrigee: 2.35/0.55 + 72/160 = 4.27 + 0.45 = 4.72
    expect(upsertCall.calcemie_corrigee).toBeCloseTo(4.72, 2);
  });

  it('should handle null values in biological assessment', async () => {
    const mockUpsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'test-id',
            visit_id: 'visit-1',
            patient_id: 'patient-1',
            cholesterol_total: 5.2,
            hdl: null,
            rapport_total_hdl: null,
            calcemie_corrigee: null,
          },
          error: null,
        }),
      }),
    });

    (mockSupabaseClient.from as any).mockReturnValue({
      upsert: mockUpsert,
    });

    const input: BipolarNurseBiologicalAssessmentResponseInsert = {
      visit_id: 'visit-1',
      patient_id: 'patient-1',
      cholesterol_total: 5.2,
      hdl: null,
      ldl: null,
      triglycerides: null,
      calcemie: null,
      protidemie: null,
    };

    const result = await saveBiologicalAssessmentResponse(input);

    const upsertCall = mockUpsert.mock.calls[0][0];
    expect(upsertCall.rapport_total_hdl).toBeNull();
    expect(upsertCall.calcemie_corrigee).toBeNull();
  });
});

describe('Nurse Service Layer - ECG', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should compute QTc correctly for performed ECG', async () => {
    const mockUpsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'test-id',
            visit_id: 'visit-1',
            patient_id: 'patient-1',
            ecg_performed: 'yes',
            qt_measured: 0.38,
            rr_measured: 0.85,
            heart_rate: 72,
            qtc_calculated: 0.412,
            interpretation: 'ECG effectue - QTc: 0.412s (Normal pour homme)',
          },
          error: null,
        }),
      }),
    });

    (mockSupabaseClient.from as any).mockReturnValue({
      upsert: mockUpsert,
    });

    const input: BipolarNurseEcgResponseInsert = {
      visit_id: 'visit-1',
      patient_id: 'patient-1',
      ecg_performed: 'yes',
      qt_measured: 0.38,
      rr_measured: 0.85,
      heart_rate: 72,
    };

    const result = await saveEcgResponse(input, 'M');

    expect(mockUpsert).toHaveBeenCalled();
    const upsertCall = mockUpsert.mock.calls[0][0];

    // Verify QTc: 0.38 / sqrt(0.85) = 0.412
    expect(upsertCall.qtc_calculated).toBeCloseTo(0.412, 3);
    expect(upsertCall.interpretation).toContain('QTc');
  });

  it('should handle ECG not performed', async () => {
    const mockUpsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'test-id',
            visit_id: 'visit-1',
            patient_id: 'patient-1',
            ecg_performed: 'no',
            qt_measured: null,
            rr_measured: null,
            heart_rate: null,
            qtc_calculated: null,
            interpretation: 'ECG non effectue',
          },
          error: null,
        }),
      }),
    });

    (mockSupabaseClient.from as any).mockReturnValue({
      upsert: mockUpsert,
    });

    const input: BipolarNurseEcgResponseInsert = {
      visit_id: 'visit-1',
      patient_id: 'patient-1',
      ecg_performed: 'no',
      qt_measured: null,
      rr_measured: null,
      heart_rate: null,
    };

    const result = await saveEcgResponse(input, 'M');

    const upsertCall = mockUpsert.mock.calls[0][0];
    expect(upsertCall.qtc_calculated).toBeNull();
    expect(upsertCall.interpretation).toContain('non effectue');
  });
});
