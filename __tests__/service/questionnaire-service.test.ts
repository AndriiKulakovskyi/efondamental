// Bipolar Screening Service Layer Tests
// Tests service functions that compute and save scores

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
  saveQidsResponse,
  saveMdqResponse,
  saveDiagnosticResponse,
  saveOrientationResponse,
} from '@/lib/services/questionnaire.service';
import type {
  BipolarQidsResponseInsert,
  BipolarMdqResponseInsert,
  BipolarDiagnosticResponseInsert,
  BipolarOrientationResponseInsert,
} from '@/lib/types/database.types';

describe('Screening Service Layer - QIDS', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock auth.getUser to return a test user
    (mockSupabaseClient.auth.getUser as any).mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should compute total_score correctly for QIDS', async () => {
    const mockUpsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'test-id',
            visit_id: 'visit-1',
            patient_id: 'patient-1',
            q1: 2, q2: 1, q3: 0, q4: 0,
            q5: 2,
            q6: 1, q7: 1, q8: 0, q9: 0,
            q10: 2, q11: 2, q12: 2, q13: 2, q14: 2,
            q15: 1, q16: 1,
            total_score: 16,
            interpretation: 'Dépression sévère',
          },
          error: null,
        }),
      }),
    });

    (mockSupabaseClient.from as any).mockReturnValue({
      upsert: mockUpsert,
    });

    const input: BipolarQidsResponseInsert = {
      visit_id: 'visit-1',
      patient_id: 'patient-1',
      q1: 2, q2: 1, q3: 0, q4: 0,
      q5: 2,
      q6: 1, q7: 1, q8: 0, q9: 0,
      q10: 2, q11: 2, q12: 2, q13: 2, q14: 2,
      q15: 1, q16: 1,
    };

    const result = await saveQidsResponse(input);

    // Verify upsert was called with computed fields
    expect(mockUpsert).toHaveBeenCalled();
    const upsertCall = mockUpsert.mock.calls[0][0];
    
    // max(2,1,0,0) + 2 + max(1,1,0,0) + 2 + 2 + 2 + 2 + 2 + max(1,1)
    // = 2 + 2 + 1 + 2 + 2 + 2 + 2 + 2 + 1 = 16
    expect(upsertCall.total_score).toBe(16);
    expect(upsertCall.interpretation).toBe('Dépression sévère');
    
    // Verify returned data
    expect(result.total_score).toBe(16);
    expect(result.interpretation).toBe('Dépression sévère');
  });

  it('should interpret QIDS score thresholds correctly', async () => {
    const mockUpsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'test-id',
            visit_id: 'visit-1',
            patient_id: 'patient-1',
            q1: 1, q2: 0, q3: 0, q4: 0,
            q5: 1,
            q6: 1, q7: 0, q8: 0, q9: 0,
            q10: 1, q11: 1, q12: 0, q13: 1, q14: 1,
            q15: 0, q16: 0,
            total_score: 7,
            interpretation: 'Dépression légère',
          },
          error: null,
        }),
      }),
    });

    (mockSupabaseClient.from as any).mockReturnValue({
      upsert: mockUpsert,
    });

    const input: BipolarQidsResponseInsert = {
      visit_id: 'visit-1',
      patient_id: 'patient-1',
      q1: 1, q2: 0, q3: 0, q4: 0,
      q5: 1,
      q6: 1, q7: 0, q8: 0, q9: 0,
      q10: 1, q11: 1, q12: 0, q13: 1, q14: 1,
      q15: 0, q16: 0,
    };

    const result = await saveQidsResponse(input);

    const upsertCall = mockUpsert.mock.calls[0][0];
    
    // max(1,0,0,0) + 1 + max(1,0,0,0) + 1 + 1 + 0 + 1 + 1 + max(0,0)
    // = 1 + 1 + 1 + 1 + 1 + 0 + 1 + 1 + 0 = 7
    expect(upsertCall.total_score).toBe(7);
    expect(upsertCall.interpretation).toBe('Dépression légère');
  });
});

