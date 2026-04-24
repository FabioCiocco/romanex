#!/bin/bash
# Migration script: handles clerk_id -> user_id rename in user_profiles
# Runs idempotently — safe to run multiple times
set -e

if [ -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL not set, skipping migration"
  exit 0
fi

node --input-type=module <<'EOF'
import pg from '/home/runner/workspace/lib/db/node_modules/pg/lib/index.js';
const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const client = await pool.connect();
try {
  const { rows } = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'clerk_id'
  `);
  if (rows.length > 0) {
    console.log('Renaming clerk_id -> user_id in user_profiles...');
    await client.query('ALTER TABLE user_profiles RENAME COLUMN clerk_id TO user_id');
    console.log('Migration done.');
  } else {
    console.log('clerk_id not found — migration already applied or not needed.');
  }
} finally {
  client.release();
  await pool.end();
}
EOF
