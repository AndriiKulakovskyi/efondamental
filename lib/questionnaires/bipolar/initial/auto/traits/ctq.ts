// ============================================================================
// eFondaMental Platform - Bipolar Initial Evaluation
// CTQ Questionnaire (Childhood Trauma Questionnaire)
// ============================================================================

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from '@/lib/constants/questionnaires';

// ============================================================================
// TypeScript Types matching bipolar_ctq table schema
// ============================================================================

export interface BipolarCtqResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Questions 1-28
  q1?: number | null; q2?: number | null; q3?: number | null; q4?: number | null;
  q5?: number | null; q6?: number | null; q7?: number | null; q8?: number | null;
  q9?: number | null; q10?: number | null; q11?: number | null; q12?: number | null;
  q13?: number | null; q14?: number | null; q15?: number | null; q16?: number | null;
  q17?: number | null; q18?: number | null; q19?: number | null; q20?: number | null;
  q21?: number | null; q22?: number | null; q23?: number | null; q24?: number | null;
  q25?: number | null; q26?: number | null; q27?: number | null; q28?: number | null;
  
  // Subscale scores
  emotional_abuse_score?: number | null;
  physical_abuse_score?: number | null;
  sexual_abuse_score?: number | null;
  emotional_neglect_score?: number | null;
  physical_neglect_score?: number | null;
  denial_score?: number | null;
  total_score?: number | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarCtqResponseInsert = Omit<BipolarCtqResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// Questions Dictionary
// ============================================================================

const CTQ_OPTIONS = [
  { code: 1, label: 'Jamais', score: 1 },
  { code: 2, label: 'Rarement', score: 2 },
  { code: 3, label: 'Quelquefois', score: 3 },
  { code: 4, label: 'Souvent', score: 4 },
  { code: 5, label: 'Très souvent', score: 5 }
];

export const CTQ_QUESTIONS: Question[] = [
  { id: 'q1', text: "1. Il m'est arrivé de ne pas avoir assez à manger", type: 'single_choice', required: true, options: CTQ_OPTIONS },
  { id: 'q2', text: "2. Je savais qu'il y avait quelqu'un pour prendre soin de moi et me protéger", type: 'single_choice', required: true, options: CTQ_OPTIONS },
  { id: 'q3', text: "3. Des membres de ma famille me disaient que j'étais « stupide » ou « paresseux » ou « laid »", type: 'single_choice', required: true, options: CTQ_OPTIONS },
  { id: 'q4', text: "4. Mes parents étaient trop saouls ou « pétés » pour s'occuper de la famille", type: 'single_choice', required: true, options: CTQ_OPTIONS },
  { id: 'q5', text: "5. Il y avait quelqu'un dans ma famille qui m'aidait à sentir que j'étais important ou particulier", type: 'single_choice', required: true, options: CTQ_OPTIONS },
  { id: 'q6', text: '6. Je devais porter des vêtements sales', type: 'single_choice', required: true, options: CTQ_OPTIONS },
  { id: 'q7', text: '7. Je me sentais aimé(e)', type: 'single_choice', required: true, options: CTQ_OPTIONS },
  { id: 'q8', text: "8. Je pensais que mes parents n'avaient pas souhaité ma naissance", type: 'single_choice', required: true, options: CTQ_OPTIONS },
  { id: 'q9', text: "9. J'ai été frappé(e) si fort par un membre de ma famille que j'ai dû consulter un docteur ou aller à l'hôpital", type: 'single_choice', required: true, options: CTQ_OPTIONS },
  { id: 'q10', text: "10. Je n'aurais rien voulu changer à ma famille", type: 'single_choice', required: true, options: CTQ_OPTIONS },
  { id: 'q11', text: "11. Un membre de ma famille m'a frappé(e) si fort que j'ai eu des bleus ou des marques", type: 'single_choice', required: true, options: CTQ_OPTIONS },
  { id: 'q12', text: "12. J'étais puni(e) au moyen d'une ceinture, d'un bâton, d'une corde ou de quelque autre objet dur", type: 'single_choice', required: true, options: CTQ_OPTIONS },
  { id: 'q13', text: '13. Les membres de ma famille étaient attentifs les uns aux autres', type: 'single_choice', required: true, options: CTQ_OPTIONS },
  { id: 'q14', text: "14. Les membres de ma famille me disaient des choses blessantes ou insultantes", type: 'single_choice', required: true, options: CTQ_OPTIONS },
  { id: 'q15', text: "15. Je pense que j'ai été physiquement maltraité(e)", type: 'single_choice', required: true, options: CTQ_OPTIONS },
  { id: 'q16', text: "16. J'ai eu une enfance parfaite", type: 'single_choice', required: true, options: CTQ_OPTIONS },
  { id: 'q17', text: "17. J'ai été frappé(e) ou battu(e) si fort que quelqu'un l'a remarqué", type: 'single_choice', required: true, options: CTQ_OPTIONS },
  { id: 'q18', text: "18. J'avais le sentiment que quelqu'un dans ma famille me détestait", type: 'single_choice', required: true, options: CTQ_OPTIONS },
  { id: 'q19', text: '19. Les membres de ma famille se sentaient proches les uns des autres', type: 'single_choice', required: true, options: CTQ_OPTIONS },
  { id: 'q20', text: "20. Quelqu'un a essayé de me faire des attouchements sexuels ou de m'en faire faire", type: 'single_choice', required: true, options: CTQ_OPTIONS },
  { id: 'q21', text: "21. Quelqu'un a menacé de me blesser ou de raconter des mensonges si je ne faisais pas quelque chose de nature sexuelle avec lui", type: 'single_choice', required: true, options: CTQ_OPTIONS },
  { id: 'q22', text: "22. J'avais la meilleure famille du monde", type: 'single_choice', required: true, options: CTQ_OPTIONS },
  { id: 'q23', text: "23. Quelqu'un a essayé de me faire faire des actes sexuels ou de me faire regarder de tels actes", type: 'single_choice', required: true, options: CTQ_OPTIONS },
  { id: 'q24', text: "24. J'ai été victime d'abus sexuels", type: 'single_choice', required: true, options: CTQ_OPTIONS },
  { id: 'q25', text: "25. Je pense que j'ai été maltraité affectivement", type: 'single_choice', required: true, options: CTQ_OPTIONS },
  { id: 'q26', text: "26. Il y avait quelqu'un pour m'emmener chez le docteur si j'en avais besoin", type: 'single_choice', required: true, options: CTQ_OPTIONS },
  { id: 'q27', text: "27. Je pense qu'on a abusé de moi sexuellement", type: 'single_choice', required: true, options: CTQ_OPTIONS },
  { id: 'q28', text: '28. Ma famille était une source de force et de soutien', type: 'single_choice', required: true, options: CTQ_OPTIONS }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const CTQ_DEFINITION: QuestionnaireDefinition = {
  id: 'ctq',
  code: 'CTQ_FR',
  title: 'CTQ - Childhood Trauma Questionnaire',
  description: "Questionnaire sur les traumatismes de l'enfance",
  questions: CTQ_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'patient',
    instructions: "Ce questionnaire porte sur certaines expériences que vous auriez pu vivre au cours de votre enfance ou de votre adolescence.",
    reverse_items: [2, 5, 7, 13, 19, 26, 28],
    subscales: {
      emotional_abuse: [3, 8, 14, 18, 25],
      physical_abuse: [9, 11, 12, 15, 17],
      sexual_abuse: [20, 21, 23, 24, 27],
      emotional_neglect: [5, 7, 13, 19, 28],
      physical_neglect: [1, 2, 4, 6, 26],
      denial: [10, 16, 22]
    }
  }
};

