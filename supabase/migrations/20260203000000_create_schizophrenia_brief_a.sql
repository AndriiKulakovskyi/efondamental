-- ============================================================================
-- Migration: Create schizophrenia_brief_a_auto table
-- BRIEF-A Auto-Evaluation (Self-Report) - Executive Function Assessment
-- Roth RM, Isquith PK, Gioia GA - Adaptation française (2015)
-- ============================================================================

-- Create the table
CREATE TABLE IF NOT EXISTS "public"."schizophrenia_brief_a_auto" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    
    -- 75 question responses (1-3 Likert scale: Jamais=1, Parfois=2, Souvent=3)
    "q1" integer CHECK ("q1" >= 1 AND "q1" <= 3),
    "q2" integer CHECK ("q2" >= 1 AND "q2" <= 3),
    "q3" integer CHECK ("q3" >= 1 AND "q3" <= 3),
    "q4" integer CHECK ("q4" >= 1 AND "q4" <= 3),
    "q5" integer CHECK ("q5" >= 1 AND "q5" <= 3),
    "q6" integer CHECK ("q6" >= 1 AND "q6" <= 3),
    "q7" integer CHECK ("q7" >= 1 AND "q7" <= 3),
    "q8" integer CHECK ("q8" >= 1 AND "q8" <= 3),
    "q9" integer CHECK ("q9" >= 1 AND "q9" <= 3),
    "q10" integer CHECK ("q10" >= 1 AND "q10" <= 3),
    "q11" integer CHECK ("q11" >= 1 AND "q11" <= 3),
    "q12" integer CHECK ("q12" >= 1 AND "q12" <= 3),
    "q13" integer CHECK ("q13" >= 1 AND "q13" <= 3),
    "q14" integer CHECK ("q14" >= 1 AND "q14" <= 3),
    "q15" integer CHECK ("q15" >= 1 AND "q15" <= 3),
    "q16" integer CHECK ("q16" >= 1 AND "q16" <= 3),
    "q17" integer CHECK ("q17" >= 1 AND "q17" <= 3),
    "q18" integer CHECK ("q18" >= 1 AND "q18" <= 3),
    "q19" integer CHECK ("q19" >= 1 AND "q19" <= 3),
    "q20" integer CHECK ("q20" >= 1 AND "q20" <= 3),
    "q21" integer CHECK ("q21" >= 1 AND "q21" <= 3),
    "q22" integer CHECK ("q22" >= 1 AND "q22" <= 3),
    "q23" integer CHECK ("q23" >= 1 AND "q23" <= 3),
    "q24" integer CHECK ("q24" >= 1 AND "q24" <= 3),
    "q25" integer CHECK ("q25" >= 1 AND "q25" <= 3),
    "q26" integer CHECK ("q26" >= 1 AND "q26" <= 3),
    "q27" integer CHECK ("q27" >= 1 AND "q27" <= 3),
    "q28" integer CHECK ("q28" >= 1 AND "q28" <= 3),
    "q29" integer CHECK ("q29" >= 1 AND "q29" <= 3),
    "q30" integer CHECK ("q30" >= 1 AND "q30" <= 3),
    "q31" integer CHECK ("q31" >= 1 AND "q31" <= 3),
    "q32" integer CHECK ("q32" >= 1 AND "q32" <= 3),
    "q33" integer CHECK ("q33" >= 1 AND "q33" <= 3),
    "q34" integer CHECK ("q34" >= 1 AND "q34" <= 3),
    "q35" integer CHECK ("q35" >= 1 AND "q35" <= 3),
    "q36" integer CHECK ("q36" >= 1 AND "q36" <= 3),
    "q37" integer CHECK ("q37" >= 1 AND "q37" <= 3),
    "q38" integer CHECK ("q38" >= 1 AND "q38" <= 3),
    "q39" integer CHECK ("q39" >= 1 AND "q39" <= 3),
    "q40" integer CHECK ("q40" >= 1 AND "q40" <= 3),
    "q41" integer CHECK ("q41" >= 1 AND "q41" <= 3),
    "q42" integer CHECK ("q42" >= 1 AND "q42" <= 3),
    "q43" integer CHECK ("q43" >= 1 AND "q43" <= 3),
    "q44" integer CHECK ("q44" >= 1 AND "q44" <= 3),
    "q45" integer CHECK ("q45" >= 1 AND "q45" <= 3),
    "q46" integer CHECK ("q46" >= 1 AND "q46" <= 3),
    "q47" integer CHECK ("q47" >= 1 AND "q47" <= 3),
    "q48" integer CHECK ("q48" >= 1 AND "q48" <= 3),
    "q49" integer CHECK ("q49" >= 1 AND "q49" <= 3),
    "q50" integer CHECK ("q50" >= 1 AND "q50" <= 3),
    "q51" integer CHECK ("q51" >= 1 AND "q51" <= 3),
    "q52" integer CHECK ("q52" >= 1 AND "q52" <= 3),
    "q53" integer CHECK ("q53" >= 1 AND "q53" <= 3),
    "q54" integer CHECK ("q54" >= 1 AND "q54" <= 3),
    "q55" integer CHECK ("q55" >= 1 AND "q55" <= 3),
    "q56" integer CHECK ("q56" >= 1 AND "q56" <= 3),
    "q57" integer CHECK ("q57" >= 1 AND "q57" <= 3),
    "q58" integer CHECK ("q58" >= 1 AND "q58" <= 3),
    "q59" integer CHECK ("q59" >= 1 AND "q59" <= 3),
    "q60" integer CHECK ("q60" >= 1 AND "q60" <= 3),
    "q61" integer CHECK ("q61" >= 1 AND "q61" <= 3),
    "q62" integer CHECK ("q62" >= 1 AND "q62" <= 3),
    "q63" integer CHECK ("q63" >= 1 AND "q63" <= 3),
    "q64" integer CHECK ("q64" >= 1 AND "q64" <= 3),
    "q65" integer CHECK ("q65" >= 1 AND "q65" <= 3),
    "q66" integer CHECK ("q66" >= 1 AND "q66" <= 3),
    "q67" integer CHECK ("q67" >= 1 AND "q67" <= 3),
    "q68" integer CHECK ("q68" >= 1 AND "q68" <= 3),
    "q69" integer CHECK ("q69" >= 1 AND "q69" <= 3),
    "q70" integer CHECK ("q70" >= 1 AND "q70" <= 3),
    "q71" integer CHECK ("q71" >= 1 AND "q71" <= 3),
    "q72" integer CHECK ("q72" >= 1 AND "q72" <= 3),
    "q73" integer CHECK ("q73" >= 1 AND "q73" <= 3),
    "q74" integer CHECK ("q74" >= 1 AND "q74" <= 3),
    "q75" integer CHECK ("q75" >= 1 AND "q75" <= 3),
    
    -- 9 Clinical Scale scores (sum of items) - matching hetero naming convention
    "brief_a_inhibit" integer,
    "brief_a_shift" integer,
    "brief_a_emotional_control" integer,
    "brief_a_self_monitor" integer,
    "brief_a_initiate" integer,
    "brief_a_working_memory" integer,
    "brief_a_plan_organize" integer,
    "brief_a_task_monitor" integer,
    "brief_a_organization_materials" integer,
    
    -- 3 Composite Index scores
    "brief_a_bri" integer,  -- Behavioral Regulation Index
    "brief_a_mi" integer,   -- Metacognition Index
    "brief_a_gec" integer,  -- Global Executive Composite
    
    -- 2 Validity scales (no inconsistency for auto version)
    "brief_a_negativity" integer,
    "brief_a_infrequency" integer,
    
    -- Metadata
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."schizophrenia_brief_a_auto" OWNER TO "postgres";

