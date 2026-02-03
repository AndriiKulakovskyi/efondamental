-- Migration: Create schizophrenia-specific tables for YMRS, CGI, and EGF questionnaires
-- Purpose: Isolate schizophrenia pathology vertical from bipolar
-- Date: 2026-02-03

-- ============================================================================
-- Table: schizophrenia_ymrs (Young Mania Rating Scale)
-- ============================================================================

CREATE TABLE IF NOT EXISTS "public"."schizophrenia_ymrs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
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
    "total_score" integer,
    "severity" "text",
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "schizophrenia_ymrs_q1_check" CHECK ((("q1" >= 0) AND ("q1" <= 4))),
    CONSTRAINT "schizophrenia_ymrs_q2_check" CHECK ((("q2" >= 0) AND ("q2" <= 4))),
    CONSTRAINT "schizophrenia_ymrs_q3_check" CHECK ((("q3" >= 0) AND ("q3" <= 4))),
    CONSTRAINT "schizophrenia_ymrs_q4_check" CHECK ((("q4" >= 0) AND ("q4" <= 4))),
    CONSTRAINT "schizophrenia_ymrs_q5_check" CHECK ((("q5" >= 0) AND ("q5" <= 8))),
    CONSTRAINT "schizophrenia_ymrs_q6_check" CHECK ((("q6" >= 0) AND ("q6" <= 8))),
    CONSTRAINT "schizophrenia_ymrs_q7_check" CHECK ((("q7" >= 0) AND ("q7" <= 4))),
    CONSTRAINT "schizophrenia_ymrs_q8_check" CHECK ((("q8" >= 0) AND ("q8" <= 8))),
    CONSTRAINT "schizophrenia_ymrs_q9_check" CHECK ((("q9" >= 0) AND ("q9" <= 8))),
    CONSTRAINT "schizophrenia_ymrs_q10_check" CHECK ((("q10" >= 0) AND ("q10" <= 4))),
    CONSTRAINT "schizophrenia_ymrs_q11_check" CHECK ((("q11" >= 0) AND ("q11" <= 4)))
);

ALTER TABLE "public"."schizophrenia_ymrs" OWNER TO "postgres";

-- Primary key
ALTER TABLE "public"."schizophrenia_ymrs"
    ADD CONSTRAINT "schizophrenia_ymrs_pkey" PRIMARY KEY ("id");

-- Unique constraint on visit_id (enables upsert)
ALTER TABLE "public"."schizophrenia_ymrs"
    ADD CONSTRAINT "schizophrenia_ymrs_visit_id_key" UNIQUE ("visit_id");

-- Foreign keys
ALTER TABLE "public"."schizophrenia_ymrs"
    ADD CONSTRAINT "schizophrenia_ymrs_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;

ALTER TABLE "public"."schizophrenia_ymrs"
    ADD CONSTRAINT "schizophrenia_ymrs_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;

ALTER TABLE "public"."schizophrenia_ymrs"
    ADD CONSTRAINT "schizophrenia_ymrs_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");

-- Indexes
CREATE INDEX "idx_schizophrenia_ymrs_visit_id" ON "public"."schizophrenia_ymrs" USING "btree" ("visit_id");
CREATE INDEX "idx_schizophrenia_ymrs_patient_id" ON "public"."schizophrenia_ymrs" USING "btree" ("patient_id");

-- Enable RLS
ALTER TABLE "public"."schizophrenia_ymrs" ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Patients view own schizophrenia_ymrs" ON "public"."schizophrenia_ymrs" 
    FOR SELECT USING (("auth"."uid"() = "patient_id"));

CREATE POLICY "Professionals view all schizophrenia_ymrs" ON "public"."schizophrenia_ymrs" 
    FOR SELECT USING ((EXISTS ( SELECT 1
       FROM "public"."user_profiles"
      WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));

CREATE POLICY "Professionals insert schizophrenia_ymrs" ON "public"."schizophrenia_ymrs" 
    FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
       FROM "public"."user_profiles"
      WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));

CREATE POLICY "Professionals update schizophrenia_ymrs" ON "public"."schizophrenia_ymrs" 
    FOR UPDATE USING ((EXISTS ( SELECT 1
       FROM "public"."user_profiles"
      WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));

-- ============================================================================
-- Table: schizophrenia_cgi (Clinical Global Impressions)
-- ============================================================================

CREATE TABLE IF NOT EXISTS "public"."schizophrenia_cgi" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "cgi_s" integer,
    "cgi_i" integer,
    "therapeutic_effect" integer,
    "side_effects" integer,
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "therapeutic_index" integer,
    "therapeutic_index_label" "text",
    "visit_type" "text",
    CONSTRAINT "schizophrenia_cgi_cgi_s_check" CHECK ((("cgi_s" >= 0) AND ("cgi_s" <= 7))),
    CONSTRAINT "schizophrenia_cgi_cgi_i_check" CHECK ((("cgi_i" >= 0) AND ("cgi_i" <= 7))),
    CONSTRAINT "schizophrenia_cgi_therapeutic_effect_check" CHECK ((("therapeutic_effect" >= 0) AND ("therapeutic_effect" <= 4))),
    CONSTRAINT "schizophrenia_cgi_side_effects_check" CHECK ((("side_effects" >= 0) AND ("side_effects" <= 3)))
);

