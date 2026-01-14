-- Fix FAST questionnaire submission error by increasing interpretation column size
-- The error "value too long for type character varying(100)" indicates 100 char limit

ALTER TABLE responses_fast ALTER COLUMN interpretation TYPE text;
