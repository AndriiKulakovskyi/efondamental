// eFondaMental Platform - Fluences Verbales (Cardebat et al., 1990)
// Schizophrenia Initial Evaluation - Neuropsy Module
// Reference: Cardebat, D. et al. (1990). Normes du GREFEX

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaFluencesVerbalesResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  patient_age: number;
  years_of_education: number;
  // Lettre P (Phonemic)
  fv_p_tot_correct: number;
  fv_p_persev?: number | null;
  fv_p_deriv?: number | null;
  fv_p_intrus?: number | null;
  fv_p_propres?: number | null;
  fv_p_cluster_tot?: number | null;
  fv_p_cluster_taille?: number | null;
  fv_p_switch_tot?: number | null;
  fv_p_tot_rupregle?: number | null;
  fv_p_tot_correct_z?: number | null;
  fv_p_tot_correct_pc?: string | null;
  // Categorie Animaux (Semantic)
  fv_anim_tot_correct: number;
  fv_anim_persev?: number | null;
  fv_anim_deriv?: number | null;
  fv_anim_intrus?: number | null;
  fv_anim_propres?: number | null;
  fv_anim_cluster_tot?: number | null;
  fv_anim_cluster_taille?: number | null;
  fv_anim_switch_tot?: number | null;
  fv_anim_tot_rupregle?: number | null;
  fv_anim_tot_correct_z?: number | null;
  fv_anim_tot_correct_pc?: string | null;
  questionnaire_version?: string | null;
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaFluencesVerbalesResponseInsert = Omit<
  SchizophreniaFluencesVerbalesResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' |
  'fv_p_tot_rupregle' | 'fv_p_tot_correct_z' | 'fv_p_tot_correct_pc' |
  'fv_anim_tot_rupregle' | 'fv_anim_tot_correct_z' | 'fv_anim_tot_correct_pc'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const FLUENCES_VERBALES_SZ_QUESTIONS: Question[] = [
  {
    id: 'section_demo',
    text: 'Informations demographiques',
    type: 'section',
    required: false
  },
  {
    id: 'patient_age',
    text: 'Age du patient',
    type: 'number',
    required: true,
    readonly: true,
    min: 18,
    max: 120,
    help: 'Calculé automatiquement à partir de la date de naissance et de la date de visite'
  },
  {
    id: 'years_of_education',
    text: 'Années d\'études',
    type: 'number',
    required: true,
    readonly: true,
    min: 0,
    max: 25,
    help: 'Calculé automatiquement depuis le profil du patient'
  },
  // Fluence Phonemique - Lettre P
  {
    id: 'section_lettre_p',
    text: 'Fluence Phonemique - Lettre P',
    type: 'section',
    required: false
  },
  {
    id: 'fv_p_tot_correct',
    text: 'Nombre total de mots corrects lettre P',
    type: 'number',
    required: false,
    min: 0,
    max: 100,
    help: 'Nombre total de mots corrects commençant par P (hors persévérations, intrusions, dérivés et noms propres)'
  },
  {
    id: 'fv_p_persev',
    text: 'Persévérations lettre P',
    type: 'number',
    required: false,
    min: 0,
    help: 'Nombre de répétitions de mots (même mot dit plusieurs fois)'
  },
  {
    id: 'fv_p_deriv',
    text: 'Mots dérivés lettre P (MD)',
    type: 'number',
    required: false,
    min: 0,
    help: 'Nombre de variantes morphologiques du même mot racine (ex: pain, pains)'
  },
  {
    id: 'fv_p_intrus',
    text: 'Intrusions lettre P (I)',
    type: 'number',
    required: false,
    min: 0,
    help: 'Nombre de mots ne commençant pas par P'
  },
  {
    id: 'fv_p_propres',
    text: 'Noms propres lettre P (NP)',
    type: 'number',
    required: false,
    min: 0,
    help: 'Nombre de noms propres (noms de personnes, lieux, marques)'
  },
  {
    id: 'fv_p_cluster_tot',
    text: 'Nombre de clusters',
    type: 'number',
    required: false,
    min: 0,
    help: 'Nombre de clusters phonémiques ou sémantiques (groupes de mots liés produits consécutivement)'
  },
  {
    id: 'fv_p_cluster_taille',
    text: 'Taille moyenne d\'un cluster',
    type: 'number',
    required: false,
    min: 0,
    help: 'Nombre moyen de mots par cluster'
  },
  {
    id: 'fv_p_switch_tot',
    text: 'Nombre de switch',
    type: 'number',
    required: false,
    min: 0,
    help: 'Nombre de transitions/switches entre différents clusters'
  },
  {
    id: 'fv_p_tot_rupregle',
    text: 'Ruptures de règle lettre P (MD+I+NP)',
    type: 'number',
    required: false,
    readonly: true,
    help: 'Total des ruptures de règle combinant mots dérivés, intrusions et noms propres'
  },
  {
    id: 'fv_p_tot_correct_z',
    text: 'Déviation standard lettre P',
    help: 'Z-score montrant l\'écart en déviations standard par rapport aux normes GREFEX ajustées pour l\'âge et le niveau d\'éducation',
    type: 'number',
    required: false,
    readonly: true
  },
  {
    id: 'fv_p_tot_correct_pc',
    text: 'Percentile lettre P',
    help: 'Rang percentile montrant le pourcentage de la population normative ayant un score inférieur',
    type: 'text',
    required: false,
    readonly: true
  },
  // Fluence Semantique - Categorie Animaux
  {
    id: 'section_animaux',
    text: 'Fluence Semantique - Categorie Animaux',
    type: 'section',
    required: false
  },
  {
    id: 'fv_anim_tot_correct',
    text: 'Nombre total de mots corrects categorie animaux',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    help: 'Nombre total de noms d\'animaux corrects (hors persévérations, intrusions, dérivés et noms propres)'
  },
  {
    id: 'fv_anim_persev',
    text: 'Persévérations catégorie animaux',
    type: 'number',
    required: false,
    min: 0,
    help: 'Nombre de répétitions de noms d\'animaux'
  },
  {
    id: 'fv_anim_deriv',
    text: 'Mots dérivés catégorie animaux (MD)',
    type: 'number',
    required: false,
    min: 0,
    help: 'Nombre de variantes morphologiques (ex: chat, chatte, chaton)'
  },
  {
    id: 'fv_anim_intrus',
    text: 'Intrusions catégorie animaux (I)',
    type: 'number',
    required: false,
    min: 0,
    help: 'Nombre de mots qui ne sont pas des animaux'
  },
  {
    id: 'fv_anim_propres',
    text: 'Noms propres catégorie animaux (NP)',
    type: 'number',
    required: false,
    min: 0,
    help: 'Nombre de noms propres (noms d\'animaux de compagnie, personnages fictifs comme Mickey)'
  },
  {
    id: 'fv_anim_cluster_tot',
    text: 'Nombre de clusters',
    type: 'number',
    required: false,
    min: 0,
    help: 'Nombre de clusters sémantiques (ex: animaux de ferme, oiseaux, grands félins)'
  },
  {
    id: 'fv_anim_cluster_taille',
    text: 'Taille moyenne d\'un cluster',
    type: 'number',
    required: false,
    min: 0,
    help: 'Nombre moyen d\'animaux par cluster sémantique'
  },
  {
    id: 'fv_anim_switch_tot',
    text: 'Nombre de switch',
    type: 'number',
    required: false,
    min: 0,
    help: 'Nombre de switches entre différentes catégories sémantiques'
  },
  {
    id: 'fv_anim_tot_rupregle',
    text: 'Ruptures de règle catégorie animaux (MD+I+NP)',
    type: 'number',
    required: false,
    readonly: true,
    help: 'Total des ruptures de règle pour la fluence sémantique'
  },
  {
    id: 'fv_anim_tot_correct_z',
    text: 'Déviation standard catégorie animaux',
    help: 'Z-score montrant l\'écart par rapport aux normes ajustées pour l\'âge et le niveau d\'éducation pour la fluence sémantique',
    type: 'number',
    required: false,
    readonly: true
  },
  {
    id: 'fv_anim_tot_correct_pc',
    text: 'Percentile catégorie animaux',
    help: 'Rang percentile pour la performance de fluence sémantique',
    type: 'text',
    required: false,
    readonly: true
  }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export interface QuestionnaireDefinition {
  id: string;
  code: string;
  title: string;
  description: string;
  instructions?: string;
  questions: Question[];
  metadata?: {
    singleColumn?: boolean;
    pathologies?: string[];
    target_role?: 'patient' | 'healthcare_professional';
    reference?: string;
    [key: string]: any;
  };
}

export const FLUENCES_VERBALES_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'fluences_verbales_sz',
  code: 'FLUENCES_VERBALES_SZ',
  title: 'Fluences verbales (Cardebat et al., 1990)',
  description: 'Test neuropsychologique évaluant la fluence verbale (phonémique et sémantique).',
  instructions: 'Le clinicien demande au patient de nommer le plus de mots possibles commençant par la lettre P (fluence phonémique) puis le plus d\'animaux possibles (fluence sémantique). Chaque épreuve dure 2 minutes.',
  questions: FLUENCES_VERBALES_SZ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    reference: 'Cardebat, D., Doyon, B., Puel, M., Goulet, P., & Joanette, Y. (1990). Normes du GREFEX.'
  }
};
