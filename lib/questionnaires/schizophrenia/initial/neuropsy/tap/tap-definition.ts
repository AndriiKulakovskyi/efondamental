// eFondaMental Platform - TEA/TAP Definition
// Schizophrenia Initial Evaluation - Neuropsy Module
// Combined questionnaire for TAP Attention soutenue + TAP Flexibilité

export interface TapQuestionnaireDefinition {
  id: string;
  code: string;
  title: string;
  description: string;
  instructions?: string;
  questions: never[];
  metadata?: {
    singleColumn?: boolean;
    pathologies?: string[];
    target_role?: 'patient' | 'healthcare_professional';
    reference?: string;
    customRenderer?: boolean;
    [key: string]: any;
  };
}

export const TAP_SZ_DEFINITION: TapQuestionnaireDefinition = {
  id: 'tap_sz',
  code: 'TAP_SZ',
  title: 'TEA/TAP',
  description: 'Test of Attentional Performance (Zimmermann & Fimm) - Attention soutenue et Flexibilité. Import des résultats via fichier RTF ou saisie manuelle.',
  instructions: 'Importez les fichiers RTF générés par le logiciel TAP pour chaque sous-test, ou saisissez les valeurs manuellement dans les tableaux.',
  questions: [],
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    reference: 'Zimmermann, P. & Fimm, B. (2002). Test of Attentional Performance (TAP).',
    customRenderer: true,
  },
};
