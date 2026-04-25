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
  // Migration 1: clerk_id -> user_id rename
  const { rows } = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'clerk_id'
  `);
  if (rows.length > 0) {
    console.log('Renaming clerk_id -> user_id in user_profiles...');
    await client.query('ALTER TABLE user_profiles RENAME COLUMN clerk_id TO user_id');
    console.log('Migration 1 done.');
  } else {
    console.log('Migration 1: clerk_id not found — already applied or not needed.');
  }

  // Migration 2: session table for connect-pg-simple
  await client.query(`
    CREATE TABLE IF NOT EXISTS "session" (
      "sid" varchar NOT NULL,
      "sess" json NOT NULL,
      "expire" timestamp(6) NOT NULL,
      CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
    );
    CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
  `);
  console.log('Migration 2: session table ensured.');

  // Migration 3: ensure admin user exists
  const adminEmail = (process.env.ADMIN_EMAILS || '').split(',')[0].trim().toLowerCase();
  if (adminEmail) {
    const { rows: existing } = await client.query(
      `SELECT id FROM users WHERE email = $1`, [adminEmail]
    );
    if (existing.length === 0) {
      const { randomUUID } = await import('crypto');
      // Default password: RomaNex2025! — user should change after first login
      const hash = '$2b$12$OLRSlzvJDv/g.VEipALereEUrfSK40FxDjtCIPnxZdNJcgz29tLrq';
      await client.query(
        `INSERT INTO users (id, email, password_hash, created_at) VALUES ($1, $2, $3, NOW())`,
        [randomUUID(), adminEmail, hash]
      );
      console.log('Migration 3: admin user created for', adminEmail);
    } else {
      console.log('Migration 3: admin user already exists for', adminEmail);
    }
  }
} finally {
  client.release();
  await pool.end();
}
EOF
