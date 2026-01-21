// ============================================================================
// eFondaMental Platform - Bipolar Followup Evaluation Questionnaires
// Export all followup (semestrial and annual) questionnaire modules
// ============================================================================
//
// Total: 11 questionnaires across 3 modules
// All questionnaires save to bipolar_followup_* tables via bipolar-followup.service.ts
//
// ============================================================================

// DSM5 module (3 questionnaires)
// Semestrial mood and psychotic disorder evaluations
export * as dsm5 from './dsm5';

// Suicide module (2 questionnaires)
// ISA followup and suicide behavior followup
export * as suicide from './suicide';

// Soin Suivi module (6 questionnaires)
// Care follow-up, treatments, and professional status
export * as soinSuivi from './soin-suivi';

// Re-export definitions for easier access
export { 
  HUMEUR_ACTUELS_DEFINITION,
  HUMEUR_ACTUELS_QUESTIONS,
  type BipolarFollowupHumeurActuelsResponse,
  type BipolarFollowupHumeurActuelsResponseInsert
} from './dsm5/humeur-actuels';

export { 
  HUMEUR_DEPUIS_VISITE_DEFINITION,
  HUMEUR_DEPUIS_VISITE_QUESTIONS,
  type BipolarFollowupHumeurDepuisVisiteResponse,
  type BipolarFollowupHumeurDepuisVisiteResponseInsert
} from './dsm5/humeur-depuis-visite';

export { 
  PSYCHOTIQUES_DEFINITION,
  PSYCHOTIQUES_QUESTIONS,
  type BipolarFollowupPsychotiquesResponse,
  type BipolarFollowupPsychotiquesResponseInsert
} from './dsm5/psychotiques';

export { 
  ISA_FOLLOWUP_DEFINITION,
  ISA_FOLLOWUP_QUESTIONS,
  type BipolarFollowupIsaResponse,
  type BipolarFollowupIsaResponseInsert
} from './suicide/isa-followup';

export { 
  SUICIDE_BEHAVIOR_FOLLOWUP_DEFINITION,
  SUICIDE_BEHAVIOR_FOLLOWUP_QUESTIONS,
  type BipolarFollowupSuicideBehaviorResponse,
  type BipolarFollowupSuicideBehaviorResponseInsert
} from './suicide/suicide-behavior-followup';

export { 
  SUIVI_RECOMMANDATIONS_DEFINITION,
  SUIVI_RECOMMANDATIONS_QUESTIONS,
  type BipolarFollowupSuiviRecommandationsResponse,
  type BipolarFollowupSuiviRecommandationsResponseInsert
} from './soin-suivi/suivi-recommandations';

export { 
  RECOURS_AUX_SOINS_DEFINITION,
  RECOURS_AUX_SOINS_QUESTIONS,
  type BipolarFollowupRecoursAuxSoinsResponse,
  type BipolarFollowupRecoursAuxSoinsResponseInsert
} from './soin-suivi/recours-aux-soins';

export { 
  TRAITEMENT_NON_PHARMACOLOGIQUE_DEFINITION,
  TRAITEMENT_NON_PHARMACOLOGIQUE_QUESTIONS,
  type BipolarFollowupTraitementNonPharmaResponse,
  type BipolarFollowupTraitementNonPharmaResponseInsert
} from './soin-suivi/traitement-non-pharmacologique';

export { 
  ARRETS_DE_TRAVAIL_DEFINITION,
  ARRETS_DE_TRAVAIL_QUESTIONS,
  type BipolarFollowupArretsTravailResponse,
  type BipolarFollowupArretsTravailResponseInsert
} from './soin-suivi/arrets-de-travail';

export { 
  SOMATIQUE_CONTRACEPTIF_DEFINITION,
  SOMATIQUE_CONTRACEPTIF_QUESTIONS,
  type BipolarFollowupSomatiqueContraceptifResponse,
  type BipolarFollowupSomatiqueContraceptifResponseInsert
} from './soin-suivi/somatique-contraceptif';

export { 
  STATUT_PROFESSIONNEL_DEFINITION,
  STATUT_PROFESSIONNEL_QUESTIONS,
  type BipolarFollowupStatutProfessionnelResponse,
  type BipolarFollowupStatutProfessionnelResponseInsert
} from './soin-suivi/statut-professionnel';
