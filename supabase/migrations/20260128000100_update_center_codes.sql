-- Update existing center codes to numeric 2-digit format
-- This migration updates the center codes to be numeric for fondacode generation

UPDATE "public"."centers" SET "code" = '01' WHERE "code" = 'CEP-BIP';
UPDATE "public"."centers" SET "code" = '02' WHERE "code" = 'CEP-SCZ';
UPDATE "public"."centers" SET "code" = '03' WHERE "code" = 'CEP-ASP';
UPDATE "public"."centers" SET "code" = '04' WHERE "code" = 'CEP-DEP';

-- For any other centers, you may need to assign numeric codes manually
-- Example:
-- UPDATE "public"."centers" SET "code" = '05' WHERE "name" = 'Your Center Name';
