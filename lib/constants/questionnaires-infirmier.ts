/**
 * Infirmier Section Questionnaires
 * For Initial Evaluation visit - Bipolar disorder
 */

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from '@/lib/constants/questionnaires';

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
    singleColumn: true,
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
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional',
    // Only show Fagerstrom if patient is current smoker (Fumeur actuel)
    conditional_on: {
      questionnaire_code: 'TOBACCO',
      field: 'smoking_status',
      values: ['current_smoker']
    }
  }
};

// ===== PHYSICAL PARAMETERS =====

export const PHYSICAL_PARAMS_QUESTIONS: Question[] = [
  {
    id: 'height_cm',
    text: 'Taille (en cm)',
    type: 'number',
    required: false,
    min: 110,
    max: 210
  },
  {
    id: 'weight_kg',
    text: 'Poids (en kg)',
    type: 'number',
    required: false,
    min: 30,
    max: 200
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
    required: false,
    min: 40,
    max: 160
  }
];

export const PHYSICAL_PARAMS_DEFINITION: QuestionnaireDefinition = {
  id: 'physical_params',
  code: 'PHYSICAL_PARAMS',
  title: 'Paramètres Physiques',
  description: 'Mesures physiques: taille, poids, périmètre abdominal. IMC calculé automatiquement.',
  questions: PHYSICAL_PARAMS_QUESTIONS,
  metadata: {
    singleColumn: true,
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
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ===== SLEEP APNEA (STOP-BANG) =====

export const SLEEP_APNEA_QUESTIONS: Question[] = [
  {
    id: 'diagnosed_sleep_apnea',
    text: 'Avez-vous été diagnostiqué comme souffrant d\'apnées du sommeil ? (examen du sommeil, polysomnographie)',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' },
      { code: 'unknown', label: 'NSP (Ne Sais Pas)' }
    ]
  },
  
  // If diagnosed = yes - ONLY show CPAP device question
  {
    id: 'has_cpap_device',
    text: 'Êtes-vous appareillé ?',
    help: 'Utilisez-vous un appareil CPAP pour traiter vos apnées du sommeil ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ],
    display_if: {
      '==': [{ var: 'diagnosed_sleep_apnea' }, 'yes']
    }
  },
  
  // STOP-Bang questions (if diagnosed = no or unknown)
  {
    id: 'section_stop_bang',
    text: 'Dépistage des Apnées du Sommeil (STOP-Bang)',
    help: 'Répondez aux questions suivantes pour évaluer votre risque d\'apnées du sommeil',
    type: 'section',
    required: false,
    display_if: {
      'in': [{ var: 'diagnosed_sleep_apnea' }, ['no', 'unknown']]
    }
  },
  {
    id: 'snoring',
    text: 'Ronflements ? Ronflez-vous fort (suffisamment fort pour qu\'on vous entende à travers une porte fermée ou que votre partenaire vous donne des coups de coude parce que vous ronflez la nuit) ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ],
    display_if: {
      'in': [{ var: 'diagnosed_sleep_apnea' }, ['no', 'unknown']]
    }
  },
  {
    id: 'tiredness',
    text: 'Fatigue ? Vous sentez-vous souvent fatigué(e), épuisé(e) ou somnolent(e) pendant la journée (comme par exemple s\'endormir au volant) ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ],
    display_if: {
      'in': [{ var: 'diagnosed_sleep_apnea' }, ['no', 'unknown']]
    }
  },
  {
    id: 'observed_apnea',
    text: 'Observation ? Quelqu\'un a-t-il observé que vous arrêtiez de respirer ou que vous vous étouffiez/suffoquiez pendant votre sommeil ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ],
    display_if: {
      'in': [{ var: 'diagnosed_sleep_apnea' }, ['no', 'unknown']]
    }
  },
  {
    id: 'hypertension',
    text: 'Tension ? Êtes-vous atteint(e) d\'hypertension artérielle ou êtes-vous traité(e) pour ce problème ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ],
    display_if: {
      'in': [{ var: 'diagnosed_sleep_apnea' }, ['no', 'unknown']]
    }
  },
  {
    id: 'bmi_over_35',
    text: 'Indice de Masse Corporelle supérieur à 35 kg/m² ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ],
    display_if: {
      'in': [{ var: 'diagnosed_sleep_apnea' }, ['no', 'unknown']]
    }
  },
  {
    id: 'age_over_50',
    text: 'Âge supérieur à 50 ans ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ],
    display_if: {
      'in': [{ var: 'diagnosed_sleep_apnea' }, ['no', 'unknown']]
    }
  },
  {
    id: 'large_neck',
    text: 'Tour de cou important ? (mesuré au niveau de la pomme d\'Adam) Pour les hommes, votre tour de cou est-il supérieur ou égal à 43 cm ? Pour les femmes, votre tour de cou est-il supérieur ou égal à 41 cm ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ],
    display_if: {
      'in': [{ var: 'diagnosed_sleep_apnea' }, ['no', 'unknown']]
    }
  },
  {
    id: 'male_gender',
    text: 'Sexe = Masculin ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ],
    display_if: {
      'in': [{ var: 'diagnosed_sleep_apnea' }, ['no', 'unknown']]
    }
  }
];

export const SLEEP_APNEA_DEFINITION: QuestionnaireDefinition = {
  id: 'sleep_apnea',
  code: 'SLEEP_APNEA',
  title: 'Apnées du sommeil',
  description: 'Dépistage des apnées du sommeil avec score STOP-Bang',
  questions: SLEEP_APNEA_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ===== BIOLOGICAL ASSESSMENT (Bilan biologique) =====

export const BIOLOGICAL_ASSESSMENT_QUESTIONS: Question[] = [
  // Date and Location Section
  {
    id: 'section_date_location',
    text: 'Date et lieu de prélèvement',
    type: 'section',
    required: false
  },
  {
    id: 'collection_date',
    text: 'Date de prélèvement',
    type: 'date',
    required: true
  },
  {
    id: 'collection_location',
    text: 'Prélèvement effectué',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'sur_site', label: 'Sur site' },
      { code: 'hors_site', label: 'Hors site' }
    ]
  },
  
  // Control Questions
  {
    id: 'section_control',
    text: 'Informations de contrôle',
    type: 'section',
    required: false
  },
  {
    id: 'on_neuroleptics',
    text: 'Patient traité par neuroleptiques/antipsychotiques ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ]
  },
  {
    id: 'woman_childbearing_age',
    text: 'Femme en âge de procréer ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ]
  },
  
  // ===== BIOCHIMIE =====
  {
    id: 'section_biochimie',
    text: 'BIOCHIMIE',
    type: 'section',
    required: false
  },
  {
    id: 'sodium',
    text: 'Sodium (mmol/L)',
    type: 'number',
    required: false,
    min: 20,
    max: 500
  },
  {
    id: 'potassium',
    text: 'Potassium (mmol/L)',
    type: 'number',
    required: false,
    min: 1,
    max: 30
  },
  {
    id: 'chlore',
    text: 'Chlore (Chlorure) (mmol/L)',
    type: 'number',
    required: false,
    min: 10,
    max: 1000
  },
  {
    id: 'bicarbonates',
    text: 'Bicarbonates (mmol/L)',
    type: 'number',
    required: false,
    min: 3,
    max: 300
  },
  {
    id: 'protidemie',
    text: 'Protidémie (Protéines totales) (g/L)',
    type: 'number',
    required: false,
    min: 10,
    max: 600
  },
  {
    id: 'albumine',
    text: 'Albumine (g/L)',
    type: 'number',
    required: false,
    max: 50
  },
  {
    id: 'uree',
    text: 'Urée (mmol/L)',
    type: 'number',
    required: false,
    min: 10,
    max: 1000
  },
  {
    id: 'acide_urique',
    text: 'Acide urique (µmol/L)',
    type: 'number',
    required: false,
    max: 50
  },
  {
    id: 'creatinine',
    text: 'Créatinine (µmol/L)',
    type: 'number',
    required: false,
    min: 10,
    max: 1000
  },
  {
    id: 'clairance_creatinine',
    text: 'Clairance de la créatinine (ml/min)',
    help: 'Calculée automatiquement',
    type: 'number',
    required: false,
    readonly: true,
    max: 1000
  },
  {
    id: 'phosphore',
    text: 'Phosphore (mmol/L)',
    type: 'number',
    required: false,
    max: 10
  },
  {
    id: 'fer',
    text: 'Fer (µmol/L)',
    type: 'number',
    required: false,
    min: 3,
    max: 100
  },
  {
    id: 'ferritine',
    text: 'Ferritine (µg/L)',
    type: 'number',
    required: false
  },
  {
    id: 'calcemie',
    text: 'Calcémie (Calcium total) (mmol/L)',
    type: 'number',
    required: false,
    min: 1,
    max: 10
  },
  {
    id: 'crp',
    text: 'CRP (mg/L)',
    type: 'number',
    required: false,
    max: 100
  },
  {
    id: 'glycemie_a_jeun',
    text: 'Glycémie à jeûn',
    type: 'number',
    required: false,
    max: 40
  },
  {
    id: 'glycemie_a_jeun_unit',
    text: 'Unité',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'mmol_L', label: 'mmol/L' },
      { code: 'g_L', label: 'g/L' }
    ]
  },
  {
    id: 'hemoglobine_glyquee',
    text: 'Hémoglobine glyquée (%)',
    type: 'number',
    required: false,
    max: 50,
    display_if: {
      'or': [
        {
          'and': [
            { '>': [{ var: 'glycemie_a_jeun' }, 0] },
            { '==': [{ var: 'glycemie_a_jeun_unit' }, 'mmol_L'] },
            { '>': [{ var: 'glycemie_a_jeun' }, 7] }
          ]
        },
        {
          'and': [
            { '>': [{ var: 'glycemie_a_jeun' }, 0] },
            { '==': [{ var: 'glycemie_a_jeun_unit' }, 'g_L'] },
            { '>': [{ var: 'glycemie_a_jeun' }, 1.26] }
          ]
        }
      ]
    }
  },
  
  // ===== BILAN LIPIDIQUE =====
  {
    id: 'section_lipidique',
    text: 'BILAN LIPIDIQUE',
    type: 'section',
    required: false
  },
  {
    id: 'hdl',
    text: 'Cholestérol HDL',
    type: 'number',
    required: false
  },
  {
    id: 'hdl_unit',
    text: 'Unité HDL',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'mmol_L', label: 'mmol/L' },
      { code: 'g_L', label: 'g/L' }
    ],
    display_if: {
      '!=': [{ var: 'hdl' }, null]
    }
  },
  {
    id: 'ldl',
    text: 'Cholestérol LDL',
    type: 'number',
    required: false
  },
  {
    id: 'ldl_unit',
    text: 'Unité LDL',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'mmol_L', label: 'mmol/L' },
      { code: 'g_L', label: 'g/L' }
    ],
    display_if: {
      '!=': [{ var: 'ldl' }, null]
    }
  },
  {
    id: 'cholesterol_total',
    text: 'Cholestérol total (mmol/L)',
    type: 'number',
    required: false,
    min: 1,
    max: 15
  },
  {
    id: 'triglycerides',
    text: 'Triglycérides (mmol/L)',
    type: 'number',
    required: false,
    min: 0.2,
    max: 20
  },
  {
    id: 'rapport_total_hdl',
    text: 'Rapport Total / HDL',
    help: 'Calculé automatiquement: Cholestérol total / Cholestérol HDL',
    type: 'number',
    required: false,
    readonly: true
  },
  
  // ===== BILAN HÉPATIQUE =====
  {
    id: 'section_hepatique',
    text: 'BILAN HÉPATIQUE',
    type: 'section',
    required: false
  },
  {
    id: 'pal',
    text: 'Phosphatases alcalines (PAL) (UI/L)',
    type: 'number',
    required: false,
    min: 20,
    max: 400
  },
  {
    id: 'asat',
    text: 'ASAT / TGO (UI/L)',
    type: 'number',
    required: false,
    min: 5,
    max: 500
  },
  {
    id: 'alat',
    text: 'ALAT / TGP (UI/L)',
    type: 'number',
    required: false,
    min: 5,
    max: 500
  },
  {
    id: 'ggt',
    text: 'Gamma-GT (UI/L)',
    type: 'number',
    required: false,
    min: 5,
    max: 1500
  },
  {
    id: 'bilirubine_totale',
    text: 'Bilirubine totale',
    type: 'number',
    required: false
  },
  {
    id: 'bilirubine_totale_unit',
    text: 'Unité',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'umol_L', label: 'µmol/L' },
      { code: 'mmol_L', label: 'mmol/L' },
      { code: 'mg_L', label: 'mg/L' }
    ]
  },
  
  // ===== BILAN THYROÏDIEN =====
  {
    id: 'section_thyroidien',
    text: 'BILAN THYROÏDIEN',
    type: 'section',
    required: false
  },
  {
    id: 'tsh',
    text: 'TSH ultrasensible',
    type: 'number',
    required: false
  },
  {
    id: 'tsh_unit',
    text: 'Unité TSH',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'pmol_L', label: 'pmol/L' },
      { code: 'uUI_mL', label: 'µUI/mL' },
      { code: 'mUI_L', label: 'mUI/L' }
    ],
    display_if: {
      '!=': [{ var: 'tsh' }, null]
    }
  },
  {
    id: 't3_libre',
    text: 'T3 libre (pmol/L)',
    type: 'number',
    required: false,
    min: 1,
    max: 30
  },
  {
    id: 't4_libre',
    text: 'T4 libre (pmol/L)',
    type: 'number',
    required: false,
    min: 5,
    max: 50
  },
  
  // ===== NFS (NUMÉRATION FORMULE SANGUINE) =====
  {
    id: 'section_nfs',
    text: 'NFS (NUMÉRATION FORMULE SANGUINE)',
    type: 'section',
    required: false
  },
  {
    id: 'leucocytes',
    text: 'Leucocytes (GB) (G/L)',
    type: 'number',
    required: false,
    min: 0.5,
    max: 200
  },
  {
    id: 'hematies',
    text: 'Hématies (GR) (T/L)',
    type: 'number',
    required: false,
    min: 1,
    max: 8
  },
  {
    id: 'hemoglobine',
    text: 'Hémoglobine (Hb)',
    type: 'number',
    required: false
  },
  {
    id: 'hemoglobine_unit',
    text: 'Unité Hémoglobine',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'g_dL', label: 'g/dL' },
      { code: 'mmol_L', label: 'mmol/L' }
    ],
    display_if: {
      '!=': [{ var: 'hemoglobine' }, null]
    }
  },
  {
    id: 'hematocrite',
    text: 'Hématocrite (Ht)',
    type: 'number',
    required: false
  },
  {
    id: 'hematocrite_unit',
    text: 'Unité Hématocrite',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'percent', label: '%' },
      { code: 'L_L', label: 'L/L' }
    ],
    display_if: {
      '!=': [{ var: 'hematocrite' }, null]
    }
  },
  {
    id: 'neutrophiles',
    text: 'Neutrophiles (G/L)',
    type: 'number',
    required: false,
    min: 0,
    max: 50
  },
  {
    id: 'basophiles',
    text: 'Basophiles (G/L)',
    type: 'number',
    required: false,
    min: 0,
    max: 5
  },
  {
    id: 'eosinophiles',
    text: 'Éosinophiles (G/L)',
    type: 'number',
    required: false,
    min: 0,
    max: 10
  },
  {
    id: 'lymphocytes',
    text: 'Lymphocytes (G/L)',
    type: 'number',
    required: false,
    min: 0,
    max: 20
  },
  {
    id: 'monocytes',
    text: 'Monocytes (G/L)',
    type: 'number',
    required: false,
    min: 0,
    max: 5
  },
  {
    id: 'vgm',
    text: 'VGM (fL)',
    type: 'number',
    required: false,
    min: 50,
    max: 130
  },
  {
    id: 'tcmh',
    text: 'TCMH',
    type: 'number',
    required: false
  },
  {
    id: 'tcmh_unit',
    text: 'Unité TCMH',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'pg', label: 'pg' },
      { code: 'percent', label: '%' }
    ],
    display_if: {
      '!=': [{ var: 'tcmh' }, null]
    }
  },
  {
    id: 'ccmh',
    text: 'CCMH',
    type: 'number',
    required: false
  },
  {
    id: 'ccmh_unit',
    text: 'Unité CCMH',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'percent', label: '%' },
      { code: 'g_dL', label: 'g/dL' },
      { code: 'g_L', label: 'g/L' }
    ],
    display_if: {
      '!=': [{ var: 'ccmh' }, null]
    }
  },
  {
    id: 'plaquettes',
    text: 'Plaquettes (G/L)',
    type: 'number',
    required: false,
    min: 10,
    max: 1000
  },
  
  // ===== HCG =====
  {
    id: 'section_hcg',
    text: 'HCG – Femmes en âge de procréer',
    type: 'section',
    required: false,
    display_if: {
      '==': [{ var: 'woman_childbearing_age' }, 'yes']
    }
  },
  {
    id: 'beta_hcg',
    text: 'Dosage β-HCG (UI)',
    type: 'number',
    required: false,
    min: 0,
    max: 500000,
    display_if: {
      '==': [{ var: 'woman_childbearing_age' }, 'yes']
    }
  },
  
  // ===== bHCG =====
  {
    id: 'section_bhcg',
    text: 'bHCG',
    type: 'section',
    required: false
  },
  {
    id: 'dosage_bhcg',
    text: 'Dosage des bHCG (UI)',
    help: 'Remplir pour les femmes en âge de procréer seulement',
    type: 'number',
    required: false,
    min: 0
  },
  {
    id: 'prolactine',
    text: 'Taux prolactine',
    type: 'number',
    required: false,
    min: 0
  },
  {
    id: 'prolactine_unit',
    text: 'Unité',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'mg_L', label: 'mg/L' },
      { code: 'uIU_mL', label: 'µIU/mL' },
      { code: 'ng_mL', label: 'ng/mL' },
      { code: 'ug_L', label: 'µg/L' }
    ]
  },
  
  // ===== DOSAGE PSYCHOTROPES =====
  {
    id: 'section_psychotropes',
    text: 'Dosage des psychotropes',
    help: 'S\'assurer que le patient n\'ait pas pris son traitement le matin du dosage. Si le patient a pris son traitement, ne pas faire le dosage.',
    type: 'section',
    required: false,
    display_if: {
      '==': [{ var: 'on_neuroleptics' }, 'yes']
    }
  },
  {
    id: 'treatment_taken_morning',
    text: 'Prise du traitement par le patient le matin du prélèvement',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ],
    display_if: {
      '==': [{ var: 'on_neuroleptics' }, 'yes']
    }
  },
  {
    id: 'clozapine',
    text: 'Dosage plasmatique de la clozapine (mmol/L)',
    type: 'number',
    required: false,
    display_if: {
      'and': [
        { '==': [{ var: 'on_neuroleptics' }, 'yes'] },
        { '==': [{ var: 'treatment_taken_morning' }, 'no'] }
      ]
    }
  },
  {
    id: 'teralithe_type',
    text: 'Téralithe',
    type: 'single_choice',
    required: false,
    options: [
      { code: '250', label: '250' },
      { code: 'LP400', label: 'LP400' }
    ],
    display_if: {
      'and': [
        { '==': [{ var: 'on_neuroleptics' }, 'yes'] },
        { '==': [{ var: 'treatment_taken_morning' }, 'no'] }
      ]
    }
  },
  {
    id: 'lithium_plasma',
    text: 'Taux de lithium plasmatique (mmol/L)',
    type: 'number',
    required: false,
    display_if: {
      'and': [
        { '==': [{ var: 'on_neuroleptics' }, 'yes'] },
        { '==': [{ var: 'treatment_taken_morning' }, 'no'] }
      ]
    }
  },
  {
    id: 'lithium_erythrocyte',
    text: 'Taux de lithium intra-érythrocytaire (mmol/L)',
    type: 'number',
    required: false,
    display_if: {
      'and': [
        { '==': [{ var: 'on_neuroleptics' }, 'yes'] },
        { '==': [{ var: 'treatment_taken_morning' }, 'no'] }
      ]
    }
  },
  {
    id: 'valproic_acid',
    text: 'Taux d\'acide valproïque plasmatique (mg/L)',
    type: 'number',
    required: false,
    display_if: {
      'and': [
        { '==': [{ var: 'on_neuroleptics' }, 'yes'] },
        { '==': [{ var: 'treatment_taken_morning' }, 'no'] }
      ]
    }
  },
  {
    id: 'carbamazepine',
    text: 'Taux de carbamazépine (mg/L)',
    type: 'number',
    required: false,
    display_if: {
      'and': [
        { '==': [{ var: 'on_neuroleptics' }, 'yes'] },
        { '==': [{ var: 'treatment_taken_morning' }, 'no'] }
      ]
    }
  },
  {
    id: 'oxcarbazepine',
    text: 'Taux d\'oxcarbazépine (µg/ml)',
    type: 'number',
    required: false,
    display_if: {
      'and': [
        { '==': [{ var: 'on_neuroleptics' }, 'yes'] },
        { '==': [{ var: 'treatment_taken_morning' }, 'no'] }
      ]
    }
  },
  {
    id: 'lamotrigine',
    text: 'Taux de lamotrigine',
    type: 'number',
    required: false,
    display_if: {
      'and': [
        { '==': [{ var: 'on_neuroleptics' }, 'yes'] },
        { '==': [{ var: 'treatment_taken_morning' }, 'no'] }
      ]
    }
  },
  
  // ===== VITAMINE D =====
  {
    id: 'section_vitamine_d',
    text: 'Questionnaire vitamine D',
    type: 'section',
    required: false
  },
  {
    id: 'vitamin_d_level',
    text: 'Dosage sanguin de vitamine D (ng/ml)',
    type: 'number',
    required: false,
    min: 0,
    max: 300
  },
  {
    id: 'outdoor_time',
    text: 'Temps moyen passé à l\'extérieur',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'less_than_1h_per_week', label: 'moins de 1 heure par semaine' },
      { code: 'less_than_1h_per_day_several_hours_per_week', label: 'moins de 1 heure par jour mais plusieurs heures par semaine' },
      { code: 'at_least_1h_per_day', label: 'au moins 1 heure par jour en moyenne' },
      { code: 'more_than_4h_per_day', label: 'plus de 4 heures par jour' }
    ]
  },
  {
    id: 'skin_phototype',
    text: 'Caractérisation du phototype cutané',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'I', label: 'phototype I' },
      { code: 'II', label: 'phototype II' },
      { code: 'III', label: 'phototype III' },
      { code: 'IV', label: 'phototype IV' },
      { code: 'V', label: 'phototype V' },
      { code: 'VI', label: 'phototype VI' }
    ]
  },
  {
    id: 'vitamin_d_supplementation',
    text: 'Supplémentation en vitamine D dans les 12 mois précédents',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ]
  },
  {
    id: 'vitamin_d_product_name',
    text: 'Nom du produit',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'sterogyl', label: 'Stérogyl' },
      { code: 'dedrogyl', label: 'Dédrogyl' },
      { code: 'uvedose', label: 'Uvédose' },
      { code: 'zymaduo', label: 'Zymaduo' },
      { code: 'uvesterol', label: 'Uvestérol' },
      { code: 'zymad', label: 'Zymad' },
      { code: 'autre', label: 'Autre' }
    ],
    display_if: {
      '==': [{ var: 'vitamin_d_supplementation' }, 'yes']
    }
  },
  {
    id: 'vitamin_d_supplementation_date',
    text: 'Date',
    type: 'date',
    required: false,
    display_if: {
      '==': [{ var: 'vitamin_d_supplementation' }, 'yes']
    }
  },
  {
    id: 'vitamin_d_supplementation_mode',
    text: 'Mode de supplémentation',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'ampoule', label: 'Ampoule' },
      { code: 'gouttes', label: 'Gouttes' }
    ],
    display_if: {
      '==': [{ var: 'vitamin_d_supplementation' }, 'yes']
    }
  },
  {
    id: 'vitamin_d_supplementation_dose',
    text: 'Dose',
    type: 'text',
    required: false,
    display_if: {
      '==': [{ var: 'vitamin_d_supplementation' }, 'yes']
    }
  },
  
  // ===== SÉROLOGIE TOXOPLASMOSE =====
  {
    id: 'section_toxo',
    text: 'Sérologie toxoplasmose',
    help: 'Rappel : le dosage est à faire à chaque visite, même en cas de sérologie positive antérieure',
    type: 'section',
    required: false
  },
  {
    id: 'toxo_serology_done',
    text: 'Le patient a-t-il eu une sérologie toxoplasmique ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ]
  },
  {
    id: 'toxo_igm_positive',
    text: 'Le statut IgM est-il positif ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ],
    display_if: {
      '==': [{ var: 'toxo_serology_done' }, 'yes']
    }
  },
  {
    id: 'toxo_igg_positive',
    text: 'Le statut IgG est-il positif ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ],
    display_if: {
      '==': [{ var: 'toxo_serology_done' }, 'yes']
    }
  },
  {
    id: 'toxo_igg_value',
    text: 'IgG (UI/mL)',
    type: 'number',
    required: false,
    min: 0,
    display_if: {
      'and': [
        { '==': [{ var: 'toxo_serology_done' }, 'yes'] },
        { '==': [{ var: 'toxo_igg_positive' }, 'yes'] }
      ]
    }
  },
  {
    id: 'toxo_pcr_done',
    text: 'Une PCR ADN a-t-elle été réalisée ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ],
    display_if: {
      'and': [
        { '==': [{ var: 'toxo_serology_done' }, 'yes'] },
        { '==': [{ var: 'toxo_igg_positive' }, 'yes'] }
      ]
    }
  },
  {
    id: 'toxo_pcr_positive',
    text: 'La PCR ADN était-elle positive ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ],
    display_if: {
      'and': [
        { '==': [{ var: 'toxo_serology_done' }, 'yes'] },
        { '==': [{ var: 'toxo_igg_positive' }, 'yes'] },
        { '==': [{ var: 'toxo_pcr_done' }, 'yes'] }
      ]
    }
  }
];

