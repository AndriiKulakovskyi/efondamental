-- Migration: Add bipolar_followup_sis table
-- SIS la plus récente (suivi) - only filled when ISA suivi Q5 = Oui

CREATE TABLE IF NOT EXISTS "public"."bipolar_followup_sis" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "visit_id" uuid NOT NULL,
    "patient_id" uuid NOT NULL,
    "questionnaire_done" text,
    "q1" integer,
    "q2" integer,
    "q3" integer,
    "q4" integer,
    "q5" integer,
    "q6" integer,
    "q7" integer,
    "q8" integer,
    "q9" integer,
    "q10" integer,
    "q11" integer,
    "q12" integer,
    "q13" integer,
    "q14" integer,
    "q15" integer,
    "objective_score" integer,
    "subjective_score" integer,
    "total_score" integer,
    "interpretation" text,
    "completed_by" uuid,
    "completed_at" timestamp with time zone DEFAULT now(),
    "created_at" timestamp with time zone DEFAULT now(),
    "updated_at" timestamp with time zone DEFAULT now(),
    CONSTRAINT "bipolar_followup_sis_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "bipolar_followup_sis_visit_id_key" UNIQUE ("visit_id"),
    CONSTRAINT "bipolar_followup_sis_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE,
    CONSTRAINT "bipolar_followup_sis_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE,
    CONSTRAINT "bipolar_followup_sis_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id")
);

ALTER TABLE "public"."bipolar_followup_sis" OWNER TO "postgres";

-- Indexes
CREATE INDEX IF NOT EXISTS "idx_bipolar_followup_sis_visit" ON "public"."bipolar_followup_sis" USING btree ("visit_id");
CREATE INDEX IF NOT EXISTS "idx_bipolar_followup_sis_patient" ON "public"."bipolar_followup_sis" USING btree ("patient_id");

-- RLS
ALTER TABLE "public"."bipolar_followup_sis" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Pros view bipolar_followup_sis" ON "public"."bipolar_followup_sis"
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = ANY (ARRAY['healthcare_professional'::public.user_role, 'manager'::public.user_role, 'administrator'::public.user_role])
        )
    );

CREATE POLICY "Pros insert bipolar_followup_sis" ON "public"."bipolar_followup_sis"
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = ANY (ARRAY['healthcare_professional'::public.user_role, 'manager'::public.user_role, 'administrator'::public.user_role])
        )
    );

CREATE POLICY "Pros update bipolar_followup_sis" ON "public"."bipolar_followup_sis"
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = ANY (ARRAY['healthcare_professional'::public.user_role, 'manager'::public.user_role, 'administrator'::public.user_role])
        )
    );

-- Grants
GRANT ALL ON TABLE "public"."bipolar_followup_sis" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_followup_sis" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_followup_sis" TO "service_role";
