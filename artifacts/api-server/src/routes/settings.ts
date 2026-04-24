import { Router } from "express";
import { db, settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";
import { sql } from "drizzle-orm";

const router = Router();

const ALLOWED_KEYS = [
  "welcome_email_subject",
  "welcome_email_body",
  "welcome_email_cta_text",
];

const DEFAULTS: Record<string, string> = {
  welcome_email_subject: "Benvenuto su RomaNex! 🎓",
  welcome_email_body:
    "Il tuo account su RomaNex è attivo. Ora sei parte della bacheca digitale degli studenti universitari di Roma.",
  welcome_email_cta_text: "Vai alla Bacheca →",
};

router.get("/", requireAdmin, async (_req, res) => {
  const rows = await db.select().from(settingsTable);
  const map: Record<string, string> = { ...DEFAULTS };
  for (const row of rows) map[row.key] = row.value;
  return res.json(map);
});

router.put("/", requireAdmin, async (req, res) => {
  const updates = req.body as Record<string, string>;
  for (const key of ALLOWED_KEYS) {
    if (key in updates) {
      await db
        .insert(settingsTable)
        .values({ key, value: updates[key] })
        .onConflictDoUpdate({
          target: settingsTable.key,
          set: { value: updates[key], updatedAt: sql`now()` },
        });
    }
  }
  return res.json({ ok: true });
});

export { DEFAULTS as settingsDefaults };
export { router as settingsRouter };
