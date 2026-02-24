import { Question, QuestionOption } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaTroublesComorbidsAnnuelResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Troubles anxieux
  rad_tb_anx: string | null;
  chk_troubles_anxieux_choix: string[] | null;
  chk_anxieux_trouble_panique_type: string[] | null;
  rad_anxieux_trouble_panique_agora_debut: string | null;
  rad_anxieux_trouble_panique_agora_mois: string | null;
  rad_anxieux_trouble_panique_sansagora_debut: string | null;
  rad_anxieux_trouble_panique_sansagora_mois: string | null;
  rad_anxieux_agoraphobie_age_debut: string | null;
  rad_anxieux_agoraphobie_symptome_mois_ecoule: string | null;
  rad_anxieux_phobie_sociale_age_debut: string | null;
  rad_anxieux_phobie_sociale_symptome_mois_ecoule: string | null;
  rad_anxieux_phobie_specfique_age_debut: string | null;
  rad_anxieux_phobie_specfique_symptome_mois_ecoule: string | null;
  rad_anxieux_toc_age_debut: string | null;
  rad_anxieux_toc_symptome_mois_ecoule: string | null;
  rad_anxieux_post_trauma_age_debut: string | null;
  rad_anxieux_post_trauma_symptome_mois_ecoule: string | null;
  rad_anxieux_generalise_age_debut: string | null;
  rad_anxieux_generalise_symptome_mois_ecoule: string | null;
  anxieux_affection_medicale: string | null;
  rad_anxieux_affection_medicale_age_debut: string | null;
  rad_anxieux_affection_medicale_symptome_mois_ecoule: string | null;
  anxieux_substance: string | null;
  rad_anxieux_substance_age_debut: string | null;
  rad_anxieux_substance_symptome_mois_ecoule: string | null;
  rad_anxieux_non_specifie_age_debut: string | null;
  rad_anxieux_non_specifie_symptome_mois_ecoule: string | null;
  // Troubles liés à une substance
  rad_tb_subst: string | null;
  chk_substances_type: string[] | null;
  rad_alcool_type: string | null;
  rad_alcool_mois: string | null;
  rad_alcool_age: string | null;
  alcool_dur: string | null;
  rad_sedatif_type: string | null;
  rad_sedatif_mois: string | null;
  rad_sedatif_age: string | null;
  sedatif_dur: string | null;
  rad_cannabis_type: string | null;
  rad_cannabis_mois: string | null;
  rad_cannabis_age: string | null;
  cannabis_dur: string | null;
  rad_stimulants_type: string | null;
  rad_stimulants_mois: string | null;
  rad_stimulants_age: string | null;
  stimulants_dur: string | null;
  rad_opiaces_type: string | null;
  rad_opiaces_mois: string | null;
  rad_opiaces_age: string | null;
  opiaces_dur: string | null;
  rad_cocaine_type: string | null;
  rad_cocaine_mois: string | null;
  rad_cocaine_age: string | null;
  cocaine_dur: string | null;
  rad_hallucinogenes_type: string | null;
  rad_hallucinogenes_mois: string | null;
  rad_hallucinogenes_age: string | null;
  hallucinogene_dur: string | null;
  autresubstance_autre: string | null;
  rad_autresubstance_type: string | null;
  rad_autresubstance_mois: string | null;
  rad_autresubstance_age: string | null;
  autresubstance_dur: string | null;
  rad_tb_substind: string | null;
  chk_tb_substind_sub: string[] | null;
  chk_tb_substind_typ: string[] | null;
  rad_tb_substindpres: string | null;
  // Troubles somatoformes
  rad_tb_somat: string | null;
  rad_somatoforme_type: string | null;
  rad_somatoforme_age_debut: string | null;
  rad_somatoforme_presence_symptomes_mois_ecoule: string | null;
  // Troubles du comportement alimentaire
  rad_tb_alim: string | null;
  rad_conduites_alimentaires_type: string | null;
  rad_conduites_alimentaires_age_debut: string | null;
  rad_conduites_alimentaires_symptomes_mois_ecoule: string | null;
  // Metadata
  completed_by?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SchizophreniaTroublesComorbidsAnnuelResponseInsert = Omit<
  SchizophreniaTroublesComorbidsAnnuelResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
>;

// ============================================================================
// Reusable Option Constants
// ============================================================================

