// eFondaMental Platform - Schizophrenia Questionnaire Service
// DEPRECATED: This file is kept for backwards compatibility.
// All functions have been migrated to:
// - lib/services/schizophrenia-screening.service.ts (for screening questionnaires)
// - lib/services/schizophrenia-initial.service.ts (for initial evaluation questionnaires)
//
// The old responses_* tables have been dropped.
// Data has been migrated to schizophrenia_* tables.

// Re-export from new services for backwards compatibility
export {
  // Screening service exports
  saveSchizophreniaScreeningDiagnosticResponse as saveScreeningSzDiagnosticResponse,
  saveSchizophreniaScreeningOrientationResponse as saveScreeningSzOrientationResponse,
  getSchizophreniaScreeningDiagnosticResponse as getScreeningSzDiagnosticResponse,
  getSchizophreniaScreeningOrientationResponse as getScreeningSzOrientationResponse,
} from './schizophrenia-screening.service';

export {
  // Initial evaluation service exports - generic
  getSchizophreniaInitialResponse,
  saveSchizophreniaInitialResponse,
  SCHIZOPHRENIA_INITIAL_TABLES,
  // Convenience functions
  getDossierInfirmierSzResponse,
  getBilanBiologiqueSzResponse,
  getPanssResponse,
  getCdssResponse,
  getBarsResponse,
  getSumdResponse,
  getAimsResponse,
  getBarnesResponse,
  getSasResponse,
  getSapsResponse,
  getSansResponse,
  getUkuResponse,
  getPspResponse,
  getTroublesPsychotiquesInitialResponse,
  getTroublesPsychotiquesAnnuelResponse,
  getComportementsViolentsSzResponse,
  getTroublesComorbidesSzResponse,
  getTroublesComorbidsAnnuelSzResponse,
  getIsaSzResponse,
  getIsaSuiviSzResponse,
  getSuicideHistorySzResponse,
  getSuicideHistorySuiviSzResponse,
  getAntecedentsFamiliauxPsySzResponse,
  getPerinataliteSzResponse,
  getTeaCoffeeSzResponse,
  getEvalAddictologiqueSzResponse,
  getEcvResponse,
  getBilanSocialSzResponse,
  getSqolResponse,
  // Specialized save functions with scoring
  savePanssResponse,
  saveCdssResponse,
  saveBarsResponse,
  saveSumdResponse,
  saveAimsResponse,
  saveBarnesResponse,
  saveSasResponse,
  saveSapsResponse,
  saveSansResponse,
  saveUkuResponse,
  savePspResponse,
  saveDossierInfirmierSzResponse,
  saveBilanBiologiqueSzResponse,
  saveEvalAddictologiqueSzResponse,
} from './schizophrenia-initial.service';

// Legacy function aliases with deprecation warnings
// These are kept for any code that might still reference the old function names

import {
  saveSchizophreniaInitialResponse,
} from './schizophrenia-initial.service';

/** @deprecated Use saveSchizophreniaInitialResponse('TROUBLES_PSYCHOTIQUES', ...) instead */
export async function saveTroublesPsychotiquesResponse(response: any) {
  console.warn('saveTroublesPsychotiquesResponse is deprecated. Use saveSchizophreniaInitialResponse instead.');
  return saveSchizophreniaInitialResponse('TROUBLES_PSYCHOTIQUES', response);
}

/** @deprecated Use saveSchizophreniaInitialResponse('TROUBLES_COMORBIDES_SZ', ...) instead */
export async function saveTroublesComorbidesSzResponse(response: any) {
  console.warn('saveTroublesComorbidesSzResponse is deprecated. Use saveSchizophreniaInitialResponse instead.');
  return saveSchizophreniaInitialResponse('TROUBLES_COMORBIDES_SZ', response);
}

/** @deprecated Use saveSchizophreniaInitialResponse('SUICIDE_HISTORY_SZ', ...) instead */
export async function saveSuicideHistorySzResponse(response: any) {
  console.warn('saveSuicideHistorySzResponse is deprecated. Use saveSchizophreniaInitialResponse instead.');
  return saveSchizophreniaInitialResponse('SUICIDE_HISTORY_SZ', response);
}

/** @deprecated Use saveSchizophreniaInitialResponse('ANTECEDENTS_FAMILIAUX_PSY_SZ', ...) instead */
export async function saveAntecedentsFamiliauxPsySzResponse(response: any) {
  console.warn('saveAntecedentsFamiliauxPsySzResponse is deprecated. Use saveSchizophreniaInitialResponse instead.');
  return saveSchizophreniaInitialResponse('ANTECEDENTS_FAMILIAUX_PSY_SZ', response);
}

/** @deprecated Use saveSchizophreniaInitialResponse('PERINATALITE_SZ', ...) instead */
export async function savePerinataliteSzResponse(response: any) {
  console.warn('savePerinataliteSzResponse is deprecated. Use saveSchizophreniaInitialResponse instead.');
  return saveSchizophreniaInitialResponse('PERINATALITE_SZ', response);
}

/** @deprecated Use saveSchizophreniaInitialResponse('TEA_COFFEE_SZ', ...) instead */
export async function saveTeaCoffeeSzResponse(response: any) {
  console.warn('saveTeaCoffeeSzResponse is deprecated. Use saveSchizophreniaInitialResponse instead.');
  return saveSchizophreniaInitialResponse('TEA_COFFEE_SZ', response);
}

/** @deprecated Use saveSchizophreniaInitialResponse('ECV', ...) instead */
export async function saveEcvResponse(response: any) {
  console.warn('saveEcvResponse is deprecated. Use saveSchizophreniaInitialResponse instead.');
  return saveSchizophreniaInitialResponse('ECV', response);
}