-- Primary key
ALTER TABLE ONLY "public"."schizophrenia_brief_a_auto"
    ADD CONSTRAINT "schizophrenia_brief_a_auto_pkey" PRIMARY KEY ("id");

-- Unique constraint on visit_id (one response per visit)
ALTER TABLE ONLY "public"."schizophrenia_brief_a_auto"
    ADD CONSTRAINT "schizophrenia_brief_a_auto_visit_id_key" UNIQUE ("visit_id");

-- Foreign key constraints
ALTER TABLE ONLY "public"."schizophrenia_brief_a_auto"
    ADD CONSTRAINT "schizophrenia_brief_a_auto_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."schizophrenia_brief_a_auto"
    ADD CONSTRAINT "schizophrenia_brief_a_auto_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."schizophrenia_brief_a_auto"
    ADD CONSTRAINT "schizophrenia_brief_a_auto_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");

-- Create indexes for common queries
CREATE INDEX "schizophrenia_brief_a_auto_visit_id_idx" ON "public"."schizophrenia_brief_a_auto" USING "btree" ("visit_id");
CREATE INDEX "schizophrenia_brief_a_auto_patient_id_idx" ON "public"."schizophrenia_brief_a_auto" USING "btree" ("patient_id");

-- Enable Row Level Security
ALTER TABLE "public"."schizophrenia_brief_a_auto" ENABLE ROW LEVEL SECURITY;

-- Patient policies
CREATE POLICY "Patients view own schizophrenia_brief_a_auto" ON "public"."schizophrenia_brief_a_auto"
    FOR SELECT USING (("auth"."uid"() = "patient_id"));

CREATE POLICY "Patients insert own schizophrenia_brief_a_auto" ON "public"."schizophrenia_brief_a_auto"
    FOR INSERT WITH CHECK (("auth"."uid"() = "patient_id"));

CREATE POLICY "Patients update own schizophrenia_brief_a_auto" ON "public"."schizophrenia_brief_a_auto"
    FOR UPDATE USING (("auth"."uid"() = "patient_id"));

-- Professional policies
CREATE POLICY "Professionals view schizophrenia_brief_a_auto" ON "public"."schizophrenia_brief_a_auto"
    FOR SELECT USING ((EXISTS ( SELECT 1
       FROM "public"."user_profiles"
      WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));

CREATE POLICY "Professionals insert schizophrenia_brief_a_auto" ON "public"."schizophrenia_brief_a_auto"
    FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
       FROM "public"."user_profiles"
      WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));

CREATE POLICY "Professionals update schizophrenia_brief_a_auto" ON "public"."schizophrenia_brief_a_auto"
    FOR UPDATE USING ((EXISTS ( SELECT 1
       FROM "public"."user_profiles"
      WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));

-- Grant permissions
GRANT ALL ON TABLE "public"."schizophrenia_brief_a_auto" TO "anon";
GRANT ALL ON TABLE "public"."schizophrenia_brief_a_auto" TO "authenticated";
GRANT ALL ON TABLE "public"."schizophrenia_brief_a_auto" TO "service_role";
