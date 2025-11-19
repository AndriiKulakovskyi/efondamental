/**
 * Infirmier Section Questionnaires
 * For Initial Evaluation visit - Bipolar disorder
 */

import { Question, QuestionnaireDefinition } from '@/lib/types/questionnaire.types';

// ===== TOBACCO ASSESSMENT =====

// Helper function to generate age options
const generateAgeOptions = () => {
  const options = [{ code: 'unknown', label: 'Ne sais pas' }, { code: '<5', label: '<5' }];
  for (let i = 5; i <= 89; i++) {
    options.push({ code: i.toString(), label: i.toString() });
  }
  options.push({ code: '>89', label: '>89' });
  return options;
};

export const TOBACCO_QUESTIONS: Question[] = [
  {
    id: 'smoking_status',
    text: 'Tabac',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'non_smoker', label: 'Non fumeur' },
      { code: 'current_smoker', label: 'Fumeur actuel' },
      { code: 'ex_smoker', label: 'Ex-fumeur' },
      { code: 'unknown', label: 'Statut inconnu' }
    ]
  },
  
  // Fields for current_smoker
  {
    id: 'pack_years',
    text: 'Nombre de paquet année',
    type: 'number',
    required: true,
    display_if: {
      '==': [{ var: 'smoking_status' }, 'current_smoker']
    }
  },
  {
    id: 'smoking_start_age',
    text: 'Age de début du tabagisme',
    type: 'single_choice',
    required: true,
    options: generateAgeOptions(),
    display_if: {
      '==': [{ var: 'smoking_status' }, 'current_smoker']
    }
  },
  {
    id: 'has_substitution',
    text: 'Substitution',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ],
    display_if: {
      '==': [{ var: 'smoking_status' }, 'current_smoker']
    }
  },
  {
    id: 'substitution_methods',
    text: 'Méthodes de substitution utilisées',
    help: 'Sélectionnez toutes les méthodes de substitution que le patient utilise',
    type: 'multiple_choice',
    required: false,
    options: [
      { code: 'e_cigarette', label: 'Cigarette électronique' },
      { code: 'champix', label: 'Champix' },
      { code: 'patch', label: 'Patch' },
      { code: 'nicorette', label: 'Nicorette' }
    ],
    display_if: {
      'and': [
        { '==': [{ var: 'smoking_status' }, 'current_smoker'] },
        { '==': [{ var: 'has_substitution' }, 'yes'] }
      ]
    }
  },
  
  // Fields for ex_smoker (reuse pack_years and smoking_start_age with different display_if)
  {
    id: 'pack_years_ex',
    text: 'Nombre de paquet année',
    type: 'number',
    required: true,
    display_if: {
      '==': [{ var: 'smoking_status' }, 'ex_smoker']
    }
  },
  {
    id: 'smoking_start_age_ex',
    text: 'Age de début du tabagisme',
    type: 'single_choice',
    required: true,
    options: generateAgeOptions(),
    display_if: {
      '==': [{ var: 'smoking_status' }, 'ex_smoker']
    }
  },
  {
    id: 'smoking_end_age',
    text: 'Age de fin du tabac',
    type: 'single_choice',
    required: true,
    options: generateAgeOptions(),
    display_if: {
      '==': [{ var: 'smoking_status' }, 'ex_smoker']
    }
  },
  {
    id: 'has_substitution_ex',
    text: 'Substitution',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ],
    display_if: {
      '==': [{ var: 'smoking_status' }, 'ex_smoker']
    }
  },
  {
    id: 'substitution_methods_ex',
    text: 'Méthodes de substitution utilisées',
    help: 'Sélectionnez toutes les méthodes de substitution que le patient utilisait',
    type: 'multiple_choice',
    required: false,
    options: [
      { code: 'e_cigarette', label: 'Cigarette électronique' },
      { code: 'champix', label: 'Champix' },
      { code: 'patch', label: 'Patch' },
      { code: 'nicorette', label: 'Nicorette' }
    ],
    display_if: {
      'and': [
        { '==': [{ var: 'smoking_status' }, 'ex_smoker'] },
        { '==': [{ var: 'has_substitution_ex' }, 'yes'] }
      ]
    }
  }
];

