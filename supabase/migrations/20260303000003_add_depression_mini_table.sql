-- Migration: Add depression_mini table for the MINI (Mini International Neuropsychiatric Interview)
-- in the Depression screening vertical. ~200 columns across sections A-P + Diagnostique.

CREATE TABLE IF NOT EXISTS depression_mini (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,

  -- Section A: Episode Depressif Majeur
  minia1a INTEGER,
  minia1b INTEGER,
  minia2a INTEGER,
  minia2b INTEGER,
  minia3ads INTEGER,
  minia3aep INTEGER,
  minia3bds INTEGER,
  minia3bep INTEGER,
  minia3cds INTEGER,
  minia3cep INTEGER,
  minia3dsd INTEGER,
  minia3dep INTEGER,
  minia3esd INTEGER,
  minia3eep INTEGER,
  minia3fsd INTEGER,
  minia3fep INTEGER,
  minia3gsd INTEGER,
  minia3gep INTEGER,
  minia3eeac INTEGER,
  minia3eepbis INTEGER,
  minia4sd INTEGER,
  minia4ep INTEGER,
  minia5ep INTEGER,
  minia5bis INTEGER,
  miniedm_1 INTEGER,
  miniedm_2 INTEGER,
  miniedm_3 INTEGER,
  minia6a INTEGER,

  -- Section B: Risque Suicidaire
  minib1 INTEGER,
  minib1a INTEGER,
  minib1b INTEGER,
  minib2 INTEGER,
  minib3 INTEGER,
  minib4 INTEGER,
  minib5 INTEGER,
  minib5bis1 INTEGER,
  minib5bis2 INTEGER,
  minib5bis3 INTEGER,
  minib6 INTEGER,
  minib7 INTEGER,
  minib8 INTEGER,
  minib9 INTEGER,
  minib10 INTEGER,
  minib10bis_1 INTEGER,
  minib10bis_2 INTEGER,
  minib11 INTEGER,
  minib_risque INTEGER,
  minib_score INTEGER,
  minib_risque_cot INTEGER,
  minib_com TEXT,

  -- Section C: Episode (Hypo-)Maniaque
  minic0 INTEGER,
  minic0prec TEXT,
  minic1a INTEGER,
  minic1b INTEGER,
  minic2a INTEGER,
  minic2b INTEGER,
  minic3aea INTEGER,
  minic3aep INTEGER,
  minic3bea INTEGER,
  minic3bep INTEGER,
  minic3cea INTEGER,
  minic3cep INTEGER,
  minic3dea INTEGER,
  minic3dep INTEGER,
  minic3eea INTEGER,
  minic3eep INTEGER,
  minic3fea INTEGER,
  minic3fep INTEGER,
  minic3gea INTEGER,
  minic3gep INTEGER,
  minic3aeac INTEGER,
  minic3aepbis INTEGER,
  minic3recapea INTEGER,
  minic3recupep INTEGER,
  minic4ea INTEGER,
  minic4ep INTEGER,
  minic5ea INTEGER,
  minic5ep INTEGER,
  minic6ea INTEGER,
  minic6ep INTEGER,
  minicepmania INTEGER,
  minictypepmania_1 INTEGER,
  minictypepmania_2 INTEGER,
  minicephmania INTEGER,
  minictypephmania_1 INTEGER,
  minictypephmania_2 INTEGER,
  minicsymania INTEGER,
  minictypsymania_1 INTEGER,
  minictypsymania_2 INTEGER,
  minic7a INTEGER,
  minic7b INTEGER,
  minic7c INTEGER,

  -- Section D: Trouble Panique
  minid1a INTEGER,
  minid1b INTEGER,
  minid2 INTEGER,
  minid3 INTEGER,
  minid4a INTEGER,
  minid4b INTEGER,
  minid4c INTEGER,
  minid4d INTEGER,
  minid4e INTEGER,
  minid4f INTEGER,
  minid4g INTEGER,
  minid4h INTEGER,
  minid4i INTEGER,
  minid4j INTEGER,
  minid4k INTEGER,
  minid4l INTEGER,
  minid4m INTEGER,
  minid5 INTEGER,
  minid6 INTEGER,
  minid7 INTEGER,
  minid4tropanact INTEGER,

  -- Section E: Agoraphobie
  minie1 INTEGER,
  minie2 INTEGER,
  minietrpanagroa INTEGER,
  minietrpansaga INTEGER,
  minieagasatp INTEGER,

  -- Section F: Phobie Sociale
  minif1 INTEGER,
  minif2 INTEGER,
  minif3 INTEGER,
  minif4 INTEGER,
  minifphosoc INTEGER,
  minief5 INTEGER,
  minifphosocgen INTEGER,

  -- Section G: TOC
  minig1 INTEGER,
  minig2 INTEGER,
  minig3 INTEGER,
  minig4 INTEGER,
  minig5 INTEGER,
  minig6 INTEGER,
  minigtruobscomact INTEGER,

  -- Section H: ESPT
  minih1 INTEGER,
  minih2 INTEGER,
  minih3 INTEGER,
  minih4a INTEGER,
  minih4b INTEGER,
  minih4c INTEGER,
  minih4d INTEGER,
  minih4e INTEGER,
  minih4f INTEGER,
  minih4g INTEGER,
  minih5a INTEGER,
  minih5b INTEGER,
  minih5c INTEGER,
  minih5d INTEGER,
  minih5e INTEGER,
  minih6 INTEGER,
  minihstress INTEGER,

  -- Section I: Dependance/Abus Alcool
  minii1 INTEGER,
  minii2a INTEGER,
  minii2b INTEGER,
  minii2c INTEGER,
  minii2d INTEGER,
  minii2e INTEGER,
  minii2f INTEGER,
  minii2g INTEGER,
  miniidepalcact INTEGER,
  minii3a INTEGER,
  minii3b INTEGER,
  minii3c INTEGER,
  minii3d INTEGER,
  miniiabalcac INTEGER,

  -- Section J: Dependance/Abus Substance
  minij1a INTEGER,
  minijprodcons_1 INTEGER, minijprodcons_2 INTEGER, minijprodcons_3 INTEGER,
  minijprodcons_4 INTEGER, minijprodcons_5 INTEGER, minijprodcons_6 INTEGER,
  minijprodcons_7 INTEGER, minijprodcons_8 INTEGER, minijprodcons_9 INTEGER,
  minijprodcons_10 INTEGER, minijprodcons_11 INTEGER, minijprodcons_12 INTEGER,
  minijprodcons_13 INTEGER, minijprodcons_14 INTEGER, minijprodcons_15 INTEGER,
  minijprodcons_16 INTEGER, minijprodcons_17 INTEGER, minijprodcons_18 INTEGER,
  minijprodcons_19 INTEGER, minijprodcons_20 INTEGER, minijprodcons_21 INTEGER,
  minijprodcons_22 INTEGER, minijprodcons_23 INTEGER, minijprodcons_24 INTEGER,
  minijprodcons_25 INTEGER, minijprodcons_26 INTEGER, minijprodcons_27 INTEGER,
  minijprodcons_28 INTEGER, minijprodcons_29 INTEGER, minijprodcons_30 INTEGER,
  minijprodcons_31 INTEGER, minijprodcons_32 INTEGER, minijprodcons_33 INTEGER,
  minijprodcons_34 INTEGER, minijprodcons_35 INTEGER, minijprodcons_36 INTEGER,
  minijprodcons_37 INTEGER, minijprodcons_38 INTEGER, minijprodcons_39 INTEGER,
  minijmedoc INTEGER,
  minijsubcons TEXT,
  minijsubconprob TEXT,
  minij2a INTEGER,
  minij2b INTEGER,
  minij2c INTEGER,
  minij2d INTEGER,
  minij2e INTEGER,
  minij2f INTEGER,
  minij2g INTEGER,
  minijspecsub TEXT,
  minijdepsubact INTEGER,
  minij3a INTEGER,
  minij3b INTEGER,
  minij3c INTEGER,
  minij3d INTEGER,
  minijabusubact INTEGER,
  minijspecsub1 TEXT,

  -- Section K: Troubles Psychotiques
  minik1a INTEGER,
  minik1b INTEGER,
  minik2a INTEGER,
  minik2b INTEGER,
  minik3a INTEGER,
  minik3b INTEGER,
  minik4a INTEGER,
  minik4b INTEGER,
  minik5a INTEGER,
  minik5b INTEGER,
  minik6a INTEGER,
  minik6a1 INTEGER,
  minik6b INTEGER,
  minik6b1 INTEGER,
  minik7a INTEGER,
  minik7b INTEGER,
  minik8b INTEGER,
  minik9b INTEGER,
  minik10b INTEGER,
  minik11a INTEGER,
  minik11b INTEGER,
  minik12a INTEGER,
  minik13b INTEGER,
  minik13 INTEGER,
  minik14b INTEGER,
  minik14 INTEGER,

  -- Section L: Anorexie Mentale
  minil1a INTEGER,
  minil1b INTEGER,
  minil1c INTEGER,
  minil2 INTEGER,
  minil3 INTEGER,
  minil4a INTEGER,
  minil4b INTEGER,
  minil4c INTEGER,
  minil6 INTEGER,
  minilanomenact INTEGER,

  -- Section M: Boulimie
  minim1 INTEGER,
  minim2 INTEGER,
  minim3 INTEGER,
  minim4 INTEGER,
  minim5 INTEGER,
  minim6 INTEGER,
  minim7 INTEGER,
  minim8 INTEGER,
  minim8bis INTEGER,

  -- Section N: Anxiete Generalisee
  minin1a INTEGER,
  minin1b INTEGER,
  minin1c INTEGER,
  minin2 INTEGER,
  minin3a INTEGER,
  minin3b INTEGER,
  minin3c INTEGER,
  minin3d INTEGER,
  minin3e INTEGER,
  minin3f INTEGER,
  minin4 INTEGER,
  mininanxgenact INTEGER,

  -- Section O: Causes Medicales
  minio1a INTEGER,
  minio1b INTEGER,
  minio2 INTEGER,

  -- Section P: Trouble Personnalite Antisociale
  minip1a INTEGER,
  minip1b INTEGER,
  minip1c INTEGER,
  minip1d INTEGER,
  minip1e INTEGER,
  minip1f INTEGER,
  minip2a INTEGER,
  minip2b INTEGER,
  minip2c INTEGER,
  minip2d INTEGER,
  minip2e INTEGER,
  minip2f INTEGER,
  miniptroperantisoc INTEGER,

  -- Section Diagnostique
  tdm_1 INTEGER,
  tdm_2 INTEGER,
  tdm_caract_psy_1 INTEGER,
  tdm_caract_psy_2 INTEGER,
  tbi_1 INTEGER,
  tbi_2 INTEGER,
  epi_mania_iso_1 INTEGER,
  epi_mania_iso_2 INTEGER,
  tbi_caract_psy_1 INTEGER,
  tbi_caract_psy_2 INTEGER,
  tbi_epi_rec INTEGER,
  tbii_1 INTEGER,
  tbii_2 INTEGER,
  tbii_epi_rec INTEGER,
  minitb2_hypo_1 INTEGER,
  minitb2_hypo_2 INTEGER,
  minitb2_depress_1 INTEGER,
  minitb2_depress_2 INTEGER,
  tbns_1 INTEGER,
  tbns_2 INTEGER,

  -- Computed scores
  total_score INTEGER,
  interpretation TEXT,

  -- Metadata
  completed_by UUID REFERENCES user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_depression_mini_patient_id ON depression_mini(patient_id);
CREATE INDEX IF NOT EXISTS idx_depression_mini_visit_id ON depression_mini(visit_id);

ALTER TABLE depression_mini ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients view own depression mini responses" ON depression_mini
  FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients insert own depression mini responses" ON depression_mini
  FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Patients update own depression mini responses" ON depression_mini
  FOR UPDATE USING (auth.uid() = patient_id);
CREATE POLICY "Professionals view all depression mini responses" ON depression_mini
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid()
      AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );
CREATE POLICY "Professionals insert depression mini responses" ON depression_mini
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid()
      AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );
CREATE POLICY "Professionals update depression mini responses" ON depression_mini
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid()
      AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

GRANT ALL ON depression_mini TO authenticated;
GRANT ALL ON depression_mini TO service_role;
