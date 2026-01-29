// ============================================================================
// eFondaMental Platform - Schizophrenia Initial Evaluation
// Bilan Social Questionnaire (Social Evaluation)
// ============================================================================

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from '@/lib/constants/questionnaires';

// ============================================================================
// TypeScript Types matching schizophrenia_bilan_social table schema
// ============================================================================

export interface SchizophreniaBilanSocialResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Q1 - Marital status
  marital_status?: string | null;
  
  // Q2 - Number of children
  children_count?: number | null;
  
  // Q3 - Education
  education?: string | null;
  
  // Q4 - Professional status
  professional_status?: string | null;
  
  // Q5 - Professional class
  professional_class?: string | null;
  
  // Q6 - Current work leave
  current_work_leave?: string | null;
  
  // Q7 - Past year work leave
  past_year_work_leave?: string | null;
  
  // Q7a - Cumulative weeks (conditional)
  past_year_leave_weeks?: number | null;
  
  // Q8 - Income types (multiple choice)
  income_types?: string[] | null;
  
  // Q9 - Monthly income estimate
  monthly_income?: string | null;
  
  // Q10 - Housing type
  housing_type?: string | null;
  
  // Q11 - Protection measures
  protection_measures?: string | null;
  
  // Q11a - Protection start year (conditional)
  protection_start_year?: number | null;
  
  // Q11b - Justice safeguard (conditional)
  justice_safeguard?: boolean | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaBilanSocialResponseInsert = Omit<
  SchizophreniaBilanSocialResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
>;

// ============================================================================
// Helper Constants for Dropdown Options
// ============================================================================

const EDUCATION_OPTIONS = [
  { code: 'CP', label: 'CP' },
  { code: 'CE1', label: 'CE1' },
  { code: 'CE2', label: 'CE2' },
  { code: 'CM1', label: 'CM1' },
  { code: 'CM2', label: 'CM2' },
  { code: 'certificat_etudes', label: "Certificat d'études" },
  { code: '6eme', label: '6ème' },
  { code: '5eme', label: '5ème' },
  { code: '4eme', label: '4ème' },
  { code: '3eme', label: '3ème' },
  { code: '2nde', label: '2nde' },
  { code: '1ere', label: '1ère' },
  { code: 'BEP', label: 'BEP' },
  { code: 'CAP', label: 'CAP' },
  { code: 'BAC', label: 'BAC' },
  { code: 'BAC+1', label: 'BAC+1' },
  { code: 'BAC+2', label: 'BAC+2' },
  { code: 'BAC+3', label: 'BAC+3' },
  { code: 'BAC+4', label: 'BAC+4' },
  { code: 'BAC+5', label: 'BAC+5' },
  { code: 'doctorat', label: 'Doctorat' }
];

const PROFESSIONAL_STATUS_OPTIONS = [
  { code: 'sans_emploi', label: 'Sans emploi' },
  { code: 'actif', label: 'Actif' },
  { code: 'au_foyer', label: 'Au foyer' },
  { code: 'retraite', label: 'Retraité' },
  { code: 'etudiant', label: 'Étudiant' },
  { code: 'pension', label: 'Pension' },
  { code: 'autres', label: 'Autres' }
];

const PROFESSIONAL_CLASS_OPTIONS = [
  { code: 'agriculteur_exploitant', label: 'Agriculteur exploitant' },
  { code: 'artisan', label: 'Artisan' },
  { code: 'cadre_fp_intellectuelle_artistique', label: 'Cadre de la fonction publique, profession intellectuelle et artistique' },
  { code: 'cadre_entreprise', label: "Cadre d'entreprise" },
  { code: 'chef_entreprise_10_plus', label: "Chef d'entreprise de 10 salariés ou plus" },
  { code: 'commercant_assimile', label: 'Commerçant et assimilé' },
  { code: 'contremaitre_agent_maitrise', label: 'Contremaître, agent de maîtrise' },
  { code: 'employe_fp', label: 'Employé de la fonction publique' },
  { code: 'employe_administratif_entreprise', label: "Employé administratif d'entreprise" },
  { code: 'employe_commerce', label: 'Employé de commerce' },
  { code: 'ouvrier_qualifie', label: 'Ouvrier qualifié' },
  { code: 'ouvrier_non_qualifie', label: 'Ouvrier non qualifié' },
  { code: 'ouvrier_agricole', label: 'Ouvrier agricole' },
  { code: 'personnel_service_particuliers', label: 'Personnel de service direct aux particuliers' },
  { code: 'prof_intermediaire_enseignement_sante_fp', label: "Profession intermédiaire de l'enseignement, de la santé, de la fonction publique et assimilés" },
  { code: 'prof_intermediaire_admin_com_entreprises', label: 'Profession intermédiaire administrative et commerciale des entreprises' },
  { code: 'profession_liberale_assimile', label: 'Profession libérale et assimilé' },
  { code: 'technicien', label: 'Technicien' }
];

const HOUSING_OPTIONS = [
  { code: 'locataire_auto_finance', label: 'Locataire (loyer auto financé)' },
  { code: 'locataire_tiers_paye', label: 'Locataire (loyer payé par un tiers)' },
  { code: 'proprietaire', label: 'Propriétaire' },
  { code: 'institution', label: 'Institution' },
  { code: 'vit_avec_parents', label: 'Vit avec ses parents' },
  { code: 'chez_les_enfants', label: 'Chez les enfants' },
  { code: 'foyer_hotel', label: 'Foyer Hôtel' },
  { code: 'foyer_educateur', label: 'Foyer éducateur' },
  { code: 'residence_post_cure', label: 'Résidence post-cure' },
  { code: 'appartement_therapeutique', label: 'Appartement thérapeutique' },
  { code: 'logement_associatif', label: 'Logement associatif' },
  { code: 'autre', label: 'Autre' }
];

