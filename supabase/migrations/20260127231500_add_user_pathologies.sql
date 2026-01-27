-- Create user_pathologies table for many-to-many relationship
CREATE TABLE IF NOT EXISTS "public"."user_pathologies" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "user_id" UUID NOT NULL REFERENCES "public"."user_profiles"("id") ON DELETE CASCADE,
    "pathology_id" UUID NOT NULL REFERENCES "public"."pathologies"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE("user_id", "pathology_id")
);

-- Enable RLS
ALTER TABLE "public"."user_pathologies" ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "user_pathologies_select" ON "public"."user_pathologies"
    FOR SELECT TO authenticated USING (true);

-- Allow admins and managers to manage assignments
-- For now, using a simple 'authenticated' policy for development, but in production, this should be restricted
CREATE POLICY "user_pathologies_all_authenticated" ON "public"."user_pathologies"
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Indexes
CREATE INDEX "idx_user_pathologies_user" ON "public"."user_pathologies"("user_id");
CREATE INDEX "idx_user_pathologies_pathology" ON "public"."user_pathologies"("pathology_id");
