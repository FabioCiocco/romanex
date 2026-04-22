import { Router } from "express";
import { getAuth } from "@clerk/express";
import {
  db,
  annunciTable,
  userProfilesTable,
  forumThreadsTable,
  forumRepliesTable,
} from "@workspace/db";
import { eq, desc, ilike, sql, count, or, and } from "drizzle-orm";

const router = Router();

function getAdminIds(): string[] {
  return (process.env.ADMIN_CLERK_IDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

router.use((req, res, next) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: "Non autenticato" });
  const adminIds = getAdminIds();
  if (!adminIds.includes(userId)) {
    return res.status(403).json({ error: "Accesso negato" });
  }
  next();
});

router.get("/check", (_req, res) => {
  return res.json({ isAdmin: true });
});

router.get("/stats", async (_req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [[{ totaleAnnunci }], [{ annunciOggi }], [{ totaleUtenti }], [{ utentiOggi }], [{ totaleThread }], [{ totaleRisposte }]] =
      await Promise.all([
        db.select({ totaleAnnunci: count() }).from(annunciTable),
        db
          .select({ annunciOggi: count() })
          .from(annunciTable)
          .where(sql`${annunciTable.createdAt} >= ${today}`),
        db.select({ totaleUtenti: count() }).from(userProfilesTable),
        db
          .select({ utentiOggi: count() })
          .from(userProfilesTable)
          .where(sql`${userProfilesTable.createdAt} >= ${today}`),
        db.select({ totaleThread: count() }).from(forumThreadsTable),
        db.select({ totaleRisposte: count() }).from(forumRepliesTable),
      ]);

    const annunciPerCategoria = await db
      .select({ categoria: annunciTable.categoria, count: count() })
      .from(annunciTable)
      .groupBy(annunciTable.categoria)
      .orderBy(desc(count()));

    const annunciRecenti = await db
      .select()
      .from(annunciTable)
      .orderBy(desc(annunciTable.createdAt))
      .limit(5);

    return res.json({
      totaleAnnunci,
      annunciOggi,
      totaleUtenti,
      utentiOggi,
      totaleThread,
      totaleRisposte,
      annunciPerCategoria,
      annunciRecenti,
    });
  } catch (err) {
    return res.status(500).json({ error: "Errore server" });
  }
});

router.get("/annunci", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string) || 20);
    const q = (req.query.q as string) || "";
    const categoria = (req.query.categoria as string) || "";
    const offset = (page - 1) * limit;

    const conditions = [];
    if (q)
      conditions.push(
        or(
          ilike(annunciTable.titolo, `%${q}%`),
          ilike(annunciTable.descrizione, `%${q}%`),
          ilike(annunciTable.contatto, `%${q}%`)
        )
      );
    if (categoria) conditions.push(eq(annunciTable.categoria, categoria));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [annunci, [{ total }]] = await Promise.all([
      db
        .select()
        .from(annunciTable)
        .where(whereClause)
        .orderBy(desc(annunciTable.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ total: count() }).from(annunciTable).where(whereClause),
    ]);

    return res.json({
      annunci,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    return res.status(500).json({ error: "Errore server" });
  }
});

router.patch("/annunci/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID non valido" });

    const updates: Record<string, unknown> = {};
    if (req.body.inEvidenza !== undefined) updates.inEvidenza = Boolean(req.body.inEvidenza);
    if (req.body.titolo !== undefined) updates.titolo = req.body.titolo;
    if (req.body.categoria !== undefined) updates.categoria = req.body.categoria;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "Nessun campo da aggiornare" });
    }

    const [updated] = await db
      .update(annunciTable)
      .set(updates)
      .where(eq(annunciTable.id, id))
      .returning();

    if (!updated) return res.status(404).json({ error: "Annuncio non trovato" });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: "Errore server" });
  }
});

router.delete("/annunci/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID non valido" });
    await db.delete(annunciTable).where(eq(annunciTable.id, id));
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: "Errore server" });
  }
});

router.get("/utenti", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string) || 20);
    const q = (req.query.q as string) || "";
    const offset = (page - 1) * limit;

    const conditions = [];
    if (q)
      conditions.push(
        or(
          ilike(userProfilesTable.username, `%${q}%`),
          ilike(userProfilesTable.email, `%${q}%`),
          ilike(userProfilesTable.nome, `%${q}%`),
          ilike(userProfilesTable.cognome, `%${q}%`)
        )
      );

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [utenti, [{ total }]] = await Promise.all([
      db
        .select()
        .from(userProfilesTable)
        .where(whereClause)
        .orderBy(desc(userProfilesTable.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ total: count() }).from(userProfilesTable).where(whereClause),
    ]);

    return res.json({
      utenti,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    return res.status(500).json({ error: "Errore server" });
  }
});

router.delete("/utenti/:clerkId", async (req, res) => {
  try {
    const clerkId = req.params.clerkId;
    await db
      .delete(userProfilesTable)
      .where(eq(userProfilesTable.clerkId, clerkId));
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: "Errore server" });
  }
});

router.get("/forum/threads", async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string) || 20);
    const q = (req.query.q as string) || "";
    const offset = (page - 1) * limit;

    const conditions = [];
    if (q)
      conditions.push(
        or(
          ilike(forumThreadsTable.titolo, `%${q}%`),
          ilike(forumThreadsTable.autore, `%${q}%`)
        )
      );

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [threads, [{ total }]] = await Promise.all([
      db
        .select()
        .from(forumThreadsTable)
        .where(whereClause)
        .orderBy(desc(forumThreadsTable.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ total: count() }).from(forumThreadsTable).where(whereClause),
    ]);

    return res.json({
      threads,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    return res.status(500).json({ error: "Errore server" });
  }
});

router.delete("/forum/threads/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID non valido" });
    await db.delete(forumThreadsTable).where(eq(forumThreadsTable.id, id));
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: "Errore server" });
  }
});

router.delete("/forum/replies/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID non valido" });
    await db.delete(forumRepliesTable).where(eq(forumRepliesTable.id, id));
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: "Errore server" });
  }
});

router.delete("/annunci-all", async (_req, res) => {
  try {
    await db.delete(annunciTable);
    return res.json({ ok: true, message: "Tutti gli annunci eliminati" });
  } catch (err) {
    return res.status(500).json({ error: "Errore server" });
  }
});

export { router as adminRouter };
