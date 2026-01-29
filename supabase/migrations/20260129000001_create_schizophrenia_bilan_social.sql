-- ============================================================================
-- Migration: Create schizophrenia_bilan_social table
-- Description: Social evaluation questionnaire for schizophrenia initial visits
-- ============================================================================

-- Create the table
CREATE TABLE IF NOT EXISTS "public"."schizophrenia_bilan_social" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    
    -- Q1 - Marital status
    "marital_status" "text",
    
    -- Q2 - Number of children
    "children_count" integer,
    
    -- Q3 - Education level
    "education" "text",
    
    -- Q4 - Professional status
    "professional_status" "text",
    
    -- Q5 - Professional class
    "professional_class" "text",
    
    -- Q6 - Current work leave
    "current_work_leave" "text",
    
    -- Q7 - Past year work leave
    "past_year_work_leave" "text",
    
    -- Q7a - Cumulative weeks (conditional on Q7 = oui)
    "past_year_leave_weeks" integer,
    
    -- Q8 - Income types (multiple choice)
    "income_types" "text"[],
    
    -- Q9 - Monthly income estimate
    "monthly_income" "text",
    
    -- Q10 - Housing type
    "housing_type" "text",
    
    -- Q11 - Protection measures
    "protection_measures" "text",
    
    -- Q11a - Protection start year (conditional)
    "protection_start_year" integer,
    
    -- Q11b - Justice safeguard (conditional)
    "justice_safeguard" boolean,
    
    -- Metadata
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."schizophrenia_bilan_social" OWNER TO "postgres";

-- Primary key constraint
ALTER TABLE ONLY "public"."schizophrenia_bilan_social"
    ADD CONSTRAINT "schizophrenia_bilan_social_pkey" PRIMARY KEY ("id");

-- Unique constraint on visit_id (one response per visit)
ALTER TABLE ONLY "public"."schizophrenia_bilan_social"
    ADD CONSTRAINT "schizophrenia_bilan_social_visit_id_key" UNIQUE ("visit_id");

-- Foreign key constraints
ALTER TABLE ONLY "public"."schizophrenia_bilan_social"
    ADD CONSTRAINT "schizophrenia_bilan_social_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."schizophrenia_bilan_social"
    ADD CONSTRAINT "schizophrenia_bilan_social_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."schizophrenia_bilan_social"
    ADD CONSTRAINT "schizophrenia_bilan_social_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");

-- Enable Row Level Security
ALTER TABLE "public"."schizophrenia_bilan_social" ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Patients (1 policy: SELECT only)
CREATE POLICY "Patients view own schizophrenia_bilan_social" ON "public"."schizophrenia_bilan_social" 
    FOR SELECT USING (("auth"."uid"() = "patient_id"));

-- RLS Policies for Professionals (4 policies: SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Professionals view schizophrenia_bilan_social" ON "public"."schizophrenia_bilan_social" 
    FOR SELECT USING ((EXISTS ( SELECT 1
       FROM "public"."user_profiles"
      WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));

CREATE POLICY "Professionals insert schizophrenia_bilan_social" ON "public"."schizophrenia_bilan_social" 
    FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
       FROM "public"."user_profiles"
      WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));

CREATE POLICY "Professionals update schizophrenia_bilan_social" ON "public"."schizophrenia_bilan_social" 
    FOR UPDATE USING ((EXISTS ( SELECT 1
       FROM "public"."user_profiles"
      WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));

-- Grant permissions
GRANT ALL ON TABLE "public"."schizophrenia_bilan_social" TO "anon";
GRANT ALL ON TABLE "public"."schizophrenia_bilan_social" TO "authenticated";
GRANT ALL ON TABLE "public"."schizophrenia_bilan_social" TO "service_role";

-- ============================================================================
-- Update get_visit_detail_data RPC function to include BILAN_SOCIAL_SZ status
-- ============================================================================

-- This needs to be done by updating the existing function
-- The function should include:
-- 'BILAN_SOCIAL_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_bilan_social WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_bilan_social WHERE visit_id = p_visit_id))
-- in the v_statuses JSON object for schizophrenia visits

-- Note: The RPC function update should be handled separately as it requires
-- replacing the entire function definition. For now, the table is created
-- and the application will work, but the completion status won't show until
-- the RPC function is updated.