ALTER TABLE "public"."schizophrenia_cgi" OWNER TO "postgres";

-- Primary key
ALTER TABLE "public"."schizophrenia_cgi"
    ADD CONSTRAINT "schizophrenia_cgi_pkey" PRIMARY KEY ("id");

-- Unique constraint on visit_id (enables upsert)
ALTER TABLE "public"."schizophrenia_cgi"
    ADD CONSTRAINT "schizophrenia_cgi_visit_id_key" UNIQUE ("visit_id");

-- Foreign keys
ALTER TABLE "public"."schizophrenia_cgi"
    ADD CONSTRAINT "schizophrenia_cgi_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;

ALTER TABLE "public"."schizophrenia_cgi"
    ADD CONSTRAINT "schizophrenia_cgi_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;

ALTER TABLE "public"."schizophrenia_cgi"
    ADD CONSTRAINT "schizophrenia_cgi_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");

-- Indexes
CREATE INDEX "idx_schizophrenia_cgi_visit_id" ON "public"."schizophrenia_cgi" USING "btree" ("visit_id");
CREATE INDEX "idx_schizophrenia_cgi_patient_id" ON "public"."schizophrenia_cgi" USING "btree" ("patient_id");

-- Enable RLS
ALTER TABLE "public"."schizophrenia_cgi" ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Patients view own schizophrenia_cgi" ON "public"."schizophrenia_cgi" 
    FOR SELECT USING (("auth"."uid"() = "patient_id"));

CREATE POLICY "Professionals view all schizophrenia_cgi" ON "public"."schizophrenia_cgi" 
    FOR SELECT USING ((EXISTS ( SELECT 1
       FROM "public"."user_profiles"
      WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));

CREATE POLICY "Professionals insert schizophrenia_cgi" ON "public"."schizophrenia_cgi" 
    FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
       FROM "public"."user_profiles"
      WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));

CREATE POLICY "Professionals update schizophrenia_cgi" ON "public"."schizophrenia_cgi" 
    FOR UPDATE USING ((EXISTS ( SELECT 1
       FROM "public"."user_profiles"
      WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));

-- ============================================================================
-- Table: schizophrenia_egf (Echelle Globale de Fonctionnement)
-- ============================================================================

CREATE TABLE IF NOT EXISTS "public"."schizophrenia_egf" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "egf_score" integer,
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "schizophrenia_egf_egf_score_check" CHECK ((("egf_score" >= 1) AND ("egf_score" <= 100)))
);

ALTER TABLE "public"."schizophrenia_egf" OWNER TO "postgres";

-- Primary key
ALTER TABLE "public"."schizophrenia_egf"
    ADD CONSTRAINT "schizophrenia_egf_pkey" PRIMARY KEY ("id");

-- Unique constraint on visit_id (enables upsert)
ALTER TABLE "public"."schizophrenia_egf"
    ADD CONSTRAINT "schizophrenia_egf_visit_id_key" UNIQUE ("visit_id");

-- Foreign keys
ALTER TABLE "public"."schizophrenia_egf"
    ADD CONSTRAINT "schizophrenia_egf_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;

ALTER TABLE "public"."schizophrenia_egf"
    ADD CONSTRAINT "schizophrenia_egf_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;

ALTER TABLE "public"."schizophrenia_egf"
    ADD CONSTRAINT "schizophrenia_egf_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");

-- Indexes
CREATE INDEX "idx_schizophrenia_egf_visit_id" ON "public"."schizophrenia_egf" USING "btree" ("visit_id");
CREATE INDEX "idx_schizophrenia_egf_patient_id" ON "public"."schizophrenia_egf" USING "btree" ("patient_id");

-- Enable RLS
ALTER TABLE "public"."schizophrenia_egf" ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Patients view own schizophrenia_egf" ON "public"."schizophrenia_egf" 
    FOR SELECT USING (("auth"."uid"() = "patient_id"));

CREATE POLICY "Professionals view all schizophrenia_egf" ON "public"."schizophrenia_egf" 
    FOR SELECT USING ((EXISTS ( SELECT 1
       FROM "public"."user_profiles"
      WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));

CREATE POLICY "Professionals insert schizophrenia_egf" ON "public"."schizophrenia_egf" 
    FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
       FROM "public"."user_profiles"
      WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));

CREATE POLICY "Professionals update schizophrenia_egf" ON "public"."schizophrenia_egf" 
    FOR UPDATE USING ((EXISTS ( SELECT 1
       FROM "public"."user_profiles"
      WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));