// ============================================================================
// Questions Dictionary
// ============================================================================

export const BILAN_SOCIAL_SZ_QUESTIONS: Question[] = [
  // Q1 - Marital status
  {
    id: 'marital_status',
    text: 'Statut marital',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'celibataire', label: 'Célibataire (pas de cohabitation depuis au moins 6 mois)' },
      { code: 'marie_concubin_pacse', label: 'Marié (ou situation maritale depuis au moins 6 mois) / Concubin / Pacsé' },
      { code: 'separe', label: 'Séparé' },
      { code: 'divorce', label: 'Divorcé' },
      { code: 'veuf', label: 'Veuf(ve)' }
    ]
  },
  
  // Q2 - Number of children
  {
    id: 'children_count',
    text: "Nombre d'enfants",
    type: 'number',
    required: true,
    min: 0,
    max: 99
  },
  
  // Q3 - Education
  {
    id: 'education',
    text: 'Education',
    type: 'single_choice',
    required: true,
    options: EDUCATION_OPTIONS
  },
  
  // Q4 - Professional status
  {
    id: 'professional_status',
    text: 'Statut professionnel actuel',
    type: 'single_choice',
    required: true,
    options: PROFESSIONAL_STATUS_OPTIONS
  },
  
  // Q5 - Professional class
  {
    id: 'professional_class',
    text: 'Donner la classe professionnelle',
    type: 'single_choice',
    required: true,
    options: PROFESSIONAL_CLASS_OPTIONS
  },
  
  // Q6 - Current work leave
  {
    id: 'current_work_leave',
    text: 'Arrêt de travail actuel',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'non_applicable', label: 'Non applicable' }
    ]
  },
  
  // Q7 - Past year work leave
  {
    id: 'past_year_work_leave',
    text: "Arrêt de travail au cours de l'année passée",
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'non_applicable', label: 'Non applicable' }
    ]
  },
  
  // Q7a - Cumulative weeks (conditional on Q7 = oui)
  {
    id: 'past_year_leave_weeks',
    text: "Nombre de semaines cumulées sur l'année",
    type: 'number',
    required: false,
    min: 0,
    max: 52,
    display_if: { '==': [{ var: 'past_year_work_leave' }, 'oui'] }
  },
  
  // Q8 - Income types (multiple choice)
  {
    id: 'income_types',
    text: 'Type de revenus',
    type: 'multiple_choice',
    required: true,
    help: 'Plusieurs choix possibles',
    options: [
      { code: 'salaire', label: 'Salaire' },
      { code: 'rmi_rsa', label: 'RMI/RSA' },
      { code: 'aah', label: 'AAH' },
      { code: 'pension_invalidite', label: "Pension d'invalidité" },
      { code: 'assedic', label: 'ASSEDIC' },
      { code: 'apl', label: 'APL' },
      { code: 'absence_revenus', label: 'Absence de revenus' },
      { code: 'autres', label: 'Autres' }
    ]
  },
  
  // Q9 - Monthly income estimate
  {
    id: 'monthly_income',
    text: 'Estimation du revenu mensuel global',
    type: 'single_choice',
    required: true,
    options: [
      { code: '0-500', label: '0-500 euros' },
      { code: '500-1000', label: '500-1000 euros' },
      { code: '1000-1500', label: '1000-1500 euros' },
      { code: '1500-2000', label: '1500-2000 euros' },
      { code: '2000_plus', label: '>2000 euros' }
    ]
  },
  
  // Q10 - Housing type
  {
    id: 'housing_type',
    text: 'Logement principal',
    type: 'single_choice',
    required: true,
    options: HOUSING_OPTIONS
  },
  
  // Q11 - Protection measures
  {
    id: 'protection_measures',
    text: 'Mesures de protection',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'aucune', label: 'Aucune' },
      { code: 'curatelle', label: 'Curatelle' },
      { code: 'curatelle_renforcee', label: 'Curatelle renforcée' },
      { code: 'tutelle', label: 'Tutelle' }
    ]
  },
  
  // Q11a - Protection start year (conditional on Q11 != aucune)
  {
    id: 'protection_start_year',
    text: 'Année de début',
    type: 'number',
    required: false,
    min: 1900,
    max: 2100,
    display_if: { '!=': [{ var: 'protection_measures' }, 'aucune'] }
  },
  
  // Q11b - Justice safeguard (conditional on Q11 != aucune)
  {
    id: 'justice_safeguard',
    text: 'Sauvegarde de justice',
    type: 'single_choice',
    required: false,
    display_if: { '!=': [{ var: 'protection_measures' }, 'aucune'] },
    options: [
      { code: 1, label: 'Oui' },
      { code: 0, label: 'Non' }
    ]
  }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const BILAN_SOCIAL_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'bilan_social_sz',
  code: 'BILAN_SOCIAL_SZ',
  title: 'Bilan social',
  description: 'Évaluation de la situation sociale et professionnelle du patient',
  questions: BILAN_SOCIAL_SZ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional'
  }
};
