import { Router } from "express";
import { db, userProfilesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { sendWelcomeEmail } from "../lib/email";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  const userId = req.session.userId!;

  const profiles = await db
    .select()
    .from(userProfilesTable)
    .where(eq(userProfilesTable.userId, userId))
    .limit(1);

  if (profiles.length === 0) {
    return res.status(404).json({ error: "Profilo non trovato" });
  }

  return res.json(profiles[0]);
});

router.put("/", requireAuth, async (req, res) => {
  const userId = req.session.userId!;

  const { username, nome, cognome, email, universita, annoCorso, corsoDiLaurea, telefono } = req.body;

  if (!username || !nome || !cognome || !email || !universita || !annoCorso || !corsoDiLaurea) {
    return res.status(400).json({ error: "Campi obbligatori mancanti" });
  }

  const usernameRegex = /^[a-z0-9_]{3,30}$/;
  if (!usernameRegex.test(username)) {
    return res.status(400).json({ error: "USERNAME_INVALID" });
  }

  const existing = await db
    .select({ userId: userProfilesTable.userId })
    .from(userProfilesTable)
    .where(eq(userProfilesTable.username, username))
    .limit(1);
  if (existing.length > 0 && existing[0].userId !== userId) {
    return res.status(409).json({ error: "USERNAME_TAKEN" });
  }

  const existingProfile = await db
    .select({ userId: userProfilesTable.userId })
    .from(userProfilesTable)
    .where(eq(userProfilesTable.userId, userId))
    .limit(1);
  const isNewProfile = existingProfile.length === 0;

  const [profile] = await db
    .insert(userProfilesTable)
    .values({
      userId,
      username,
      nome,
      cognome,
      email,
      universita,
      annoCorso,
      corsoDiLaurea,
      telefono: telefono || null,
    })
    .onConflictDoUpdate({
      target: userProfilesTable.userId,
      set: {
        username,
        nome,
        cognome,
        email,
        universita,
        annoCorso,
        corsoDiLaurea,
        telefono: telefono || null,
        updatedAt: new Date(),
      },
    })
    .returning();

  if (isNewProfile && email) {
    sendWelcomeEmail({ to: email }).catch(() => {});
  }

  return res.json(profile);
});

export { router as profiloRouter };
