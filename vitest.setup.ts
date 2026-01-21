// Vitest Setup File
// This file runs before each test file

import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables - try multiple locations
const envPaths = [
  path.resolve(process.cwd(), '.env.local'),
  path.resolve(process.cwd(), '.env'),
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

// Ensure required environment variables are set
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.warn(`Warning: ${envVar} is not set. Some tests may fail.`);
  }
}

// Global test configuration
beforeAll(() => {
  // Any global setup before all tests
  console.log('Starting integration tests...');
});

afterAll(() => {
  // Any global cleanup after all tests
  console.log('Integration tests completed.');
});
