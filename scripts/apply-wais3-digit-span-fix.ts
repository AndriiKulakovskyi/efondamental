/**
 * Script to apply WAIS3 Digit Span column type fix
 * Run with: npx tsx scripts/apply-wais3-digit-span-fix.ts
 * 
 * This fixes the error: invalid input syntax for type integer: "1.67"
 * The wais_mc_cr column stores the standardized value (wais_mc_std - 10) / 3
 * which produces decimal values, but the column was defined as INTEGER.
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// SQL to fix column types - this is the same as migration 278
const fixSql = `
-- Fix WAIS-III Digit Span Column Types
-- The wais_mc_cr (standardized value) is calculated as (standard_score - 10) / 3
-- which produces decimal values like 1.67, so it must be DECIMAL, not INTEGER.

-- Change wais_mc_cr from INTEGER to DECIMAL(5,2)
ALTER TABLE bipolar_wais3_digit_span
  ALTER COLUMN wais_mc_cr TYPE DECIMAL(5,2);

-- Also ensure z-score columns are DECIMAL (they should be, but ensure consistency)
ALTER TABLE bipolar_wais3_digit_span
  ALTER COLUMN wais_mc_end_z TYPE DECIMAL(5,2),
  ALTER COLUMN wais_mc_env_z TYPE DECIMAL(5,2);

-- Add comments for clarity
COMMENT ON COLUMN bipolar_wais3_digit_span.wais_mc_cr IS 'Standardized value: (wais_mc_std - 10) / 3 - Decimal value';
COMMENT ON COLUMN bipolar_wais3_digit_span.wais_mc_end_z IS 'Forward span z-score - Decimal value';
COMMENT ON COLUMN bipolar_wais3_digit_span.wais_mc_env_z IS 'Backward span z-score - Decimal value';
`;

async function applyFix() {
  console.log('Applying WAIS3 Digit Span column type fix...\n');

  try {
    console.log('Executing SQL via RPC...');
    const { error } = await supabase.rpc('exec_sql', { sql_query: fixSql });

    if (error) {
      throw new Error(`RPC error: ${error.message}`);
    }

    console.log('Successfully updated column types!');
    console.log('\nColumn changes:');
    console.log('  - wais_mc_cr: INTEGER -> DECIMAL(5,2)');
    console.log('  - wais_mc_end_z: Ensured DECIMAL(5,2)');
    console.log('  - wais_mc_env_z: Ensured DECIMAL(5,2)');
    console.log('\nWAIS3 Digit Span questionnaire is now ready to use!');

  } catch (error: any) {
    console.error('\nError applying fix:', error.message);
    console.error('\nPlease apply the following SQL manually in Supabase Dashboard SQL Editor:');
    console.error('\n--- Copy from here ---\n');
    console.error(fixSql);
    console.error('\n--- End of SQL ---\n');
    process.exit(1);
  }
}

applyFix();
