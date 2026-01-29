-- ============================================================================
-- Migration: Create schizophrenia_bis table
-- BIS (Birchwood Insight Scale)
-- Birchwood M, Smith J, Drury V, Healy J, Macmillan F, Slade M. (1994)
-- ============================================================================

-- Create the table
CREATE TABLE IF NOT EXISTS "public"."schizophrenia_bis" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    
    -- Administration status
    "questionnaire_done" "text",
    
    -- Question responses (ternary: 'D'accord' | 'Pas d'accord' | 'Incertain')
    -- Q1, Q8: Conscience des symptômes
    -- Q2, Q7: Conscience de la maladie
    -- Q3-Q6: Besoin de traitement
    "q1" "text",
    "q2" "text",
    "q3" "text",
    "q4" "text",
    "q5" "text",
    "q6" "text",
    "q7" "text",
    "q8" "text",
    
    -- Computed scores
    "conscience_symptome_score" numeric(3,1),   -- 0-4 (Q1 + Q8)
    "conscience_maladie_score" numeric(3,1),    -- 0-4 (Q2 + Q7)
    "besoin_traitement_score" numeric(3,1),     -- 0-4 ((Q3 + Q4 + Q5 + Q6) / 2)
    "total_score" numeric(4,1),                 -- 0-12 (sum of subscales)
    "interpretation" "text",
    
    -- Metadata
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."schizophrenia_bis" OWNER TO "postgres";

-- Primary key
ALTER TABLE ONLY "public"."schizophrenia_bis"
    ADD CONSTRAINT "schizophrenia_bis_pkey" PRIMARY KEY ("id");

-- Unique constraint on visit_id (one response per visit)
ALTER TABLE ONLY "public"."schizophrenia_bis"
    ADD CONSTRAINT "schizophrenia_bis_visit_id_key" UNIQUE ("visit_id");

-- Foreign key constraints
ALTER TABLE ONLY "public"."schizophrenia_bis"
    ADD CONSTRAINT "schizophrenia_bis_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."schizophrenia_bis"
    ADD CONSTRAINT "schizophrenia_bis_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."schizophrenia_bis"
    ADD CONSTRAINT "schizophrenia_bis_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public".user_profiles("id");

-- Enable Row Level Security
ALTER TABLE "public"."schizophrenia_bis" ENABLE ROW LEVEL SECURITY;

-- Patient policies
CREATE POLICY "Patients view own schizophrenia_bis" ON "public"."schizophrenia_bis"
    FOR SELECT USING (("auth"."uid"() = "patient_id"));

CREATE POLICY "Patients insert own schizophrenia_bis" ON "public"."schizophrenia_bis"
    FOR INSERT WITH CHECK (("auth"."uid"() = "patient_id"));

CREATE POLICY "Patients update own schizophrenia_bis" ON "public"."schizophrenia_bis"
    FOR UPDATE USING (("auth"."uid"() = "patient_id"));

-- Professional policies
CREATE POLICY "Professionals view schizophrenia_bis" ON "public"."schizophrenia_bis"
    FOR SELECT USING ((EXISTS ( SELECT 1
       FROM "public".user_profiles
      WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public".user_role, 'manager'::"public".user_role, 'administrator'::"public".user_role]))))));

CREATE POLICY "Professionals insert schizophrenia_bis" ON "public"."schizophrenia_bis"
    FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
       FROM "public".user_profiles
      WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public".user_role, 'manager'::"public".user_role, 'administrator'::"public".user_role]))))));

CREATE POLICY "Professionals update schizophrenia_bis" ON "public"."schizophrenia_bis"
    FOR UPDATE USING ((EXISTS ( SELECT 1
       FROM "public".user_profiles
      WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public".user_role, 'manager'::"public".user_role, 'administrator'::"public".user_role]))))));

-- Grant permissions
GRANT ALL ON TABLE "public"."schizophrenia_bis" TO "anon";
GRANT ALL ON TABLE "public"."schizophrenia_bis" TO "authenticated";
GRANT ALL ON TABLE "public"."schizophrenia_bis" TO "service_role";

-- Add check constraints for valid score ranges (NULL allowed for partial completion)
ALTER TABLE "public"."schizophrenia_bis"
    ADD CONSTRAINT "schizophrenia_bis_conscience_symptome_range" CHECK (("conscience_symptome_score" IS NULL OR ("conscience_symptome_score" >= 0 AND "conscience_symptome_score" <= 4)));
ALTER TABLE "public"."schizophrenia_bis"
    ADD CONSTRAINT "schizophrenia_bis_conscience_maladie_range" CHECK (("conscience_maladie_score" IS NULL OR ("conscience_maladie_score" >= 0 AND "conscience_maladie_score" <= 4)));
ALTER TABLE "public"."schizophrenia_bis"
    ADD CONSTRAINT "schizophrenia_bis_besoin_traitement_range" CHECK (("besoin_traitement_score" IS NULL OR ("besoin_traitement_score" >= 0 AND "besoin_traitement_score" <= 4)));
ALTER TABLE "public"."schizophrenia_bis"
    ADD CONSTRAINT "schizophrenia_bis_total_score_range" CHECK (("total_score" IS NULL OR ("total_score" >= 0 AND "total_score" <= 12)));

-- Add check constraints for ternary question values
ALTER TABLE "public"."schizophrenia_bis"
    ADD CONSTRAINT "schizophrenia_bis_q1_valid" CHECK (("q1" IS NULL OR "q1" IN ('D''accord', 'Pas d''accord', 'Incertain')));
ALTER TABLE "public"."schizophrenia_bis"
    ADD CONSTRAINT "schizophrenia_bis_q2_valid" CHECK (("q2" IS NULL OR "q2" IN ('D''accord', 'Pas d''accord', 'Incertain')));
ALTER TABLE "public"."schizophrenia_bis"
    ADD CONSTRAINT "schizophrenia_bis_q3_valid" CHECK (("q3" IS NULL OR "q3" IN ('D''accord', 'Pas d''accord', 'Incertain')));
ALTER TABLE "public"."schizophrenia_bis"
    ADD CONSTRAINT "schizophrenia_bis_q4_valid" CHECK (("q4" IS NULL OR "q4" IN ('D''accord', 'Pas d''accord', 'Incertain')));
ALTER TABLE "public"."schizophrenia_bis"
    ADD CONSTRAINT "schizophrenia_bis_q5_valid" CHECK (("q5" IS NULL OR "q5" IN ('D''accord', 'Pas d''accord', 'Incertain')));
ALTER TABLE "public"."schizophrenia_bis"
    ADD CONSTRAINT "schizophrenia_bis_q6_valid" CHECK (("q6" IS NULL OR "q6" IN ('D''accord', 'Pas d''accord', 'Incertain')));
ALTER TABLE "public"."schizophrenia_bis"
    ADD CONSTRAINT "schizophrenia_bis_q7_valid" CHECK (("q7" IS NULL OR "q7" IN ('D''accord', 'Pas d''accord', 'Incertain')));
ALTER TABLE "public"."schizophrenia_bis"
    ADD CONSTRAINT "schizophrenia_bis_q8_valid" CHECK (("q8" IS NULL OR "q8" IN ('D''accord', 'Pas d''accord', 'Incertain')));