// ============================================================================
// Scoring Functions
// ============================================================================

// Items that need to be reversed (6 - score)
const REVERSE_ITEMS = [2, 5, 7, 13, 19, 26, 28];

// Subscale item mappings
const SUBSCALES = {
  emotional_abuse: [3, 8, 14, 18, 25],
  physical_abuse: [9, 11, 12, 15, 17],
  sexual_abuse: [20, 21, 23, 24, 27],
  emotional_neglect: [5, 7, 13, 19, 28],
  physical_neglect: [1, 2, 4, 6, 26],
  denial: [10, 16, 22]
};

// Severity thresholds for each subscale
const SEVERITY_THRESHOLDS = {
  emotional_abuse: { none: 8, low: 9, moderate: 13, severe: 16 },
  physical_abuse: { none: 7, low: 8, moderate: 10, severe: 13 },
  sexual_abuse: { none: 5, low: 6, moderate: 8, severe: 13 },
  emotional_neglect: { none: 9, low: 10, moderate: 15, severe: 18 },
  physical_neglect: { none: 7, low: 8, moderate: 10, severe: 13 }
};

export function computeCtqScores(responses: Partial<BipolarCtqResponse>): {
  emotional_abuse_score: number;
  physical_abuse_score: number;
  sexual_abuse_score: number;
  emotional_neglect_score: number;
  physical_neglect_score: number;
  denial_score: number;
  total_score: number;
} {
  const getAdjustedValue = (itemNum: number): number => {
    const key = `q${itemNum}` as keyof BipolarCtqResponse;
    const value = responses[key] as number | null | undefined;
    if (value === null || value === undefined) return 0;
    return REVERSE_ITEMS.includes(itemNum) ? (6 - value) : value;
  };
  
  const calculateSubscore = (items: number[]): number => {
    return items.reduce((sum, item) => sum + getAdjustedValue(item), 0);
  };
  
  const emotionalAbuse = calculateSubscore(SUBSCALES.emotional_abuse);
  const physicalAbuse = calculateSubscore(SUBSCALES.physical_abuse);
  const sexualAbuse = calculateSubscore(SUBSCALES.sexual_abuse);
  const emotionalNeglect = calculateSubscore(SUBSCALES.emotional_neglect);
  const physicalNeglect = calculateSubscore(SUBSCALES.physical_neglect);
  const denial = calculateSubscore(SUBSCALES.denial);
  
  return {
    emotional_abuse_score: emotionalAbuse,
    physical_abuse_score: physicalAbuse,
    sexual_abuse_score: sexualAbuse,
    emotional_neglect_score: emotionalNeglect,
    physical_neglect_score: physicalNeglect,
    denial_score: denial,
    total_score: emotionalAbuse + physicalAbuse + sexualAbuse + emotionalNeglect + physicalNeglect
  };
}

export function interpretCtqSubscale(subscale: keyof typeof SEVERITY_THRESHOLDS, score: number): string {
  const thresholds = SEVERITY_THRESHOLDS[subscale];
  if (score <= thresholds.none) return 'None/Minimal';
  if (score <= thresholds.low) return 'Low/Moderate';
  if (score <= thresholds.moderate) return 'Moderate/Severe';
  return 'Severe/Extreme';
}
