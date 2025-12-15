-- EMERGENCY: Force PostgREST schema cache reload
-- Run this if you're getting "column not found in schema cache" errors

-- Try multiple notification methods
NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';

SELECT pg_sleep(1);

-- Notify again
NOTIFY pgrst, 'reload schema';

-- Verify notification was sent
SELECT pg_notify('pgrst', 'reload schema');

-- Check if PostgREST is listening
SELECT * FROM pg_listening_channels();

