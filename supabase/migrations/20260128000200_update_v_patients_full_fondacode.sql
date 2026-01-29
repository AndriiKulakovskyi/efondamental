-- Update v_patients_full view to include fondacode
CREATE OR REPLACE VIEW "public"."v_patients_full" AS
 SELECT "p"."id",
    "p"."center_id",
    "p"."pathology_id",
    "p"."medical_record_number",
    "p"."first_name",
    "p"."last_name",
    "p"."date_of_birth",
    "p"."gender",
    "p"."email",
    "p"."phone",
    "p"."address",
    "p"."emergency_contact",
    "p"."metadata",
    "p"."active",
    "p"."created_by",
    "p"."created_at",
    "p"."updated_at",
    "p"."user_id",
    "p"."deleted_at",
    "p"."deleted_by",
    "p"."assigned_to",
    "p"."place_of_birth",
    "p"."years_of_education",
    "c"."name" AS "center_name",
    "c"."code" AS "center_code",
    "path"."type" AS "pathology_type",
    "path"."name" AS "pathology_name",
    "path"."color" AS "pathology_color",
    "up_created"."first_name" AS "created_by_first_name",
    "up_created"."last_name" AS "created_by_last_name",
    "up_assigned"."first_name" AS "assigned_to_first_name",
    "up_assigned"."last_name" AS "assigned_to_last_name",
    "up"."email" AS "professional_email",
    "up"."first_name" AS "professional_first_name",
    "up"."last_name" AS "professional_last_name",
    "p"."maiden_name",
    "p"."fondacode" -- Added fondacode field
   FROM ((((("public"."patients" "p"
     LEFT JOIN "public"."centers" "c" ON (("p"."center_id" = "c"."id")))
     LEFT JOIN "public"."pathologies" "path" ON (("p"."pathology_id" = "path"."id")))
     LEFT JOIN "public"."user_profiles" "up" ON (("p"."assigned_to" = "up"."id")))
     LEFT JOIN "public"."user_profiles" "up_created" ON (("p"."created_by" = "up_created"."id")))
     LEFT JOIN "public"."user_profiles" "up_assigned" ON (("p"."assigned_to" = "up_assigned"."id")))
  WHERE ("p"."deleted_at" IS NULL);