const YES_NO_UNKNOWN: QuestionOption[] = [
  { code: 'Oui', label: 'Oui' },
  { code: 'Non', label: 'Non' },
  { code: 'Ne sais pas', label: 'Ne sais pas' },
];

const ABUSE_DEPENDENCE: QuestionOption[] = [
  { code: 'Abus', label: 'Abus' },
  { code: 'Dépendance', label: 'Dépendance' },
];

function buildAgeOptions(includeExtremes: boolean): QuestionOption[] {
  const opts: QuestionOption[] = [{ code: 'Ne sais pas', label: 'Ne sais pas' }];
  if (includeExtremes) opts.push({ code: '<5', label: '<5' });
  for (let i = 5; i <= 89; i++) {
    opts.push({ code: String(i), label: String(i) });
  }
  if (includeExtremes) opts.push({ code: '>89', label: '>89' });
  return opts;
}

const AGE_OPTIONS = buildAgeOptions(false);
const AGE_OPTIONS_EXTREME = buildAgeOptions(true);

// ============================================================================
// Display-if helpers
// ============================================================================

const SHOW_IF_ANXIETY = { '==': [{ 'var': 'rad_tb_anx' }, 'Oui'] };

function showIfAnxietyChoice(value: string) {
  return { 'and': [SHOW_IF_ANXIETY, { 'in': [value, { 'var': 'chk_troubles_anxieux_choix' }] }] };
}

function showIfPanicSubtype(value: string) {
  return { 'and': [
    showIfAnxietyChoice('Trouble panique'),
    { 'in': [value, { 'var': 'chk_anxieux_trouble_panique_type' }] },
  ] };
}

const SHOW_IF_SUBSTANCE = { '==': [{ 'var': 'rad_tb_subst' }, 'Oui'] };

function showIfSubstanceChoice(value: string) {
  return { 'and': [SHOW_IF_SUBSTANCE, { 'in': [value, { 'var': 'chk_substances_type' }] }] };
}

const SHOW_IF_INDUCED = { 'and': [SHOW_IF_SUBSTANCE, { '==': [{ 'var': 'rad_tb_substind' }, 'Oui'] }] };

const SHOW_IF_SOMAT = { '==': [{ 'var': 'rad_tb_somat' }, 'Oui'] };
const SHOW_IF_ALIM = { '==': [{ 'var': 'rad_tb_alim' }, 'Oui'] };

// ============================================================================
// Anxiety Disorder Labels (used in multi-select and sub-sections)
// ============================================================================

const ANXIETY_DISORDERS = [
  'Trouble panique',
  'Agoraphobie sans trouble panique',
  'Phobie sociale',
  'Phobie spécifique',
  'Trouble obsessionnel compulsif',
  'Stress post-traumatique',
  'Anxiété généralisée (épisode actuel seulement)',
  'Trouble anxieux dû à une affection médicale générale',
  'Trouble anxieux induit par une substance',
  'Trouble anxieux non specifié',
] as const;

const SUBSTANCE_TYPES = [
  'Alcool',
  'Sédatif-Hypnotique-Anxiolytique (Benzodiazépines et apparentés)',
  'Cannabis',
  'Stimulants (Amphétamines - Ritaline - coupe-faim)',
  'Opiacés (Héroïne - Opium - Méthadone)',
  'Cocaïne (cocaïne + feuille de coca - Crack)',
  'Hallucinogène / PCP (Poudre d\'ange - LSD - champignons - Mescaline - MDMA (Ectasy) - Psylocibine)',
  'Autres (Solvants colle - gaz - peinture - nitrite d\'oxyde - Amylnitrite (Poppers))',
] as const;

// ============================================================================
// Questions
// ============================================================================