export const TOBACCO_DEFINITION: QuestionnaireDefinition = {
  id: 'tobacco',
  code: 'TOBACCO',
  title: 'Évaluation du Tabagisme',
  description: 'Évaluation du statut tabagique et de la consommation',
  questions: TOBACCO_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ===== FAGERSTROM TEST FOR NICOTINE DEPENDENCE =====

export const FAGERSTROM_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: '1. Combien de temps après votre réveil fumez-vous votre première cigarette ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 3, label: 'Dans les 5 minutes', score: 3 },
      { code: 2, label: 'De 6 à 30 minutes', score: 2 },
      { code: 1, label: 'De 31 à 60 minutes', score: 1 },
      { code: 0, label: 'Après 60 minutes', score: 0 }
    ]
  },
  {
    id: 'q2',
    text: '2. Trouvez-vous difficile de vous abstenir de fumer dans les endroits où c\'est interdit ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q3',
    text: '3. À quelle cigarette de la journée vous serait-il le plus difficile de renoncer ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'La première', score: 1 },
      { code: 0, label: 'N\'importe quelle autre', score: 0 }
    ]
  },
  {
    id: 'q4',
    text: '4. Combien de cigarettes fumez-vous par jour ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '10 ou moins', score: 0 },
      { code: 1, label: '11–20', score: 1 },
      { code: 2, label: '21–30', score: 2 },
      { code: 3, label: '31 ou plus', score: 3 }
    ]
  },
  {
    id: 'q5',
    text: '5. Fumez-vous à un rythme plus soutenu le matin que l\'après-midi ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q6',
    text: '6. Fumez-vous lorsque vous êtes si malade que vous devez rester au lit presque toute la journée ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  }
];

export const FAGERSTROM_DEFINITION: QuestionnaireDefinition = {
  id: 'fagerstrom',
  code: 'FAGERSTROM',
  title: 'Échelle de dépendance tabagique de Fagerström (FTND)',
  description: 'Test de dépendance à la nicotine. 6 items, score total 0-10.',
  questions: FAGERSTROM_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ===== PHYSICAL PARAMETERS =====

export const PHYSICAL_PARAMS_QUESTIONS: Question[] = [
  {
    id: 'height_cm',
    text: 'Taille (en cm)',
    type: 'number',
    required: false
  },
  {
    id: 'weight_kg',
    text: 'Poids (en kg)',
    type: 'number',
    required: false
  },
  {
    id: 'bmi',
    text: 'IMC (Indice de Masse Corporelle)',
    help: 'Calculé automatiquement à partir de la taille et du poids: Poids(kg) / (Taille(m))²',
    type: 'text',
    required: false,
    readonly: true
  },
  {
    id: 'abdominal_circumference_cm',
    text: 'Périmètre abdominal (en cm)',
    type: 'number',
    required: false
  }
];

export const PHYSICAL_PARAMS_DEFINITION: QuestionnaireDefinition = {
  id: 'physical_params',
  code: 'PHYSICAL_PARAMS',
  title: 'Paramètres Physiques',
  description: 'Mesures physiques: taille, poids, périmètre abdominal. IMC calculé automatiquement.',
  questions: PHYSICAL_PARAMS_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ===== BLOOD PRESSURE & HEART RATE =====

export const BLOOD_PRESSURE_QUESTIONS: Question[] = [
  // Blood Pressure & Heart Rate - Lying Down Section
  {
    id: 'section_bp_lying',
    text: 'Pression artérielle couché (en mm de Mercure)',
    type: 'section',
    required: false
  },
  {
    id: 'bp_lying_systolic',
    text: 'Pression Systolique (mmHg)',
    type: 'number',
    required: false
  },
  {
    id: 'bp_lying_diastolic',
    text: 'Pression Diastolique (mmHg)',
    type: 'number',
    required: false
  },
  {
    id: 'tension_lying',
    text: 'Tension couché',
    help: 'Format: Systolique/Diastolique (calculé automatiquement)',
    type: 'text',
    required: false,
    readonly: true
  },
  {
    id: 'heart_rate_lying',
    text: 'Fréquence cardiaque couché (battements par minute)',
    type: 'number',
    required: false
  },
  
  // Blood Pressure & Heart Rate - Standing Section
  {
    id: 'section_bp_standing',
    text: 'Pression artérielle debout (en mm de Mercure)',
    type: 'section',
    required: false
  },
  {
    id: 'bp_standing_systolic',
    text: 'Pression Systolique (mmHg)',
    type: 'number',
    required: false
  },
  {
    id: 'bp_standing_diastolic',
    text: 'Pression Diastolique (mmHg)',
    type: 'number',
    required: false
  },
  {
    id: 'tension_standing',
    text: 'Tension debout',
    help: 'Format: Systolique/Diastolique (calculé automatiquement)',
    type: 'text',
    required: false,
    readonly: true
  },
  {
    id: 'heart_rate_standing',
    text: 'Fréquence cardiaque debout (battements par minute)',
    type: 'number',
    required: false
  }
];

export const BLOOD_PRESSURE_DEFINITION: QuestionnaireDefinition = {
  id: 'blood_pressure',
  code: 'BLOOD_PRESSURE',
  title: 'Pression artérielle & Fréquence cardiaque',
  description: 'Mesures de la pression artérielle et de la fréquence cardiaque (couché et debout)',
  questions: BLOOD_PRESSURE_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

