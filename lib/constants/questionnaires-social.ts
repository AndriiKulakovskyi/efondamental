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
  {
    id: 'active_work_duration',
    text: 'Depuis combien de temps travaillez-vous de manière consécutive (sans interruption > 6 mois)',
    type: 'single_choice',
    required: true,
    display_if: { '==': [{ var: 'professional_status' }, 'actif'] },
    options: [
      { code: 'moins_1_an', label: '< 1 an' },
      { code: '1_an', label: '1 an' },
      { code: '2_ans', label: '2 ans' },
      { code: '3_ans', label: '3 ans' },
      { code: '4_ans', label: '4 ans' },
      { code: '5_ans', label: '5 ans' },
      { code: '6_ans', label: '6 ans' },
      { code: '7_ans', label: '7 ans' },
      { code: '8_ans', label: '8 ans' },
      { code: '9_ans', label: '9 ans' },
      { code: '10_20_ans', label: 'Entre 10 et 20 ans' },
      { code: '20_30_ans', label: 'Entre 20 et 30 ans' },
      { code: 'plus_30_ans', label: '> 30 ans' }
    ]
  },
  {
    id: 'is_full_time',
    text: 'Est-ce un emploi temps plein',
    type: 'single_choice',
    required: true,
    display_if: { '==': [{ var: 'professional_status' }, 'actif'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'professional_class_active',
    text: 'Donner la classe professionnelle',
    type: 'single_choice',
    required: true,
    display_if: { '==': [{ var: 'professional_status' }, 'actif'] },
    options: [
      { code: 'agriculteur_exploitant', label: 'Agriculteur exploitant' },
      { code: 'artisan', label: 'Artisan' },
      { code: 'cadre_fp_intellectuelle_artistique', label: 'Cadre de la fonction publique, profession intellectuelle et artistique' },
      { code: 'cadre_entreprise', label: "Cadre d'entreprise" },
      { code: 'chef_entreprise_10_plus', label: 'Chef d\'entreprise de 10 salariés ou plus' },
      { code: 'commercant_assimile', label: 'Commerçant et assimilé' },
      { code: 'contremaitre_agent_maitrise', label: 'Contremaître, agent de maîtrise' },
      { code: 'employe_fp', label: 'Employé de la fonction publique' },
      { code: 'employe_administratif_entreprise', label: "Employé administratif d'entreprise" },
      { code: 'employe_commerce', label: 'Employé de commerce' },
      { code: 'ouvrier_qualifie', label: 'Ouvrier qualifié' },
      { code: 'ouvrier_non_qualifie', label: 'Ouvrier non qualifiés' },
      { code: 'ouvrier_agricole', label: 'Ouvrier agricole' },
      { code: 'personnel_service_particuliers', label: 'Personnel de service direct aux particuliers' },
      { code: 'prof_intermediaire_enseignement_sante_fp', label: 'Profession intermédiaire de l\'enseignement, de la santé, de la fonction publique et assimilés' },
      { code: 'prof_intermediaire_admin_com_entreprises', label: 'Profession intermédiaire administrative et commerciale des entreprises' },
      { code: 'profession_liberale_assimile', label: 'Profession libérale et assimilé' },
      { code: 'technicien', label: 'Technicien' }
    ]
  },
  {
    id: 'last_job_end_date',
    text: 'Date de fin du dernier emploi (au moins emploi à mi-temps)',
    type: 'date',
    required: true,
    display_if: { '==': [{ var: 'professional_status' }, 'sans_emploi'] }
  },
  {
    id: 'professional_class_unemployed',
    text: 'Donner la classe professionnelle',
    type: 'single_choice',
    required: true,
    display_if: { '==': [{ var: 'professional_status' }, 'sans_emploi'] },
    options: [
      { code: 'agriculteur_exploitant', label: 'Agriculteur exploitant' },
      { code: 'artisan', label: 'Artisan' },
      { code: 'cadre_fp_intellectuelle_artistique', label: 'Cadre de la fonction publique, profession intellectuelle et artistique' },
      { code: 'cadre_entreprise', label: "Cadre d'entreprise" },
      { code: 'chef_entreprise_10_plus', label: 'Chef d\'entreprise de 10 salariés ou plus' },
      { code: 'commercant_assimile', label: 'Commerçant et assimilé' },
      { code: 'contremaitre_agent_maitrise', label: 'Contremaître, agent de maîtrise' },
      { code: 'employe_fp', label: 'Employé de la fonction publique' },
      { code: 'employe_administratif_entreprise', label: "Employé administratif d'entreprise" },
      { code: 'employe_commerce', label: 'Employé de commerce' },
      { code: 'ouvrier_qualifie', label: 'Ouvrier qualifié' },
      { code: 'ouvrier_non_qualifie', label: 'Ouvrier non qualifiés' },
      { code: 'ouvrier_agricole', label: 'Ouvrier agricole' },
      { code: 'personnel_service_particuliers', label: 'Personnel de service direct aux particuliers' },
      { code: 'prof_intermediaire_enseignement_sante_fp', label: 'Profession intermédiaire de l\'enseignement, de la santé, de la fonction publique et assimilés' },
      { code: 'prof_intermediaire_admin_com_entreprises', label: 'Profession intermédiaire administrative et commerciale des entreprises' },
      { code: 'profession_liberale_assimile', label: 'Profession libérale et assimilé' },
      { code: 'technicien', label: 'Technicien' }
    ]
  },
  {
    id: 'main_income_source',
    text: 'Source principale de revenus',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'salaire', label: 'Salaire' },
      { code: 'rmi_rsa', label: 'RMI/RSA' },
      { code: 'aah', label: 'AAH' },
      { code: 'pension_invalidite', label: "Pension d'invalidité" },
      { code: 'allocations_chomage', label: 'Allocations de chômage' },
      { code: 'apl', label: 'APL' },
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
  {
    id: 'debt_level',
    text: "Niveau d'endettement",
    type: 'single_choice',
    required: false,
    options: [
      { code: 'aucun', label: 'Aucun' },
      { code: 'facile_a_gerer', label: 'Endettement facile à gérer' },
      { code: 'difficile_a_gerer', label: 'Endettement difficile à gérer' },
      { code: 'tres_difficile_a_gerer', label: 'Endettement très difficile à gérer' },
      { code: 'non_renseigne', label: 'Non renseigné' }
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
  {
    id: 'long_term_leave',
    text: 'Longue durée',
    type: 'single_choice',
    required: true,
    display_if: { '==': [{ var: 'current_work_leave' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
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
  },
  {
    id: 'cumulative_leave_weeks',
    text: "Nombre de semaines cumulées sur l'année",
    type: 'number',
    required: true,
    min: 0,
    max: 52,
    display_if: { '==': [{ var: 'past_year_work_leave' }, 'oui'] }
  }
];

export const SOCIAL_DEFINITION: QuestionnaireDefinition = {
  id: 'social',
  code: 'SOCIAL',
  title: 'Évaluation Sociale',
  description: 'Évaluation de la situation sociale et professionnelle du patient',
  questions: SOCIAL_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
