import { pool } from "@workspace/db";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { logger } from "./logger";

export async function runStartupTasks(): Promise<void> {
  await ensureSessionTable();
  await ensureAdminUser();
}

async function ensureSessionTable(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL,
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL,
        CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
      );
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
    `);
    logger.info("Session table ensured");
  } catch (err) {
    logger.error({ err }, "Failed to ensure session table");
  } finally {
    client.release();
  }
}

async function ensureAdminUser(): Promise<void> {
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  for (const email of adminEmails) {
    try {
      const existing = await db
        .select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1);

      if (existing.length === 0) {
        const passwordHash = await bcrypt.hash("RomaNex2025!", 12);
        await db.insert(usersTable).values({
          id: crypto.randomUUID(),
          email,
          passwordHash,
        });
        logger.info({ email }, "Admin user created at startup");
      }
    } catch (err) {
      logger.error({ err, email }, "Failed to ensure admin user");
    }
  }
}