describe('Screening Service Layer - MDQ', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    (mockSupabaseClient.auth.getUser as any).mockResolvedValue({
      data: { user: { id: 'test-user-id' } },
      error: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should compute q1_score and positive interpretation for MDQ', async () => {
    const mockUpsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'test-id',
            visit_id: 'visit-1',
            patient_id: 'patient-1',
            q1_1: 1, q1_2: 1, q1_3: 1, q1_4: 1, q1_5: 1,
            q1_6: 1, q1_7: 1, q1_8: 0, q1_9: 0, q1_10: 0,
            q1_11: 0, q1_12: 0, q1_13: 0,
            q1_score: 7,
            q2: 1,
            q3: 2,
            interpretation: 'MDQ Positif - Depistage positif pour trouble bipolaire',
          },
          error: null,
        }),
      }),
    });

    (mockSupabaseClient.from as any).mockReturnValue({
      upsert: mockUpsert,
    });

    const input: BipolarMdqResponseInsert = {
      visit_id: 'visit-1',
      patient_id: 'patient-1',
      q1_1: 1, q1_2: 1, q1_3: 1, q1_4: 1, q1_5: 1,
      q1_6: 1, q1_7: 1, q1_8: 0, q1_9: 0, q1_10: 0,
      q1_11: 0, q1_12: 0, q1_13: 0,
      q2: 1,
      q3: 2,
    };

    const result = await saveMdqResponse(input);

    expect(mockUpsert).toHaveBeenCalled();
    const upsertCall = mockUpsert.mock.calls[0][0];
    
    // Sum of q1 items = 7
    expect(upsertCall.q1_score).toBe(7);
    expect(upsertCall.interpretation).toContain('Positif');
    
    expect(result.q1_score).toBe(7);
    expect(result.interpretation).toContain('Positif');
  });

  it('should compute negative interpretation for MDQ', async () => {
    const mockUpsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'test-id',
            visit_id: 'visit-1',
            patient_id: 'patient-1',
            q1_1: 1, q1_2: 1, q1_3: 0, q1_4: 0, q1_5: 0,
            q1_6: 0, q1_7: 0, q1_8: 0, q1_9: 0, q1_10: 0,
            q1_11: 0, q1_12: 0, q1_13: 0,
            q1_score: 2,
            q2: 0,
            q3: 1,
            interpretation: 'MDQ Négatif - Dépistage négatif pour trouble bipolaire',
          },
          error: null,
        }),
      }),
    });

    (mockSupabaseClient.from as any).mockReturnValue({
      upsert: mockUpsert,
    });

    const input: BipolarMdqResponseInsert = {
      visit_id: 'visit-1',
      patient_id: 'patient-1',
      q1_1: 1, q1_2: 1, q1_3: 0, q1_4: 0, q1_5: 0,
      q1_6: 0, q1_7: 0, q1_8: 0, q1_9: 0, q1_10: 0,
      q1_11: 0, q1_12: 0, q1_13: 0,
      q2: 0,
      q3: 1,
    };

    const result = await saveMdqResponse(input);

    const upsertCall = mockUpsert.mock.calls[0][0];
    
    expect(upsertCall.q1_score).toBe(2);
    expect(upsertCall.interpretation).toContain('Négatif');
  });

  it('should handle boundary case q1_score=7, q2=1, q3=2 (positive)', async () => {
    const mockUpsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'test-id',
            visit_id: 'visit-1',
            patient_id: 'patient-1',
            q1_1: 1, q1_2: 1, q1_3: 1, q1_4: 1, q1_5: 1,
            q1_6: 1, q1_7: 1, q1_8: 0, q1_9: 0, q1_10: 0,
            q1_11: 0, q1_12: 0, q1_13: 0,
            q1_score: 7,
            q2: 1,
            q3: 2,
            interpretation: 'MDQ Positif - Dépistage positif pour trouble bipolaire',
          },
          error: null,
        }),
      }),
    });

    (mockSupabaseClient.from as any).mockReturnValue({
      upsert: mockUpsert,
    });

    const input: BipolarMdqResponseInsert = {
      visit_id: 'visit-1',
      patient_id: 'patient-1',
      q1_1: 1, q1_2: 1, q1_3: 1, q1_4: 1, q1_5: 1,
      q1_6: 1, q1_7: 1, q1_8: 0, q1_9: 0, q1_10: 0,
      q1_11: 0, q1_12: 0, q1_13: 0,
      q2: 1,
      q3: 2,
    };

    const result = await saveMdqResponse(input);

    const upsertCall = mockUpsert.mock.calls[0][0];
    
    expect(upsertCall.q1_score).toBe(7);
    expect(upsertCall.interpretation).toContain('Positif');
  });
});

