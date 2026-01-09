// eFondaMental Platform - Follow-up Questionnaires
// Module: Soin, suivi et arret de travail
// Contains: Suivi des recommandations, Recours aux soins, Traitement non-pharmacologique,
//           Arrets de travail, Somatique et contraceptif, Statut professionnel

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from './questionnaires';

// ============================================================================
// SUIVI DES RECOMMANDATIONS (Questionnaire 2)
// ============================================================================

export const SUIVI_RECOMMANDATIONS_QUESTIONS: Question[] = [
  {
    id: 'rad_suivi_recom_medicamenteux',
    text: 'Suivi des recommandations faites au cours de la première évaluation pour le traitement médicamenteux',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Complètement suivi', label: 'Complètement suivi' },
      { code: 'Partiellement suivi', label: 'Partiellement suivi' },
      { code: 'Non suivi', label: 'Non suivi' }
    ]
  },
  {
    id: 'rad_suivi_recom_medicamenteux_non',
    text: 'Précisez pourquoi les recommandations n\'ont pas été suivies',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: {
      'in': [{ var: 'rad_suivi_recom_medicamenteux' }, ['Partiellement suivi', 'Non suivi']]
    },
    options: [
      { code: 'Refus du patient', label: 'Refus du patient' },
      { code: 'Désaccord du médecin pratiquant le suivi', label: 'Désaccord du médecin pratiquant le suivi' },
      { code: 'Problème de tolérance', label: 'Problème de tolérance' },
      { code: 'Problème de rechute', label: 'Problème de rechute' },
      { code: 'Autres', label: 'Autres' }
    ]
  },
  {
    id: 'rad_suivi_recom_non_medicamenteux',
    text: 'Suivi des recommandations faites au cours de la première évaluation pour les traitements non médicamenteux',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Complètement suivi', label: 'Complètement suivi' },
      { code: 'Partiellement suivi', label: 'Partiellement suivi' },
      { code: 'Non suivi', label: 'Non suivi' }
    ]
  },
  {
    id: 'rad_suivi_recom_non_medicamenteux_non',
    text: 'Précisez pourquoi les recommandations n\'ont pas été suivies',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: {
      'in': [{ var: 'rad_suivi_recom_non_medicamenteux' }, ['Partiellement suivi', 'Non suivi']]
    },
    options: [
      { code: 'Refus du patient', label: 'Refus du patient' },
      { code: 'Désaccord avec le médecin pratiquant le suivi', label: 'Désaccord avec le médecin pratiquant le suivi' },
      { code: 'Impossible à mettre en place', label: 'Impossible à mettre en place' },
      { code: 'Autres', label: 'Autres' }
    ]
  }
];

