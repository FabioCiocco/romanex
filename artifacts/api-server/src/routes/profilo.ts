import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db, userProfilesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { sendWelcomeEmail } from "../lib/email";

const router = Router();

router.get("/", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: "Non autorizzato" });
  }

  const profiles = await db
    .select()
    .from(userProfilesTable)
    .where(eq(userProfilesTable.clerkId, userId))
    .limit(1);

  if (profiles.length === 0) {
    return res.status(404).json({ error: "Profilo non trovato" });
  }

  return res.json(profiles[0]);
});

router.put("/", async (req, res) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: "Non autorizzato" });
  }

  const { username, nome, cognome, email, universita, annoCorso, corsoDiLaurea, telefono } = req.body;

  if (!username || !nome || !cognome || !email || !universita || !annoCorso || !corsoDiLaurea) {
    return res.status(400).json({ error: "Campi obbligatori mancanti" });
  }

  const usernameRegex = /^[a-z0-9_]{3,30}$/;
  if (!usernameRegex.test(username)) {
    return res.status(400).json({ error: "USERNAME_INVALID" });
  }

  const existing = await db
    .select({ clerkId: userProfilesTable.clerkId })
    .from(userProfilesTable)
    .where(eq(userProfilesTable.username, username))
    .limit(1);
  if (existing.length > 0 && existing[0].clerkId !== userId) {
    return res.status(409).json({ error: "USERNAME_TAKEN" });
  }

  const existingProfile = await db
    .select({ clerkId: userProfilesTable.clerkId })
    .from(userProfilesTable)
    .where(eq(userProfilesTable.clerkId, userId))
    .limit(1);
  const isNewProfile = existingProfile.length === 0;

  const [profile] = await db
    .insert(userProfilesTable)
    .values({
      clerkId: userId,
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
      target: userProfilesTable.clerkId,
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
    sendWelcomeEmail({ to: email, nome, universita, corsoDiLaurea }).catch(() => {});
  }

  return res.json(profile);
});

export { router as profiloRouter };
