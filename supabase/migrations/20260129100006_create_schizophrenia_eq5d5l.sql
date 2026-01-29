-- ============================================================================
-- Migration: Create schizophrenia_eq5d5l table
-- EQ-5D-5L (EuroQol 5D-5L) - Quality of Life Questionnaire
-- Reference: Herdman M, et al. Qual Life Res. 2011;20(10):1727-1736.
-- French value set: Andrade LF, et al. Pharmacoeconomics. 2020;38(4):413-425.
-- ============================================================================

-- Create the table
CREATE TABLE IF NOT EXISTS "public"."schizophrenia_eq5d5l" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    
    -- Administration status
    "questionnaire_done" "text",
    
    -- 5 Dimensions (each 1-5 levels)
    "mobility" integer,                    -- D1: Mobilité
    "self_care" integer,                   -- D2: Autonomie
    "usual_activities" integer,            -- D3: Activités courantes
    "pain_discomfort" integer,             -- D4: Douleurs, gêne
    "anxiety_depression" integer,          -- D5: Anxiété, dépression
    
    -- Visual Analogue Scale
    "vas_score" integer,                   -- 0-100
    
    -- Computed scores
    "health_state" "text",                 -- 5-digit profile (e.g., "11111", "55555")
    "index_value" numeric(5,3),            -- French utility value (-0.530 to 1.000)
    "interpretation" "text",
    
    -- Metadata
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."schizophrenia_eq5d5l" OWNER TO "postgres";

-- Primary key
ALTER TABLE ONLY "public"."schizophrenia_eq5d5l"
    ADD CONSTRAINT "schizophrenia_eq5d5l_pkey" PRIMARY KEY ("id");

-- Unique constraint on visit_id (one response per visit)
ALTER TABLE ONLY "public"."schizophrenia_eq5d5l"
    ADD CONSTRAINT "schizophrenia_eq5d5l_visit_id_key" UNIQUE ("visit_id");

-- Foreign key constraints
ALTER TABLE ONLY "public"."schizophrenia_eq5d5l"
    ADD CONSTRAINT "schizophrenia_eq5d5l_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."schizophrenia_eq5d5l"
    ADD CONSTRAINT "schizophrenia_eq5d5l_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."schizophrenia_eq5d5l"
    ADD CONSTRAINT "schizophrenia_eq5d5l_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public".user_profiles("id");

-- Enable Row Level Security
ALTER TABLE "public"."schizophrenia_eq5d5l" ENABLE ROW LEVEL SECURITY;

-- Patient policies
CREATE POLICY "Patients view own schizophrenia_eq5d5l" ON "public"."schizophrenia_eq5d5l"
    FOR SELECT USING (("auth"."uid"() = "patient_id"));

CREATE POLICY "Patients insert own schizophrenia_eq5d5l" ON "public"."schizophrenia_eq5d5l"
    FOR INSERT WITH CHECK (("auth"."uid"() = "patient_id"));

CREATE POLICY "Patients update own schizophrenia_eq5d5l" ON "public"."schizophrenia_eq5d5l"
    FOR UPDATE USING (("auth"."uid"() = "patient_id"));

-- Professional policies
CREATE POLICY "Professionals view schizophrenia_eq5d5l" ON "public"."schizophrenia_eq5d5l"
    FOR SELECT USING ((EXISTS ( SELECT 1
       FROM "public".user_profiles
      WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public".user_role, 'manager'::"public".user_role, 'administrator'::"public".user_role]))))));

CREATE POLICY "Professionals insert schizophrenia_eq5d5l" ON "public"."schizophrenia_eq5d5l"
    FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
       FROM "public".user_profiles
      WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public".user_role, 'manager'::"public".user_role, 'administrator'::"public".user_role]))))));

CREATE POLICY "Professionals update schizophrenia_eq5d5l" ON "public"."schizophrenia_eq5d5l"
    FOR UPDATE USING ((EXISTS ( SELECT 1
       FROM "public".user_profiles
      WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public".user_role, 'manager'::"public".user_role, 'administrator'::"public".user_role]))))));

-- Grant permissions
GRANT ALL ON TABLE "public"."schizophrenia_eq5d5l" TO "anon";
GRANT ALL ON TABLE "public"."schizophrenia_eq5d5l" TO "authenticated";
GRANT ALL ON TABLE "public"."schizophrenia_eq5d5l" TO "service_role";

-- Add check constraints for valid dimension values (1-5)
ALTER TABLE "public"."schizophrenia_eq5d5l"
    ADD CONSTRAINT "schizophrenia_eq5d5l_mobility_range" CHECK (("mobility" IS NULL OR ("mobility" >= 1 AND "mobility" <= 5)));
ALTER TABLE "public"."schizophrenia_eq5d5l"
    ADD CONSTRAINT "schizophrenia_eq5d5l_self_care_range" CHECK (("self_care" IS NULL OR ("self_care" >= 1 AND "self_care" <= 5)));
ALTER TABLE "public"."schizophrenia_eq5d5l"
    ADD CONSTRAINT "schizophrenia_eq5d5l_usual_activities_range" CHECK (("usual_activities" IS NULL OR ("usual_activities" >= 1 AND "usual_activities" <= 5)));
ALTER TABLE "public"."schizophrenia_eq5d5l"
    ADD CONSTRAINT "schizophrenia_eq5d5l_pain_discomfort_range" CHECK (("pain_discomfort" IS NULL OR ("pain_discomfort" >= 1 AND "pain_discomfort" <= 5)));
ALTER TABLE "public"."schizophrenia_eq5d5l"
    ADD CONSTRAINT "schizophrenia_eq5d5l_anxiety_depression_range" CHECK (("anxiety_depression" IS NULL OR ("anxiety_depression" >= 1 AND "anxiety_depression" <= 5)));

-- Add check constraint for VAS score (0-100)
ALTER TABLE "public"."schizophrenia_eq5d5l"
    ADD CONSTRAINT "schizophrenia_eq5d5l_vas_score_range" CHECK (("vas_score" IS NULL OR ("vas_score" >= 0 AND "vas_score" <= 100)));

-- Add check constraint for index value (-0.530 to 1.000)
ALTER TABLE "public"."schizophrenia_eq5d5l"
    ADD CONSTRAINT "schizophrenia_eq5d5l_index_value_range" CHECK (("index_value" IS NULL OR ("index_value" >= -0.530 AND "index_value" <= 1.000)));
