// eFondaMental Platform - Social Questionnaire Definition
// Social evaluation questionnaire for bipolar disorder

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from './questionnaires';

export const SOCIAL_QUESTIONS: Question[] = [
  // 1. Statut marital
  {
    id: 'marital_status',
    text: 'Statut marital',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'celibataire', label: 'Célibataire' },
      { code: 'marie_concubin_pacse', label: 'Marié / Concubin / Pacsé' },
      { code: 'separe', label: 'Séparé' },
      { code: 'divorce', label: 'Divorcé' },
      { code: 'veuf', label: 'Veuf(ve)' }
    ]
  },
  
  // 2. Education
  {
    id: 'education',
    text: 'Éducation',
    type: 'single_choice',
    required: true,
    options: [
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
    ]
  },
  
  // 3. Statut professionnel actuel
  {
    id: 'professional_status',
    text: 'Statut professionnel actuel',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'sans_emploi', label: 'Sans emploi' },
      { code: 'actif', label: 'Actif' },
      { code: 'au_foyer', label: 'Au foyer' },
      { code: 'retraite', label: 'Retraité' },
      { code: 'etudiant', label: 'Étudiant' },
      { code: 'pension', label: 'Pension' },
      { code: 'autres', label: 'Autres' }
    ]
  },
  
  // 4. Parcours professionnel
  // 4.1 Age du premier emploi
  {
    id: 'first_job_age',
    text: 'Âge du premier emploi',
    type: 'single_choice',
    required: false,
    section: 'Parcours professionnel',
    options: [
      { code: 'ne_sais_pas', label: 'Ne sais pas' },
      { code: '<15', label: '<15' },
      ...Array.from({ length: 46 }, (_, i) => ({
        code: String(15 + i),
        label: String(15 + i)
      })),
      { code: '>60', label: '>60' }
    ]
  },
  
  // 4.2 Plus longue période de travail
  {
    id: 'longest_work_period',
    text: "Si la période de travail actuelle n'est pas la plus longue, préciser la durée de la plus longue période de travail (en années)",
    type: 'number',
    required: false,
    section: 'Parcours professionnel',
    min: 0,
    max: 99
  },
  
  // 4.3 Durée totale de travail
  {
    id: 'total_work_duration',
    text: "Estimation de la durée totale de travail sur la vie entière (travail au moins à mi-temps, en années)",
    type: 'number',
    required: false,
    section: 'Parcours professionnel',
    min: 0,
    max: 99
  },
  
  // 5.1 Logement principal
  {
    id: 'housing_type',
    text: 'Logement principal',
    type: 'single_choice',
    required: true,
    section: 'Logement',
    options: [
      { code: 'locataire_auto_finance', label: 'Locataire (loyer auto financé)' },
      { code: 'locataire_tiers_paye', label: 'Locataire (loyer payé par un tiers)' },
      { code: 'proprietaire', label: 'Propriétaire' },
      { code: 'institution', label: 'Institution' },
      { code: 'vit_avec_parents', label: 'Vit avec ses parents' },
      { code: 'foyer_hotel', label: 'Foyer Hôtel' },
      { code: 'foyer_educateur', label: 'Foyer éducateur' },
      { code: 'residence_post_cure', label: 'Résidence post-cure' },
      { code: 'appartement_therapeutique', label: 'Appartement thérapeutique' },
      { code: 'logement_associatif', label: 'Logement associatif' },
      { code: 'autre', label: 'Autre' }
    ]
  },
  
  // 5.2 Mode de vie
  {
    id: 'living_mode',
    text: 'Mode de vie',
    type: 'single_choice',
    required: true,
    section: 'Logement',
    options: [
      { code: 'seul', label: 'Seul' },
      { code: 'chez_parents', label: 'Chez ses parents' },
      { code: 'propre_foyer_familial', label: 'Dans son propre foyer familial' },
      { code: 'chez_enfants', label: 'Chez les enfants' },
      { code: 'chez_famille', label: 'Chez de la famille' },
      { code: 'colocation', label: 'Colocation' },
      { code: 'collectivite', label: 'Collectivité' },
      { code: 'autres', label: 'Autres' }
    ]
  },
  
  // 5.3 Nombre de personnes
  {
    id: 'household_size',
    text: 'Nombre de personnes vivant sous le même toit',
    type: 'number',
    required: true,
    section: 'Logement',
    min: 0,
    max: 99
  },
  
  // 6. Personne avec laquelle vous passez le plus de temps
  {
    id: 'main_companion',
    text: 'Personne avec laquelle vous passez le plus de temps',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'conjoint', label: 'Conjoint' },
      { code: 'mere', label: 'Mère' },
      { code: 'pere', label: 'Père' },
      { code: 'colocataire', label: 'Colocataire' },
      { code: 'ami', label: 'Ami(e)' },
      { code: 'concubin', label: 'Concubin' },
      { code: 'frere_soeur', label: 'Frère-Sœur' },
      { code: 'grand_parent', label: 'Grand-parent' },
      { code: 'autres_apparentes', label: 'Autres apparentés' },
      { code: 'enfant', label: 'Enfant' },
      { code: 'autre', label: 'Autre' }
    ]
  },
  
  // 7. Mesures de protection
  {
    id: 'protection_measures',
    text: 'Mesures de protection',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'aucune', label: 'Aucune' },
      { code: 'curatelle', label: 'Curatelle' },
      { code: 'curatelle_renforcee', label: 'Curatelle renforcée' },
      { code: 'tutelle', label: 'Tutelle' },
      { code: 'sauvegarde_justice', label: 'Sauvegarde de justice' }
    ]
  },
  
  // 8. Arrêt de travail actuel
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
  
  // 9. Arrêt de travail au cours de l'année passée
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
  }
];

export const SOCIAL_DEFINITION: QuestionnaireDefinition = {
  id: 'social',
  code: 'SOCIAL',
  title: 'Évaluation Sociale',
  description: 'Évaluation de la situation sociale et professionnelle du patient',
  questions: SOCIAL_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