describe('Screening Service Layer - Diagnostic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    (mockSupabaseClient.auth.getUser as any).mockResolvedValue({
      data: { user: { id: 'professional-user-id' } },
      error: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should save diagnostic response with completed_by from auth', async () => {
    const mockUpsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'test-id',
            visit_id: 'visit-1',
            patient_id: 'patient-1',
            diagnostic_bipolaire: 'bipolaire_1',
            completed_by: 'professional-user-id',
          },
          error: null,
        }),
      }),
    });

    (mockSupabaseClient.from as any).mockReturnValue({
      upsert: mockUpsert,
    });

    const input: BipolarDiagnosticResponseInsert = {
      visit_id: 'visit-1',
      patient_id: 'patient-1',
      diagnostic_bipolaire: 'bipolaire_1',
      nombre_episodes_maniaques: 2,
      nombre_episodes_hypomaniaques: 1,
      nombre_episodes_depressifs: 3,
      nombre_episodes_mixtes: 0,
      premier_trouble_thymique_age: 25,
      premier_episode_maniaque_age: 26,
      premier_episode_depressif_age: 25,
    };

    const result = await saveDiagnosticResponse(input);

    expect(mockUpsert).toHaveBeenCalled();
    const upsertCall = mockUpsert.mock.calls[0][0];
    
    // Should set completed_by from auth user
    expect(upsertCall.completed_by).toBe('professional-user-id');
    expect(result.completed_by).toBe('professional-user-id');
  });
});

describe('Screening Service Layer - Orientation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    (mockSupabaseClient.auth.getUser as any).mockResolvedValue({
      data: { user: { id: 'professional-user-id' } },
      error: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should save orientation response without computation', async () => {
    const mockUpsert = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: {
            id: 'test-id',
            visit_id: 'visit-1',
            patient_id: 'patient-1',
            trouble_bipolaire_ou_suspicion: 'oui',
            etat_thymique_compatible: 'oui',
            prise_en_charge_100_ou_accord: 'oui',
            accord_evaluation_centre_expert: 'oui',
            accord_transmission_cr: 'oui',
            completed_by: 'professional-user-id',
          },
          error: null,
        }),
      }),
    });

    (mockSupabaseClient.from as any).mockReturnValue({
      upsert: mockUpsert,
    });

    const input: BipolarOrientationResponseInsert = {
      visit_id: 'visit-1',
      patient_id: 'patient-1',
      trouble_bipolaire_ou_suspicion: 'oui',
      etat_thymique_compatible: 'oui',
      prise_en_charge_100_ou_accord: 'oui',
      accord_evaluation_centre_expert: 'oui',
      accord_transmission_cr: 'oui',
    };

    const result = await saveOrientationResponse(input);

    expect(mockUpsert).toHaveBeenCalled();
    
    // Orientation has no computed fields, just verify data integrity
    expect(result.trouble_bipolaire_ou_suspicion).toBe('oui');
    expect(result.completed_by).toBe('professional-user-id');
  });
});