export const BIOLOGICAL_ASSESSMENT_DEFINITION: QuestionnaireDefinition = {
  id: 'biological_assessment',
  code: 'BIOLOGICAL_ASSESSMENT',
  title: 'Bilan biologique',
  description: 'Évaluation biologique complète incluant biochimie, bilan lipidique, hépatique, thyroïdien, NFS, HCG, prolactine, dosages psychotropes, vitamine D et sérologie toxoplasmose',
  questions: BIOLOGICAL_ASSESSMENT_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ===== ECG (ELECTROCARDIOGRAMME) =====

export const ECG_QUESTIONS: Question[] = [
  {
    id: 'ecg_performed',
    text: 'Electrocardiogramme effectué',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ]
  },
  {
    id: 'section_measurements',
    text: 'Mesures',
    type: 'section',
    required: false,
    display_if: {
      '==': [{ var: 'ecg_performed' }, 'yes']
    }
  },
  {
    id: 'heart_rate',
    text: 'Fréquence cardiaque (bpm)',
    type: 'number',
    required: false,
    min: 30,
    max: 250,
    display_if: {
      '==': [{ var: 'ecg_performed' }, 'yes']
    }
  },
  {
    id: 'qt_measured',
    text: 'Mesure du QT en seconde (0.xxx)',
    help: 'Ex: 0.400',
    type: 'number',
    required: false,
    min: 0.2,
    max: 0.7,
    display_if: {
      '==': [{ var: 'ecg_performed' }, 'yes']
    }
  },
  {
    id: 'rr_measured',
    text: 'Mesure du RR en seconde (0.xxx)',
    help: 'RR est l\'intervalle de temps séparant deux ondes R consécutives. Ex: 0.850',
    type: 'number',
    required: false,
    min: 0.3,
    max: 2.0,
    display_if: {
      '==': [{ var: 'ecg_performed' }, 'yes']
    }
  },
  {
    id: 'qtc_calculated',
    text: 'QT calculé (QTc)',
    help: 'Formule : QTc = QTm / √RR. Interprétation : < 0.35s (Hypercalcémie/Imprégnation digitalique). Normal : 0.35-0.43 (H), 0.35-0.48 (F). Long : >0.43 (H), >0.48 (F). Menaçant : >0.468 (H), >0.528 (F).',
    type: 'number',
    required: false,
    readonly: true,
    display_if: {
      '==': [{ var: 'ecg_performed' }, 'yes']
    }
  },
  {
    id: 'section_followup',
    text: 'Suivi',
    type: 'section',
    required: false,
    display_if: {
      '==': [{ var: 'ecg_performed' }, 'yes']
    }
  },
  {
    id: 'ecg_sent_to_cardiologist',
    text: 'ECG envoyé à un cardiologue ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ],
    display_if: {
      '==': [{ var: 'ecg_performed' }, 'yes']
    }
  },
  {
    id: 'cardiologist_consultation_requested',
    text: 'Demande de consultation ou d\'avis auprès d\'un cardiologue',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ],
    display_if: {
      '==': [{ var: 'ecg_performed' }, 'yes']
    }
  },
  {
    id: 'section_cardiologist_details',
    text: 'Coordonnées Cardiologue',
    type: 'section',
    required: false,
    display_if: {
      'and': [
        { '==': [{ var: 'ecg_performed' }, 'yes'] },
        { '==': [{ var: 'cardiologist_consultation_requested' }, 'yes'] }
      ]
    }
  },
  {
    id: 'cardiologist_name',
    text: 'Nom du cardiologue',
    type: 'text',
    required: false,
    display_if: {
      'and': [
        { '==': [{ var: 'ecg_performed' }, 'yes'] },
        { '==': [{ var: 'cardiologist_consultation_requested' }, 'yes'] }
      ]
    }
  },
  {
    id: 'cardiologist_city',
    text: 'Ville du cardiologue',
    type: 'text',
    required: false,
    display_if: {
      'and': [
        { '==': [{ var: 'ecg_performed' }, 'yes'] },
        { '==': [{ var: 'cardiologist_consultation_requested' }, 'yes'] }
      ]
    }
  }
];

export const ECG_DEFINITION: QuestionnaireDefinition = {
  id: 'ecg',
  code: 'ECG',
  title: 'Fiche de Recueil ECG (Electrocardiogramme)',
  description: 'Formulaire de saisie des paramètres électrocardiographiques avec calcul du QTc et critères de gravité',
  questions: ECG_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

