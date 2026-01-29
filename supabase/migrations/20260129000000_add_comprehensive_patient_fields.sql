-- Add comprehensive patient information fields
-- Migration: 20260129000000_add_comprehensive_patient_fields.sql

-- Identité (Identity) fields
ALTER TABLE "public"."patients" ADD COLUMN IF NOT EXISTS "birth_city" TEXT;
ALTER TABLE "public"."patients" ADD COLUMN IF NOT EXISTS "birth_department" TEXT;
ALTER TABLE "public"."patients" ADD COLUMN IF NOT EXISTS "birth_country" TEXT DEFAULT 'France';
ALTER TABLE "public"."patients" ADD COLUMN IF NOT EXISTS "marital_name" TEXT;
ALTER TABLE "public"."patients" ADD COLUMN IF NOT EXISTS "hospital_id" TEXT;
ALTER TABLE "public"."patients" ADD COLUMN IF NOT EXISTS "social_security_number" TEXT;

-- Coordonnées (Contact) fields - detailed breakdown
ALTER TABLE "public"."patients" ADD COLUMN IF NOT EXISTS "street_number_and_name" TEXT;
ALTER TABLE "public"."patients" ADD COLUMN IF NOT EXISTS "building_details" TEXT;
ALTER TABLE "public"."patients" ADD COLUMN IF NOT EXISTS "postal_code" TEXT;
ALTER TABLE "public"."patients" ADD COLUMN IF NOT EXISTS "city" TEXT;
ALTER TABLE "public"."patients" ADD COLUMN IF NOT EXISTS "phone_private" TEXT;
ALTER TABLE "public"."patients" ADD COLUMN IF NOT EXISTS "phone_professional" TEXT;
ALTER TABLE "public"."patients" ADD COLUMN IF NOT EXISTS "phone_mobile" TEXT;

-- Provenance (Referral) fields
ALTER TABLE "public"."patients" ADD COLUMN IF NOT EXISTS "patient_sector" TEXT;
ALTER TABLE "public"."patients" ADD COLUMN IF NOT EXISTS "referred_by" TEXT;
ALTER TABLE "public"."patients" ADD COLUMN IF NOT EXISTS "visit_purpose" TEXT;
ALTER TABLE "public"."patients" ADD COLUMN IF NOT EXISTS "gp_report_consent" TEXT;
ALTER TABLE "public"."patients" ADD COLUMN IF NOT EXISTS "psychiatrist_report_consent" TEXT;
ALTER TABLE "public"."patients" ADD COLUMN IF NOT EXISTS "center_awareness_source" TEXT;

-- Add comments for documentation
COMMENT ON COLUMN "public"."patients"."birth_city" IS 'Ville de naissance';
COMMENT ON COLUMN "public"."patients"."birth_department" IS 'Département de naissance';
COMMENT ON COLUMN "public"."patients"."birth_country" IS 'Pays de naissance';
COMMENT ON COLUMN "public"."patients"."hospital_id" IS 'Numéro d''identification hospitalier';
COMMENT ON COLUMN "public"."patients"."social_security_number" IS 'Numéro de Sécurité Sociale';

COMMENT ON COLUMN "public"."patients"."street_number_and_name" IS 'Numéro et nom de rue';
COMMENT ON COLUMN "public"."patients"."building_details" IS 'Bâtiment, lieu-dit';
COMMENT ON COLUMN "public"."patients"."postal_code" IS 'Code postal';
COMMENT ON COLUMN "public"."patients"."city" IS 'Ville';
COMMENT ON COLUMN "public"."patients"."phone_private" IS 'Téléphone privé';
COMMENT ON COLUMN "public"."patients"."phone_professional" IS 'Téléphone professionnel';
COMMENT ON COLUMN "public"."patients"."phone_mobile" IS 'Téléphone portable';

COMMENT ON COLUMN "public"."patients"."patient_sector" IS 'Secteur du patient (Secteur du centre, Hors secteur, Monaco)';
COMMENT ON COLUMN "public"."patients"."referred_by" IS 'Adressé(e) par (Psychiatre libéral, hospitalier, etc.)';
COMMENT ON COLUMN "public"."patients"."visit_purpose" IS 'Objet de la visite (Avis diagnostic, thérapeutique)';
COMMENT ON COLUMN "public"."patients"."gp_report_consent" IS 'Accord transmission bilan au médecin généraliste';
COMMENT ON COLUMN "public"."patients"."psychiatrist_report_consent" IS 'Accord transmission bilan au psychiatre';
COMMENT ON COLUMN "public"."patients"."center_awareness_source" IS 'Comment avez-vous eu connaissance du centre expert';