export const TROUBLES_COMORBIDES_ANNUEL_SZ_QUESTIONS: Question[] = [
  // =========================================================================
  // SECTION 1: Troubles anxieux
  // =========================================================================
  { id: 'section_anxieux', text: 'Troubles anxieux', type: 'section', required: false },
  {
    id: 'rad_tb_anx',
    text: 'Le patient a-t-il un trouble anxieux ?',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN,
  },
  {
    id: 'chk_troubles_anxieux_choix',
    text: 'Troubles anxieux',
    type: 'multiple_choice',
    required: false,
    options: ANXIETY_DISORDERS.map(d => ({ code: d, label: d })),
    display_if: SHOW_IF_ANXIETY,
    indentLevel: 1,
  },

  // --- Trouble panique (index 0) ---
  { id: 'subsection_panique', text: 'Trouble panique', type: 'section', required: false, is_subsection: true, display_if: showIfAnxietyChoice('Trouble panique') },
  {
    id: 'chk_anxieux_trouble_panique_type',
    text: 'Type du trouble panique',
    type: 'multiple_choice',
    required: false,
    options: [
      { code: 'Sans agoraphobie', label: 'Sans agoraphobie' },
      { code: 'Avec agoraphobie', label: 'Avec agoraphobie' },
    ],
    display_if: showIfAnxietyChoice('Trouble panique'),
    indentLevel: 2,
  },
  {
    id: 'rad_anxieux_trouble_panique_sansagora_debut',
    text: 'Sans agoraphobie - Age de début',
    type: 'single_choice',
    required: false,
    options: AGE_OPTIONS_EXTREME,
    display_if: showIfPanicSubtype('Sans agoraphobie'),
    indentLevel: 3,
  },
  {
    id: 'rad_anxieux_trouble_panique_sansagora_mois',
    text: 'Sans agoraphobie - Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN,
    display_if: showIfPanicSubtype('Sans agoraphobie'),
    indentLevel: 3,
  },
  {
    id: 'rad_anxieux_trouble_panique_agora_debut',
    text: 'Avec agoraphobie - Age de début',
    type: 'single_choice',
    required: false,
    options: AGE_OPTIONS_EXTREME,
    display_if: showIfPanicSubtype('Avec agoraphobie'),
    indentLevel: 3,
  },
  {
    id: 'rad_anxieux_trouble_panique_agora_mois',
    text: 'Avec agoraphobie - Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN,
    display_if: showIfPanicSubtype('Avec agoraphobie'),
    indentLevel: 3,
  },

  // --- Agoraphobie sans trouble panique (index 1) ---
  { id: 'subsection_agoraphobie', text: 'Agoraphobie sans trouble panique', type: 'section', required: false, is_subsection: true, display_if: showIfAnxietyChoice('Agoraphobie sans trouble panique') },
  {
    id: 'rad_anxieux_agoraphobie_age_debut',
    text: 'Age de début',
    type: 'single_choice',
    required: false,
    options: AGE_OPTIONS,
    display_if: showIfAnxietyChoice('Agoraphobie sans trouble panique'),
    indentLevel: 2,
  },
  {
    id: 'rad_anxieux_agoraphobie_symptome_mois_ecoule',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN,
    display_if: showIfAnxietyChoice('Agoraphobie sans trouble panique'),
    indentLevel: 2,
  },

  // --- Phobie sociale (index 2) ---
  { id: 'subsection_phobie_sociale', text: 'Phobie sociale', type: 'section', required: false, is_subsection: true, display_if: showIfAnxietyChoice('Phobie sociale') },
  {
    id: 'rad_anxieux_phobie_sociale_age_debut',
    text: 'Age de début',
    type: 'single_choice',
    required: false,
    options: AGE_OPTIONS,
    display_if: showIfAnxietyChoice('Phobie sociale'),
    indentLevel: 2,
  },
  {
    id: 'rad_anxieux_phobie_sociale_symptome_mois_ecoule',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN,
    display_if: showIfAnxietyChoice('Phobie sociale'),
    indentLevel: 2,
  },

  // --- Phobie spécifique (index 3) ---
  { id: 'subsection_phobie_specifique', text: 'Phobie spécifique', type: 'section', required: false, is_subsection: true, display_if: showIfAnxietyChoice('Phobie spécifique') },
  {
    id: 'rad_anxieux_phobie_specfique_age_debut',
    text: 'Age de début',
    type: 'single_choice',
    required: false,
    options: AGE_OPTIONS,
    display_if: showIfAnxietyChoice('Phobie spécifique'),
    indentLevel: 2,
  },
  {
    id: 'rad_anxieux_phobie_specfique_symptome_mois_ecoule',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN,
    display_if: showIfAnxietyChoice('Phobie spécifique'),
    indentLevel: 2,
  },

  // --- Trouble obsessionnel compulsif (index 4) ---
  { id: 'subsection_toc', text: 'Trouble obsessionnel compulsif', type: 'section', required: false, is_subsection: true, display_if: showIfAnxietyChoice('Trouble obsessionnel compulsif') },
  {
    id: 'rad_anxieux_toc_age_debut',
    text: 'Age de début',
    type: 'single_choice',
    required: false,
    options: AGE_OPTIONS,
    display_if: showIfAnxietyChoice('Trouble obsessionnel compulsif'),
    indentLevel: 2,
  },
  {
    id: 'rad_anxieux_toc_symptome_mois_ecoule',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN,
    display_if: showIfAnxietyChoice('Trouble obsessionnel compulsif'),
    indentLevel: 2,
  },

  // --- Stress post-traumatique (index 5) ---
  { id: 'subsection_ptsd', text: 'Stress post-traumatique', type: 'section', required: false, is_subsection: true, display_if: showIfAnxietyChoice('Stress post-traumatique') },
  {
    id: 'rad_anxieux_post_trauma_age_debut',
    text: 'Age de début',
    type: 'single_choice',
    required: false,
    options: AGE_OPTIONS,
    display_if: showIfAnxietyChoice('Stress post-traumatique'),
    indentLevel: 2,
  },
  {
    id: 'rad_anxieux_post_trauma_symptome_mois_ecoule',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN,
    display_if: showIfAnxietyChoice('Stress post-traumatique'),
    indentLevel: 2,
  },

  // --- Anxiété généralisée (index 6) ---
  { id: 'subsection_gad', text: 'Anxiété généralisée (épisode actuel seulement)', type: 'section', required: false, is_subsection: true, display_if: showIfAnxietyChoice('Anxiété généralisée (épisode actuel seulement)') },
  {
    id: 'rad_anxieux_generalise_age_debut',
    text: 'Age de début',
    type: 'single_choice',
    required: false,
    options: AGE_OPTIONS,
    display_if: showIfAnxietyChoice('Anxiété généralisée (épisode actuel seulement)'),
    indentLevel: 2,
  },
  {
    id: 'rad_anxieux_generalise_symptome_mois_ecoule',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN,
    display_if: showIfAnxietyChoice('Anxiété généralisée (épisode actuel seulement)'),
    indentLevel: 2,
  },

  // --- Trouble anxieux dû à une affection médicale générale (index 7) ---
  { id: 'subsection_affection_medicale', text: 'Trouble anxieux dû à une affection médicale générale', type: 'section', required: false, is_subsection: true, display_if: showIfAnxietyChoice('Trouble anxieux dû à une affection médicale générale') },
  {
    id: 'anxieux_affection_medicale',
    text: 'Spécifier l\'affection médicale générale',
    type: 'text',
    required: false,
    display_if: showIfAnxietyChoice('Trouble anxieux dû à une affection médicale générale'),
    indentLevel: 2,
  },
  {
    id: 'rad_anxieux_affection_medicale_age_debut',
    text: 'Age de début',
    type: 'single_choice',
    required: false,
    options: AGE_OPTIONS,
    display_if: showIfAnxietyChoice('Trouble anxieux dû à une affection médicale générale'),
    indentLevel: 2,
  },
  {
    id: 'rad_anxieux_affection_medicale_symptome_mois_ecoule',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN,
    display_if: showIfAnxietyChoice('Trouble anxieux dû à une affection médicale générale'),
    indentLevel: 2,
  },

  // --- Trouble anxieux induit par une substance (index 8) ---
  { id: 'subsection_anxieux_substance', text: 'Trouble anxieux induit par une substance', type: 'section', required: false, is_subsection: true, display_if: showIfAnxietyChoice('Trouble anxieux induit par une substance') },
  {
    id: 'anxieux_substance',
    text: 'Spécifier la substance',
    type: 'text',
    required: false,
    display_if: showIfAnxietyChoice('Trouble anxieux induit par une substance'),
    indentLevel: 2,
  },
  {
    id: 'rad_anxieux_substance_age_debut',
    text: 'Age de début',
    type: 'single_choice',
    required: false,
    options: AGE_OPTIONS,
    display_if: showIfAnxietyChoice('Trouble anxieux induit par une substance'),
    indentLevel: 2,
  },
  {
    id: 'rad_anxieux_substance_symptome_mois_ecoule',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN,
    display_if: showIfAnxietyChoice('Trouble anxieux induit par une substance'),
    indentLevel: 2,
  },

  // --- Trouble anxieux non specifié (index 9) ---
  { id: 'subsection_anxieux_non_specifie', text: 'Trouble anxieux non specifié', type: 'section', required: false, is_subsection: true, display_if: showIfAnxietyChoice('Trouble anxieux non specifié') },
  {
    id: 'rad_anxieux_non_specifie_age_debut',
    text: 'Age de début',
    type: 'single_choice',
    required: false,
    options: AGE_OPTIONS,
    display_if: showIfAnxietyChoice('Trouble anxieux non specifié'),
    indentLevel: 2,
  },
  {
    id: 'rad_anxieux_non_specifie_symptome_mois_ecoule',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN,
    display_if: showIfAnxietyChoice('Trouble anxieux non specifié'),
    indentLevel: 2,
  },

  // =========================================================================
  // SECTION 2: Troubles liés à une substance au cours de la vie entière
  // =========================================================================
  { id: 'section_substances', text: 'Troubles liés à une substance au cours de la vie entière', type: 'section', required: false },
  {
    id: 'rad_tb_subst',
    text: 'Le patient a-t-il ou a-t-il eu un trouble lié à l\'utilisation de substance (abus ou dépendance)',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN,
  },
  {
    id: 'chk_substances_type',
    text: 'Trouble dû à l\'utilisation d\'une substance',
    type: 'multiple_choice',
    required: false,
    options: SUBSTANCE_TYPES.map(s => ({ code: s, label: s })),
    display_if: SHOW_IF_SUBSTANCE,
    indentLevel: 1,
  },

  // --- Alcool (index 0) ---
  { id: 'subsection_alcool', text: 'Alcool', type: 'section', required: false, is_subsection: true, display_if: showIfSubstanceChoice('Alcool') },
  {
    id: 'rad_alcool_type',
    text: 'Type du trouble',
    type: 'single_choice',
    required: false,
    options: ABUSE_DEPENDENCE,
    display_if: showIfSubstanceChoice('Alcool'),
    indentLevel: 2,
  },
  {
    id: 'rad_alcool_mois',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN,
    display_if: showIfSubstanceChoice('Alcool'),
    indentLevel: 2,
  },
  {
    id: 'rad_alcool_age',
    text: 'Age de début',
    type: 'single_choice',
    required: false,
    options: AGE_OPTIONS,
    display_if: showIfSubstanceChoice('Alcool'),
    indentLevel: 2,
  },
  {
    id: 'alcool_dur',
    text: 'Durée cumulée du trouble sur la vie entière en mois',
    type: 'text',
    required: false,
    display_if: showIfSubstanceChoice('Alcool'),
    indentLevel: 2,
  },

  // --- Sédatif-Hypnotique-Anxiolytique (index 1) ---
  { id: 'subsection_sedatif', text: 'Sédatif-Hypnotique-Anxiolytique', type: 'section', required: false, is_subsection: true, display_if: showIfSubstanceChoice(SUBSTANCE_TYPES[1]) },
  {
    id: 'rad_sedatif_type',
    text: 'Type du trouble',
    type: 'single_choice',
    required: false,
    options: ABUSE_DEPENDENCE,
    display_if: showIfSubstanceChoice(SUBSTANCE_TYPES[1]),
    indentLevel: 2,
  },
  {
    id: 'rad_sedatif_mois',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN,
    display_if: showIfSubstanceChoice(SUBSTANCE_TYPES[1]),
    indentLevel: 2,
  },
  {
    id: 'rad_sedatif_age',
    text: 'Age de début',
    type: 'single_choice',
    required: false,
    options: AGE_OPTIONS,
    display_if: showIfSubstanceChoice(SUBSTANCE_TYPES[1]),
    indentLevel: 2,
  },
  {
    id: 'sedatif_dur',
    text: 'Durée cumulée du trouble sur la vie entière en mois',
    type: 'text',
    required: false,
    display_if: showIfSubstanceChoice(SUBSTANCE_TYPES[1]),
    indentLevel: 2,
  },

  // --- Cannabis (index 2) ---
  { id: 'subsection_cannabis', text: 'Cannabis', type: 'section', required: false, is_subsection: true, display_if: showIfSubstanceChoice('Cannabis') },
  {
    id: 'rad_cannabis_type',
    text: 'Type du trouble',
    type: 'single_choice',
    required: false,
    options: ABUSE_DEPENDENCE,
    display_if: showIfSubstanceChoice('Cannabis'),
    indentLevel: 2,
  },
  {
    id: 'rad_cannabis_mois',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN,
    display_if: showIfSubstanceChoice('Cannabis'),
    indentLevel: 2,
  },
  {
    id: 'rad_cannabis_age',
    text: 'Age de début',
    type: 'single_choice',
    required: false,
    options: AGE_OPTIONS,
    display_if: showIfSubstanceChoice('Cannabis'),
    indentLevel: 2,
  },
  {
    id: 'cannabis_dur',
    text: 'Durée cumulée du trouble sur la vie entière en mois',
    type: 'text',
    required: false,
    display_if: showIfSubstanceChoice('Cannabis'),
    indentLevel: 2,
  },

  // --- Stimulants (index 3) ---
  { id: 'subsection_stimulants', text: 'Stimulants (Amphétamines - Ritaline - coupe-faim)', type: 'section', required: false, is_subsection: true, display_if: showIfSubstanceChoice(SUBSTANCE_TYPES[3]) },
  {
    id: 'rad_stimulants_type',
    text: 'Type du trouble',
    type: 'single_choice',
    required: false,
    options: ABUSE_DEPENDENCE,
    display_if: showIfSubstanceChoice(SUBSTANCE_TYPES[3]),
    indentLevel: 2,
  },
  {
    id: 'rad_stimulants_mois',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN,
    display_if: showIfSubstanceChoice(SUBSTANCE_TYPES[3]),
    indentLevel: 2,
  },
  {
    id: 'rad_stimulants_age',
    text: 'Age de début',
    type: 'single_choice',
    required: false,
    options: AGE_OPTIONS,
    display_if: showIfSubstanceChoice(SUBSTANCE_TYPES[3]),
    indentLevel: 2,
  },
  {
    id: 'stimulants_dur',
    text: 'Durée cumulée du trouble sur la vie entière en mois',
    type: 'text',
    required: false,
    display_if: showIfSubstanceChoice(SUBSTANCE_TYPES[3]),
    indentLevel: 2,
  },

  // --- Opiacés (index 4) ---
  { id: 'subsection_opiaces', text: 'Opiacés (Héroïne - Opium - Méthadone)', type: 'section', required: false, is_subsection: true, display_if: showIfSubstanceChoice(SUBSTANCE_TYPES[4]) },
  {
    id: 'rad_opiaces_type',
    text: 'Type du trouble',
    type: 'single_choice',
    required: false,
    options: ABUSE_DEPENDENCE,
    display_if: showIfSubstanceChoice(SUBSTANCE_TYPES[4]),
    indentLevel: 2,
  },
  {
    id: 'rad_opiaces_mois',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN,
    display_if: showIfSubstanceChoice(SUBSTANCE_TYPES[4]),
    indentLevel: 2,
  },
  {
    id: 'rad_opiaces_age',
    text: 'Age de début',
    type: 'single_choice',
    required: false,
    options: AGE_OPTIONS,
    display_if: showIfSubstanceChoice(SUBSTANCE_TYPES[4]),
    indentLevel: 2,
  },
  {
    id: 'opiaces_dur',
    text: 'Durée cumulée du trouble sur la vie entière en mois',
    type: 'text',
    required: false,
    display_if: showIfSubstanceChoice(SUBSTANCE_TYPES[4]),
    indentLevel: 2,
  },

  // --- Cocaïne (index 5) ---
  { id: 'subsection_cocaine', text: 'Cocaïne (cocaïne + feuille de coca - Crack)', type: 'section', required: false, is_subsection: true, display_if: showIfSubstanceChoice(SUBSTANCE_TYPES[5]) },
  {
    id: 'rad_cocaine_type',
    text: 'Type du trouble',
    type: 'single_choice',
    required: false,
    options: ABUSE_DEPENDENCE,
    display_if: showIfSubstanceChoice(SUBSTANCE_TYPES[5]),
    indentLevel: 2,
  },
  {
    id: 'rad_cocaine_mois',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN,
    display_if: showIfSubstanceChoice(SUBSTANCE_TYPES[5]),
    indentLevel: 2,
  },
  {
    id: 'rad_cocaine_age',
    text: 'Age de début',
    type: 'single_choice',
    required: false,
    options: AGE_OPTIONS,
    display_if: showIfSubstanceChoice(SUBSTANCE_TYPES[5]),
    indentLevel: 2,
  },
  {
    id: 'cocaine_dur',
    text: 'Durée cumulée du trouble sur la vie entière en mois',
    type: 'text',
    required: false,
    display_if: showIfSubstanceChoice(SUBSTANCE_TYPES[5]),
    indentLevel: 2,
  },

  // --- Hallucinogène / PCP (index 6) ---
  { id: 'subsection_hallucinogenes', text: 'Hallucinogène / PCP', type: 'section', required: false, is_subsection: true, display_if: showIfSubstanceChoice(SUBSTANCE_TYPES[6]) },
  {
    id: 'rad_hallucinogenes_type',
    text: 'Type du trouble',
    type: 'single_choice',
    required: false,
    options: ABUSE_DEPENDENCE,
    display_if: showIfSubstanceChoice(SUBSTANCE_TYPES[6]),
    indentLevel: 2,
  },
  {
    id: 'rad_hallucinogenes_mois',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN,
    display_if: showIfSubstanceChoice(SUBSTANCE_TYPES[6]),
    indentLevel: 2,
  },
  {
    id: 'rad_hallucinogenes_age',
    text: 'Age de début',
    type: 'single_choice',
    required: false,
    options: AGE_OPTIONS,
    display_if: showIfSubstanceChoice(SUBSTANCE_TYPES[6]),
    indentLevel: 2,
  },
  {
    id: 'hallucinogene_dur',
    text: 'Durée cumulée du trouble sur la vie entière en mois',
    type: 'text',
    required: false,
    display_if: showIfSubstanceChoice(SUBSTANCE_TYPES[6]),
    indentLevel: 2,
  },

  // --- Autres substances (index 7) ---
  { id: 'subsection_autres_substances', text: 'Autres substances', type: 'section', required: false, is_subsection: true, display_if: showIfSubstanceChoice(SUBSTANCE_TYPES[7]) },
  {
    id: 'autresubstance_autre',
    text: 'Spécifier la substance',
    type: 'text',
    required: false,
    display_if: showIfSubstanceChoice(SUBSTANCE_TYPES[7]),
    indentLevel: 2,
  },
  {
    id: 'rad_autresubstance_type',
    text: 'Type du trouble',
    type: 'single_choice',
    required: false,
    options: ABUSE_DEPENDENCE,
    display_if: showIfSubstanceChoice(SUBSTANCE_TYPES[7]),
    indentLevel: 2,
  },
  {
    id: 'rad_autresubstance_mois',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN,
    display_if: showIfSubstanceChoice(SUBSTANCE_TYPES[7]),
    indentLevel: 2,
  },
  {
    id: 'rad_autresubstance_age',
    text: 'Age de début',
    type: 'single_choice',
    required: false,
    options: AGE_OPTIONS,
    display_if: showIfSubstanceChoice(SUBSTANCE_TYPES[7]),
    indentLevel: 2,
  },
  {
    id: 'autresubstance_dur',
    text: 'Durée cumulée du trouble sur la vie entière en mois',
    type: 'text',
    required: false,
    display_if: showIfSubstanceChoice(SUBSTANCE_TYPES[7]),
    indentLevel: 2,
  },

  // --- Trouble induit par une substance (sans abus ni dépendance) ---
  { id: 'subsection_substind', text: 'Trouble induit par une substance (sans abus ni dépendance)', type: 'section', required: false, is_subsection: true, display_if: SHOW_IF_SUBSTANCE },
  {
    id: 'rad_tb_substind',
    text: 'En absence d\'abus ou de dépendance, existe-t-il un trouble induit par une substance',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN,
    display_if: SHOW_IF_SUBSTANCE,
    indentLevel: 1,
  },
  {
    id: 'chk_tb_substind_sub',
    text: 'Type de substance',
    type: 'multiple_choice',
    required: false,
    options: [
      { code: 'Alcool', label: 'Alcool' },
      { code: 'Sédatif - Hypnotique - Anxiolytique', label: 'Sédatif - Hypnotique - Anxiolytique' },
      { code: 'Cannabis', label: 'Cannabis' },
      { code: 'Stimulants', label: 'Stimulants' },
      { code: 'Opiacés', label: 'Opiacés' },
      { code: 'Cocaïne', label: 'Cocaïne' },
      { code: 'Hallucinogène / PCP', label: 'Hallucinogène / PCP' },
      { code: 'Autres substance', label: 'Autres substance' },
    ],
    display_if: SHOW_IF_INDUCED,
    indentLevel: 2,
  },
  {
    id: 'chk_tb_substind_typ',
    text: 'Type de trouble',
    type: 'multiple_choice',
    required: false,
    options: [
      { code: 'Delirium', label: 'Delirium' },
      { code: 'Démence persistante', label: 'Démence persistante' },
      { code: 'Trouble amnésique', label: 'Trouble amnésique' },
      { code: 'Trouble psychotique', label: 'Trouble psychotique' },
      { code: 'Trouble de l\'humeur', label: 'Trouble de l\'humeur' },
      { code: 'Trouble anxieux', label: 'Trouble anxieux' },
      { code: 'Trouble du sommeil', label: 'Trouble du sommeil' },
      { code: 'Trouble persistant des perceptions liés aux hallucinogènes', label: 'Trouble persistant des perceptions liés aux hallucinogènes' },
    ],
    display_if: SHOW_IF_INDUCED,
    indentLevel: 2,
  },
  {
    id: 'rad_tb_substindpres',
    text: 'Présence de symptômes dans le mois écoulé',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN,
    display_if: SHOW_IF_INDUCED,
    indentLevel: 2,
  },

  // =========================================================================
  // SECTION 3: Troubles somatoformes
  // =========================================================================
  { id: 'section_somatoformes', text: 'Troubles somatoformes', type: 'section', required: false },
  {
    id: 'rad_tb_somat',
    text: 'Le patient a-t-il un trouble somatoforme ?',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN,
  },
  {
    id: 'rad_somatoforme_type',
    text: 'Type du trouble somatoforme',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Trouble de somatisation', label: 'Trouble de somatisation' },
      { code: 'Trouble douloureux', label: 'Trouble douloureux' },
      { code: 'Trouble somatoforme indifférencié', label: 'Trouble somatoforme indifférencié' },
      { code: 'Hypocondrie', label: 'Hypocondrie' },
      { code: 'Peur d\'une dysmorphie corporelle', label: 'Peur d\'une dysmorphie corporelle' },
    ],
    display_if: SHOW_IF_SOMAT,
    indentLevel: 1,
  },
  {
    id: 'rad_somatoforme_age_debut',
    text: 'Age de début',
    type: 'single_choice',
    required: false,
    options: AGE_OPTIONS,
    display_if: SHOW_IF_SOMAT,
    indentLevel: 1,
  },
  {
    id: 'rad_somatoforme_presence_symptomes_mois_ecoule',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN,
    display_if: SHOW_IF_SOMAT,
    indentLevel: 1,
  },

  // =========================================================================
  // SECTION 4: Troubles du comportement alimentaire
  // =========================================================================
  { id: 'section_alimentaires', text: 'Troubles du comportement alimentaire', type: 'section', required: false },
  {
    id: 'rad_tb_alim',
    text: 'Le patient a-t-il un trouble du comportement alimentaire ?',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN,
  },
  {
    id: 'rad_conduites_alimentaires_type',
    text: 'Type du trouble du comportement alimentaire',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Anorexie type restrictive', label: 'Anorexie type restrictive' },
      { code: 'Anorexie type boulimie', label: 'Anorexie type boulimie' },
      { code: 'Hyperphagie boulimique', label: 'Hyperphagie boulimique' },
      { code: 'Boulimie seule', label: 'Boulimie seule' },
      { code: 'Trouble des conduites alimentaires non spécifié', label: 'Trouble des conduites alimentaires non spécifié' },
    ],
    display_if: SHOW_IF_ALIM,
    indentLevel: 1,
  },
  {
    id: 'rad_conduites_alimentaires_age_debut',
    text: 'Age de début',
    type: 'single_choice',
    required: false,
    options: AGE_OPTIONS,
    display_if: SHOW_IF_ALIM,
    indentLevel: 1,
  },
  {
    id: 'rad_conduites_alimentaires_symptomes_mois_ecoule',
    text: 'Présence de symptômes le mois écoulé',
    type: 'single_choice',
    required: false,
    options: YES_NO_UNKNOWN,
    display_if: SHOW_IF_ALIM,
    indentLevel: 1,
  },
];

// ============================================================================
// Definition
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
    [key: string]: any;
  };
}

export const TROUBLES_COMORBIDES_ANNUEL_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'troubles_comorbides_annuel_sz',
  code: 'TROUBLES_COMORBIDES_ANNUEL_SZ',
  title: 'Troubles comorbides',
  description: 'Évaluation des comorbidités psychiatriques incluant les troubles anxieux (DSM-IV-TR), les troubles liés à une substance, les troubles somatoformes et les troubles du comportement alimentaire.',
  questions: TROUBLES_COMORBIDES_ANNUEL_SZ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: '1.0',
    language: 'fr-FR',
  },
};