export const SUIVI_RECOMMANDATIONS_DEFINITION: QuestionnaireDefinition = {
  id: 'suivi_recommandations',
  code: 'SUIVI_RECOMMANDATIONS',
  title: 'Suivi des recommandations',
  description: 'Évaluation du suivi des recommandations médicamenteuses et non-médicamenteuses faites lors de l\'évaluation initiale',
  questions: SUIVI_RECOMMANDATIONS_QUESTIONS,
  metadata: {
    singleColumn: true,
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// RECOURS AUX SOINS (Questionnaire 3)
// ============================================================================

export const RECOURS_AUX_SOINS_QUESTIONS: Question[] = [
  // Section 1: Suivi habituel
  {
    id: 'section_suivi_habituel',
    text: 'Recours aux soins - Suivi habituel',
    type: 'section',
    required: false
  },
  {
    id: 'rad_recours_soin_psy',
    text: 'Recours aux systèmes de soins pour troubles psychiatriques depuis la dernière visite selon le suivi habituel',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },
  {
    id: 'rad_recours_soin_psy_generaliste',
    text: 'Consultations chez un médecin généraliste',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_recours_soin_psy' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },
  {
    id: 'recours_soin_psy_generaliste_nb',
    text: 'Nombre de consultations',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 2,
    display_if: { '==': [{ var: 'rad_recours_soin_psy_generaliste' }, 'Oui'] }
  },
  {
    id: 'rad_recours_soin_psy_psychiatre',
    text: 'Consultations chez un médecin psychiatre',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_recours_soin_psy' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },
  {
    id: 'recours_soin_psy_psychiatre_nb',
    text: 'Nombre de consultations',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 2,
    display_if: { '==': [{ var: 'rad_recours_soin_psy_psychiatre' }, 'Oui'] }
  },
  {
    id: 'rad_recours_soin_psy_psychologue',
    text: 'Consultations chez un psychologue',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_recours_soin_psy' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },
  {
    id: 'recours_soin_psy_psychologue_nb',
    text: 'Nombre de consultations',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 2,
    display_if: { '==': [{ var: 'rad_recours_soin_psy_psychologue' }, 'Oui'] }
  },
  {
    id: 'rad_recours_soin_psy_plusieurs',
    text: 'Consultations chez un ou plusieurs médecins spécialistes en lien avec la pathologie ou son traitement',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_recours_soin_psy' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },
  {
    id: 'recours_soin_psy_plusieurs_nb',
    text: 'Nombre de consultations',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 2,
    display_if: { '==': [{ var: 'rad_recours_soin_psy_plusieurs' }, 'Oui'] }
  },
  {
    id: 'rad_recours_soin_psy_autres',
    text: 'Consultations autres en lien avec la pathologie ou son traitement (diététicien, infirmier…)',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_recours_soin_psy' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },
  {
    id: 'recours_soin_psy_autres_nb',
    text: 'Nombre de consultations',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 2,
    display_if: { '==': [{ var: 'rad_recours_soin_psy_autres' }, 'Oui'] }
  },
  
  // Section 2: Urgence
  {
    id: 'section_urgence',
    text: 'Recours aux soins - Urgence',
    type: 'section',
    required: false
  },
  {
    id: 'rad_recours_soin_urgence',
    text: 'Recours aux soins non programmé et/ou en urgence',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },
  {
    id: 'rad_recours_soin_urgence_sans_hosp',
    text: 'Passage aux urgences pour troubles psychiatrique sans hospitalisation',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_recours_soin_urgence' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },
  {
    id: 'recours_soin_urgence_sans_hosp_nb',
    text: 'Nombre de passages',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 2,
    display_if: { '==': [{ var: 'rad_recours_soin_urgence_sans_hosp' }, 'Oui'] }
  },
  {
    id: 'rad_recours_soin_urgence_generaliste',
    text: 'Consultations chez un médecin généraliste',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_recours_soin_urgence' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },
  {
    id: 'recours_soin_urgence_generaliste_nb',
    text: 'Nombre de consultations',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 2,
    display_if: { '==': [{ var: 'rad_recours_soin_urgence_generaliste' }, 'Oui'] }
  },
  {
    id: 'rad_recours_soin_urgence_psychiatre',
    text: 'Consultations chez un médecin psychiatre',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_recours_soin_urgence' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },
  {
    id: 'recours_soin_urgence_psychiatre_nb',
    text: 'Nombre de consultations',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 2,
    display_if: { '==': [{ var: 'rad_recours_soin_urgence_psychiatre' }, 'Oui'] }
  },
  {
    id: 'rad_recours_soin_urgence_psychologue',
    text: 'Consultations chez un psychologue',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_recours_soin_urgence' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },
  {
    id: 'recours_soin_urgence_psychologue_nb',
    text: 'Nombre de consultations',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 2,
    display_if: { '==': [{ var: 'rad_recours_soin_urgence_psychologue' }, 'Oui'] }
  },
  {
    id: 'rad_recours_soin_urgence_plusieurs',
    text: 'Consultations chez un ou plusieurs médecins spécialistes en lien avec la pathologie ou son traitement',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_recours_soin_urgence' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },
  {
    id: 'recours_soin_urgence_plusieurs_nb',
    text: 'Nombre de consultations',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 2,
    display_if: { '==': [{ var: 'rad_recours_soin_urgence_plusieurs' }, 'Oui'] }
  },
  {
    id: 'rad_recours_soin_urgence_autres',
    text: 'Consultations autres en lien avec la pathologie ou son traitement (diététicien, infirmier…)',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_recours_soin_urgence' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },
  {
    id: 'recours_soin_urgence_autres_nb',
    text: 'Nombre de consultations',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 2,
    display_if: { '==': [{ var: 'rad_recours_soin_urgence_autres' }, 'Oui'] }
  }
];

export const RECOURS_AUX_SOINS_DEFINITION: QuestionnaireDefinition = {
  id: 'recours_aux_soins',
  code: 'RECOURS_AUX_SOINS',
  title: 'Recours aux soins',
  description: 'Documentation des consultations et recours aux soins psychiatriques depuis la dernière visite',
  questions: RECOURS_AUX_SOINS_QUESTIONS,
  metadata: {
    singleColumn: true,
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// TRAITEMENT NON-PHARMACOLOGIQUE (Questionnaire 5)
// ============================================================================

export const TRAITEMENT_NON_PHARMACOLOGIQUE_QUESTIONS: Question[] = [
  {
    id: 'rad_non_pharmacologique',
    text: 'Avez-vous bénéficié d\'un traitement non pharmacologique depuis la dernière visite',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' },
      { code: 'Ne sais pas', label: 'Ne sais pas' }
    ]
  },
  
  // Sismothérapie
  {
    id: 'section_sismo',
    text: 'Sismothérapie',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'rad_non_pharmacologique' }, 'Oui'] }
  },
  {
    id: 'rad_non_pharmacologique_sismo',
    text: 'Sismothérapie',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'rad_non_pharmacologique' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' },
      { code: 'Ne sais pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'non_pharmacologique_sismo_nb',
    text: 'Nombre de séances',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_sismo' }, 'Oui'] }
  },
  {
    id: 'date_non_pharmacologique_sismo_debut',
    text: 'Date de début',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_sismo' }, 'Oui'] }
  },
  {
    id: 'date_non_pharmacologique_sismo_fin',
    text: 'Date de fin',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_sismo' }, 'Oui'] }
  },
  
  // TMS
  {
    id: 'section_tms',
    text: 'TMS',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'rad_non_pharmacologique' }, 'Oui'] }
  },
  {
    id: 'rad_non_pharmacologique_tms',
    text: 'TMS',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'rad_non_pharmacologique' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' },
      { code: 'Ne sais pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'non_pharmacologique_tms_nb',
    text: 'Nombre de séances',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_tms' }, 'Oui'] }
  },
  {
    id: 'date_non_pharmacologique_tms_debut',
    text: 'Date de début',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_tms' }, 'Oui'] }
  },
  {
    id: 'date_non_pharmacologique_tms_fin',
    text: 'Date de fin',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_tms' }, 'Oui'] }
  },
  
  // TCC
  {
    id: 'section_tcc',
    text: 'TCC',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'rad_non_pharmacologique' }, 'Oui'] }
  },
  {
    id: 'rad_non_pharmacologique_tcc',
    text: 'TCC',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'rad_non_pharmacologique' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' },
      { code: 'Ne sais pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'non_pharmacologique_tcc_nb',
    text: 'Nombre de séances',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_tcc' }, 'Oui'] }
  },
  {
    id: 'date_non_pharmacologique_tcc_debut',
    text: 'Date de début',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_tcc' }, 'Oui'] }
  },
  {
    id: 'date_non_pharmacologique_tcc_fin',
    text: 'Date de fin',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_tcc' }, 'Oui'] }
  },
  
  // Psychoéducation
  {
    id: 'section_psychoed',
    text: 'Groupes de psychoéducation',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'rad_non_pharmacologique' }, 'Oui'] }
  },
  {
    id: 'rad_non_pharmacologique_psychoed',
    text: 'Groupes de psychoéducation',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'rad_non_pharmacologique' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' },
      { code: 'Ne sais pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'non_pharmacologique_psychoed_nb',
    text: 'Nombre de séances',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_psychoed' }, 'Oui'] }
  },
  {
    id: 'date_non_pharmacologique_psychoed_debut',
    text: 'Date de début',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_psychoed' }, 'Oui'] }
  },
  {
    id: 'date_non_pharmacologique_psychoed_fin',
    text: 'Date de fin',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_psychoed' }, 'Oui'] }
  },
  
  // IPSRT
  {
    id: 'section_ipsrt',
    text: 'IPSRT',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'rad_non_pharmacologique' }, 'Oui'] }
  },
  {
    id: 'rad_non_pharmacologique_ipsrt',
    text: 'IPSRT',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'rad_non_pharmacologique' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' },
      { code: 'Ne sais pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'non_pharmacologique_ipsrt_nb',
    text: 'Nombre de séances',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_ipsrt' }, 'Oui'] }
  },
  {
    id: 'chk_non_pharmacologique_ipsrt_precisez',
    text: 'Précisez',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_ipsrt' }, 'Oui'] },
    options: [
      { code: 'En groupe', label: 'En groupe' },
      { code: 'En individuel', label: 'En individuel' },
      { code: 'Ne sais pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'date_non_pharmacologique_ipsrt_debut',
    text: 'Date de début',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_ipsrt' }, 'Oui'] }
  },
  {
    id: 'date_non_pharmacologique_ipsrt_fin',
    text: 'Date de fin',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_ipsrt' }, 'Oui'] }
  },
  
  // Autre
  {
    id: 'section_autre',
    text: 'Autre',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'rad_non_pharmacologique' }, 'Oui'] }
  },
  {
    id: 'rad_non_pharmacologique_autre',
    text: 'Autre',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'rad_non_pharmacologique' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' },
      { code: 'Ne sais pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'non_pharmacologique_autre_precisez',
    text: 'Précisez',
    type: 'text',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_autre' }, 'Oui'] }
  },
  {
    id: 'non_pharmacologique_autre_nb',
    text: 'Nombre de séances',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_autre' }, 'Oui'] }
  },
  {
    id: 'date_non_pharmacologique_autre_debut',
    text: 'Date de début',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_autre' }, 'Oui'] }
  },
  {
    id: 'date_non_pharmacologique_autre_fin',
    text: 'Date de fin',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_autre' }, 'Oui'] }
  }
];

export const TRAITEMENT_NON_PHARMACOLOGIQUE_DEFINITION: QuestionnaireDefinition = {
  id: 'traitement_non_pharmacologique',
  code: 'TRAITEMENT_NON_PHARMACOLOGIQUE',
  title: 'Traitement non-pharmacologique',
  description: 'Suivi des traitements non-pharmacologiques reçus depuis la dernière visite',
  questions: TRAITEMENT_NON_PHARMACOLOGIQUE_QUESTIONS,
  metadata: {
    singleColumn: true,
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// ARRETS DE TRAVAIL (Questionnaire 6)
// ============================================================================

export const ARRETS_DE_TRAVAIL_QUESTIONS: Question[] = [
  {
    id: 'rad_arret_travail',
    text: 'Etes vous ou avez-vous été en arrêt de travail depuis la dernière visite en lien avec un trouble psychiatrique ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' },
      { code: 'Non applicable', label: 'Non applicable' }
    ]
  },
  {
    id: 'arret_travail_nb',
    text: 'Nombre d\'arrêts de travail',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_arret_travail' }, 'Oui'] }
  },
  {
    id: 'arret_travail_duree',
    text: 'Durée totale des arrêts de travail (en semaines)',
    type: 'number',
    required: false,
    min: 0,
    max: 52,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_arret_travail' }, 'Oui'] }
  }
];

export const ARRETS_DE_TRAVAIL_DEFINITION: QuestionnaireDefinition = {
  id: 'arrets_de_travail',
  code: 'ARRETS_DE_TRAVAIL',
  title: 'Arrêts de travail',
  description: 'Documentation des arrêts de travail liés aux troubles psychiatriques depuis la dernière visite',
  questions: ARRETS_DE_TRAVAIL_QUESTIONS,
  metadata: {
    singleColumn: true,
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// SOMATIQUE ET CONTRACEPTIF (Questionnaire 7)
// ============================================================================

export const SOMATIQUE_CONTRACEPTIF_QUESTIONS: Question[] = [
  {
    id: 'fckedit_somatique_contraceptif',
    text: 'Lister le nom des traitements somatiques au cours de la vie entière et les contraceptifs ainsi que la date de début et nombre cumulé de mois d\'exposition',
    type: 'text',
    required: false,
    help: 'Entrez les informations de manière structurée: nom du traitement, date de début, durée d\'exposition en mois'
  }
];

export const SOMATIQUE_CONTRACEPTIF_DEFINITION: QuestionnaireDefinition = {
  id: 'somatique_contraceptif',
  code: 'SOMATIQUE_ET_CONTRACEPTIF',
  title: 'Somatique et contraceptif',
  description: 'Documentation des traitements somatiques et contraceptifs',
  questions: SOMATIQUE_CONTRACEPTIF_QUESTIONS,
  metadata: {
    singleColumn: true,
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// STATUT PROFESSIONNEL (Questionnaire 8)
// ============================================================================

export const STATUT_PROFESSIONNEL_QUESTIONS: Question[] = [
  {
    id: 'rad_changement_statut',
    text: 'Y-a-t-il eu un changement de votre statut professionnel depuis la dernière visite?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' },
      { code: 'Ne sais pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'rad_statut_actuel',
    text: 'Quel est votre statut actuel?',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_changement_statut' }, 'Oui'] },
    options: [
      { code: 'Sans emploi', label: 'Sans emploi' },
      { code: 'Actif', label: 'Actif' },
      { code: 'Retraité', label: 'Retraité' },
      { code: 'Etudiant', label: 'Etudiant' },
      { code: 'Pension', label: 'Pension' },
      { code: 'Au foyer', label: 'Au foyer' },
      { code: 'Autres', label: 'Autres' }
    ]
  },
  {
    id: 'statut_actuel_autre',
    text: 'Précisez',
    type: 'text',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'rad_statut_actuel' }, 'Autres'] }
  },
  {
    id: 'rad_social_stprof_class',
    text: 'Donner la classe professionnelle',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    help: 'INSEE : PCS 2003 - Niveau 2 - Liste des catégories socioprofessionnelles',
    display_if: { '==': [{ var: 'rad_statut_actuel' }, 'Actif'] },
    options: [
      { code: 'Agriculteur exploitant', label: 'Agriculteur exploitant' },
      { code: 'Artisan', label: 'Artisan' },
      { code: 'Cadre de la fonction publique, profession intellectuelle et artistique', label: 'Cadre de la fonction publique, profession intellectuelle et artistique' },
      { code: 'Cadre d\'entreprise', label: 'Cadre d\'entreprise' },
      { code: 'Chef d\'entreprise de 10 salariés ou plus', label: 'Chef d\'entreprise de 10 salariés ou plus' },
      { code: 'Commerçant et assimilé', label: 'Commerçant et assimilé' },
      { code: 'Contremaître, agent de maîtrise', label: 'Contremaître, agent de maîtrise' },
      { code: 'Employé de la fonction publique', label: 'Employé de la fonction publique' },
      { code: 'Employé administratif d\'entreprise', label: 'Employé administratif d\'entreprise' },
      { code: 'Employé de commerce', label: 'Employé de commerce' },
      { code: 'Ouvrier qualifié', label: 'Ouvrier qualifié' },
      { code: 'Ouvrier non qualifiés', label: 'Ouvrier non qualifiés' },
      { code: 'Ouvrier agricole', label: 'Ouvrier agricole' },
      { code: 'Personnel de service direct aux particuliers', label: 'Personnel de service direct aux particuliers' },
      { code: 'Profession intermédiaire de l\'enseignement, de la santé, de la fonction publique et assimilés', label: 'Profession intermédiaire de l\'enseignement, de la santé, de la fonction publique et assimilés' },
      { code: 'Profession intermédiaire administrative et commerciale des entreprises', label: 'Profession intermédiaire administrative et commerciale des entreprises' },
      { code: 'Profession libérale et assimilé', label: 'Profession libérale et assimilé' },
      { code: 'Technicien', label: 'Technicien' }
    ]
  }
];

export const STATUT_PROFESSIONNEL_DEFINITION: QuestionnaireDefinition = {
  id: 'statut_professionnel',
  code: 'STATUT_PROFESSIONNEL',
  title: 'Statut professionnel',
  description: 'Suivi des changements de statut professionnel depuis la dernière visite',
  questions: STATUT_PROFESSIONNEL_QUESTIONS,
  metadata: {
    singleColumn: true,
    target_role: 'healthcare_professional'
  }
};
