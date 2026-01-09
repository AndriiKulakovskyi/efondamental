-- eFondaMental Platform - Psy Traitement Semestriel Migration
-- Module: Soin, suivi et arret de travail
-- Contains: Suivi des recommandations, Recours aux soins, Traitement non-pharmacologique,
--           Arrets de travail, Somatique et contraceptif, Statut professionnel

-- ============================================================================
-- Create Psy Traitement Semestriel Table
-- ============================================================================

CREATE TABLE responses_psy_traitement_semestriel (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- ========================================================================
    -- SUIVI DES RECOMMANDATIONS (Questionnaire 2)
    -- ========================================================================
    
    -- Q1: Suivi des recommandations médicamenteuses
    rad_suivi_recom_medicamenteux VARCHAR(30) CHECK (rad_suivi_recom_medicamenteux IN (
        'Complètement suivi', 'Partiellement suivi', 'Non suivi'
    )),
    
    -- Q1.1: Pourquoi non suivi (médicamenteux)
    rad_suivi_recom_medicamenteux_non VARCHAR(50) CHECK (rad_suivi_recom_medicamenteux_non IN (
        'Refus du patient',
        'Désaccord du médecin pratiquant le suivi',
        'Problème de tolérance',
        'Problème de rechute',
        'Autres'
    )),
    
    -- Q2: Suivi des recommandations non médicamenteuses
    rad_suivi_recom_non_medicamenteux VARCHAR(30) CHECK (rad_suivi_recom_non_medicamenteux IN (
        'Complètement suivi', 'Partiellement suivi', 'Non suivi'
    )),
    
    -- Q2.1: Pourquoi non suivi (non médicamenteux)
    rad_suivi_recom_non_medicamenteux_non VARCHAR(50) CHECK (rad_suivi_recom_non_medicamenteux_non IN (
        'Refus du patient',
        'Désaccord avec le médecin pratiquant le suivi',
        'Impossible à mettre en place',
        'Autres'
    )),
    
    -- ========================================================================
    -- RECOURS AUX SOINS (Questionnaire 3)
    -- ========================================================================
    
    -- Section 1: Recours aux soins - suivi habituel
    rad_recours_soin_psy VARCHAR(10) CHECK (rad_recours_soin_psy IN ('Oui', 'Non')),
    
    -- Consultations suivi habituel
    rad_recours_soin_psy_generaliste VARCHAR(10) CHECK (rad_recours_soin_psy_generaliste IN ('Oui', 'Non')),
    recours_soin_psy_generaliste_nb INTEGER CHECK (recours_soin_psy_generaliste_nb >= 0 AND recours_soin_psy_generaliste_nb <= 99),
    
    rad_recours_soin_psy_psychiatre VARCHAR(10) CHECK (rad_recours_soin_psy_psychiatre IN ('Oui', 'Non')),
    recours_soin_psy_psychiatre_nb INTEGER CHECK (recours_soin_psy_psychiatre_nb >= 0 AND recours_soin_psy_psychiatre_nb <= 99),
    
    rad_recours_soin_psy_psychologue VARCHAR(10) CHECK (rad_recours_soin_psy_psychologue IN ('Oui', 'Non')),
    recours_soin_psy_psychologue_nb INTEGER CHECK (recours_soin_psy_psychologue_nb >= 0 AND recours_soin_psy_psychologue_nb <= 99),
    
    rad_recours_soin_psy_plusieurs VARCHAR(10) CHECK (rad_recours_soin_psy_plusieurs IN ('Oui', 'Non')),
    recours_soin_psy_plusieurs_nb INTEGER CHECK (recours_soin_psy_plusieurs_nb >= 0 AND recours_soin_psy_plusieurs_nb <= 99),
    
    rad_recours_soin_psy_autres VARCHAR(10) CHECK (rad_recours_soin_psy_autres IN ('Oui', 'Non')),
    recours_soin_psy_autres_nb INTEGER CHECK (recours_soin_psy_autres_nb >= 0 AND recours_soin_psy_autres_nb <= 99),
    
    -- Section 2: Recours aux soins - urgence
    rad_recours_soin_urgence VARCHAR(10) CHECK (rad_recours_soin_urgence IN ('Oui', 'Non')),
    
    -- Passage aux urgences sans hospitalisation
    rad_recours_soin_urgence_sans_hosp VARCHAR(10) CHECK (rad_recours_soin_urgence_sans_hosp IN ('Oui', 'Non')),
    recours_soin_urgence_sans_hosp_nb INTEGER CHECK (recours_soin_urgence_sans_hosp_nb >= 0 AND recours_soin_urgence_sans_hosp_nb <= 99),
    
    -- Consultations urgence
    rad_recours_soin_urgence_generaliste VARCHAR(10) CHECK (rad_recours_soin_urgence_generaliste IN ('Oui', 'Non')),
    recours_soin_urgence_generaliste_nb INTEGER CHECK (recours_soin_urgence_generaliste_nb >= 0 AND recours_soin_urgence_generaliste_nb <= 99),
    
    rad_recours_soin_urgence_psychiatre VARCHAR(10) CHECK (rad_recours_soin_urgence_psychiatre IN ('Oui', 'Non')),
    recours_soin_urgence_psychiatre_nb INTEGER CHECK (recours_soin_urgence_psychiatre_nb >= 0 AND recours_soin_urgence_psychiatre_nb <= 99),
    
    rad_recours_soin_urgence_psychologue VARCHAR(10) CHECK (rad_recours_soin_urgence_psychologue IN ('Oui', 'Non')),
    recours_soin_urgence_psychologue_nb INTEGER CHECK (recours_soin_urgence_psychologue_nb >= 0 AND recours_soin_urgence_psychologue_nb <= 99),
    
    rad_recours_soin_urgence_plusieurs VARCHAR(10) CHECK (rad_recours_soin_urgence_plusieurs IN ('Oui', 'Non')),
    recours_soin_urgence_plusieurs_nb INTEGER CHECK (recours_soin_urgence_plusieurs_nb >= 0 AND recours_soin_urgence_plusieurs_nb <= 99),
    
    rad_recours_soin_urgence_autres VARCHAR(10) CHECK (rad_recours_soin_urgence_autres IN ('Oui', 'Non')),
    recours_soin_urgence_autres_nb INTEGER CHECK (recours_soin_urgence_autres_nb >= 0 AND recours_soin_urgence_autres_nb <= 99),
    
    -- ========================================================================
    -- TRAITEMENT NON-PHARMACOLOGIQUE (Questionnaire 5)
    -- ========================================================================
    
    -- Q1: Main trigger question
    rad_non_pharmacologique VARCHAR(20) CHECK (rad_non_pharmacologique IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- Q2: Sismotherapie
    rad_non_pharmacologique_sismo VARCHAR(20) CHECK (rad_non_pharmacologique_sismo IN ('Oui', 'Non', 'Ne sais pas')),
    non_pharmacologique_sismo_nb INTEGER CHECK (non_pharmacologique_sismo_nb >= 0 AND non_pharmacologique_sismo_nb <= 99),
    date_non_pharmacologique_sismo_debut DATE,
    date_non_pharmacologique_sismo_fin DATE,
    
    -- Q3: TMS
    rad_non_pharmacologique_tms VARCHAR(20) CHECK (rad_non_pharmacologique_tms IN ('Oui', 'Non', 'Ne sais pas')),
    non_pharmacologique_tms_nb INTEGER CHECK (non_pharmacologique_tms_nb >= 0 AND non_pharmacologique_tms_nb <= 99),
    date_non_pharmacologique_tms_debut DATE,
    date_non_pharmacologique_tms_fin DATE,
    
    -- Q4: TCC
    rad_non_pharmacologique_tcc VARCHAR(20) CHECK (rad_non_pharmacologique_tcc IN ('Oui', 'Non', 'Ne sais pas')),
    non_pharmacologique_tcc_nb INTEGER CHECK (non_pharmacologique_tcc_nb >= 0 AND non_pharmacologique_tcc_nb <= 99),
    date_non_pharmacologique_tcc_debut DATE,
    date_non_pharmacologique_tcc_fin DATE,
    
    -- Q5: Groupes de psychoeducation
    rad_non_pharmacologique_psychoed VARCHAR(20) CHECK (rad_non_pharmacologique_psychoed IN ('Oui', 'Non', 'Ne sais pas')),
    non_pharmacologique_psychoed_nb INTEGER CHECK (non_pharmacologique_psychoed_nb >= 0 AND non_pharmacologique_psychoed_nb <= 99),
    date_non_pharmacologique_psychoed_debut DATE,
    date_non_pharmacologique_psychoed_fin DATE,
    
    -- Q6: IPSRT
    rad_non_pharmacologique_ipsrt VARCHAR(20) CHECK (rad_non_pharmacologique_ipsrt IN ('Oui', 'Non', 'Ne sais pas')),
    non_pharmacologique_ipsrt_nb INTEGER CHECK (non_pharmacologique_ipsrt_nb >= 0 AND non_pharmacologique_ipsrt_nb <= 99),
    chk_non_pharmacologique_ipsrt_precisez TEXT[], -- Checkbox: En groupe, En individuel, Ne sais pas
    date_non_pharmacologique_ipsrt_debut DATE,
    date_non_pharmacologique_ipsrt_fin DATE,
    
    -- Q7: Autre traitement
    rad_non_pharmacologique_autre VARCHAR(20) CHECK (rad_non_pharmacologique_autre IN ('Oui', 'Non', 'Ne sais pas')),
    non_pharmacologique_autre_precisez TEXT,
    non_pharmacologique_autre_nb INTEGER CHECK (non_pharmacologique_autre_nb >= 0 AND non_pharmacologique_autre_nb <= 99),
    date_non_pharmacologique_autre_debut DATE,
    date_non_pharmacologique_autre_fin DATE,
    
    -- ========================================================================
    -- ARRETS DE TRAVAIL (Questionnaire 6)
    -- ========================================================================
    
    rad_arret_travail VARCHAR(20) CHECK (rad_arret_travail IN ('Oui', 'Non', 'Non applicable')),
    arret_travail_nb INTEGER CHECK (arret_travail_nb >= 0 AND arret_travail_nb <= 99),
    arret_travail_duree INTEGER CHECK (arret_travail_duree >= 0 AND arret_travail_duree <= 52),
    
    -- ========================================================================
    -- SOMATIQUE ET CONTRACEPTIF (Questionnaire 7)
    -- ========================================================================
    
    fckedit_somatique_contraceptif TEXT,
    
    -- ========================================================================
    -- STATUT PROFESSIONNEL (Questionnaire 8)
    -- ========================================================================
    
    rad_changement_statut VARCHAR(20) CHECK (rad_changement_statut IN ('Oui', 'Non', 'Ne sais pas')),
    
    rad_statut_actuel VARCHAR(20) CHECK (rad_statut_actuel IN (
        'Sans emploi', 'Actif', 'Retraité', 'Etudiant', 'Pension', 'Au foyer', 'Autres'
    )),
    
    statut_actuel_autre TEXT,
    
    rad_social_stprof_class VARCHAR(100) CHECK (rad_social_stprof_class IN (
        'Agriculteur exploitant',
        'Artisan',
        'Cadre de la fonction publique, profession intellectuelle et artistique',
        'Cadre d''entreprise',
        'Chef d''entreprise de 10 salariés ou plus',
        'Commerçant et assimilé',
        'Contremaître, agent de maîtrise',
        'Employé de la fonction publique',
        'Employé administratif d''entreprise',
        'Employé de commerce',
        'Ouvrier qualifié',
        'Ouvrier non qualifiés',
        'Ouvrier agricole',
        'Personnel de service direct aux particuliers',
        'Profession intermédiaire de l''enseignement, de la santé, de la fonction publique et assimilés',
        'Profession intermédiaire administrative et commerciale des entreprises',
        'Profession libérale et assimilé',
        'Technicien'
    )),
    
    -- ========================================================================
    -- Metadata
    -- ========================================================================
    
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE responses_psy_traitement_semestriel ENABLE ROW LEVEL SECURITY;

-- Healthcare professionals can view responses
CREATE POLICY "Healthcare professionals can view psy_traitement_semestriel"
    ON responses_psy_traitement_semestriel FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- Healthcare professionals can insert responses
CREATE POLICY "Healthcare professionals can insert psy_traitement_semestriel"
    ON responses_psy_traitement_semestriel FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- Healthcare professionals can update responses
CREATE POLICY "Healthcare professionals can update psy_traitement_semestriel"
    ON responses_psy_traitement_semestriel FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- Patients can view their own responses
CREATE POLICY "Patients can view own psy_traitement_semestriel"
    ON responses_psy_traitement_semestriel FOR SELECT
    USING (auth.uid() = patient_id);

-- ============================================================================
-- Update trigger
-- ============================================================================

CREATE TRIGGER update_responses_psy_traitement_semestriel_updated_at 
    BEFORE UPDATE ON responses_psy_traitement_semestriel
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
