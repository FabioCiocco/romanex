import { Router } from "express";
import { db, forumThreadsTable, forumRepliesTable, insertForumThreadSchema, insertForumReplySchema } from "@workspace/db";
import { eq, desc, and, count, sql } from "drizzle-orm";

const router = Router();

const FORUM_CATEGORIE = [
  "Vita universitaria",
  "Esami & Studio",
  "Erasmus & Estero",
  "Casa & Logistica",
  "Lavoro & Stage",
  "Off Topic",
];

router.get("/categorie", (_req, res) => {
  res.json(FORUM_CATEGORIE);
});

router.get("/", async (req, res) => {
  try {
    const categoria = req.query.categoria as string | undefined;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));
    const offset = (page - 1) * limit;

    const where = categoria ? eq(forumThreadsTable.categoria, categoria) : undefined;

    const [threads, [{ total }]] = await Promise.all([
      db.select().from(forumThreadsTable)
        .where(where)
        .orderBy(desc(forumThreadsTable.updatedAt))
        .limit(limit)
        .offset(offset),
      db.select({ total: count() }).from(forumThreadsTable).where(where),
    ]);

    res.json({
      threads,
      total: Number(total),
      page,
      limit,
      totalPages: Math.ceil(Number(total) / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore del server" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID non valido" });

    const [thread] = await db.select().from(forumThreadsTable).where(eq(forumThreadsTable.id, id));
    if (!thread) return res.status(404).json({ error: "Discussione non trovata" });

    const replies = await db.select().from(forumRepliesTable)
      .where(eq(forumRepliesTable.threadId, id))
      .orderBy(forumRepliesTable.createdAt);

    res.json({ thread, replies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore del server" });
  }
});

router.post("/", async (req, res) => {
  try {
    const parsed = insertForumThreadSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Dati non validi", details: parsed.error.issues });

    const [thread] = await db.insert(forumThreadsTable).values(parsed.data).returning();
    res.status(201).json(thread);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore del server" });
  }
});

router.post("/:id/risposte", async (req, res) => {
  try {
    const threadId = parseInt(req.params.id);
    if (isNaN(threadId)) return res.status(400).json({ error: "ID non valido" });

    const [thread] = await db.select({ id: forumThreadsTable.id }).from(forumThreadsTable).where(eq(forumThreadsTable.id, threadId));
    if (!thread) return res.status(404).json({ error: "Discussione non trovata" });

    const replyBodySchema = insertForumReplySchema.omit({ threadId: true });
    const parsed = replyBodySchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Dati non validi", details: parsed.error.issues });

    const [reply] = await db.insert(forumRepliesTable).values({ ...parsed.data, threadId }).returning();

    await db.update(forumThreadsTable)
      .set({ risposteCount: sql`${forumThreadsTable.risposteCount} + 1`, updatedAt: new Date() })
      .where(eq(forumThreadsTable.id, threadId));

    res.status(201).json(reply);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore del server" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID non valido" });

    const clerkId = (req as any).auth?.userId;
    const [thread] = await db.select().from(forumThreadsTable).where(eq(forumThreadsTable.id, id));
    if (!thread) return res.status(404).json({ error: "Non trovato" });
    if (thread.autoreClerkId && clerkId && thread.autoreClerkId !== clerkId) {
      return res.status(403).json({ error: "Non autorizzato" });
    }

    await db.delete(forumThreadsTable).where(eq(forumThreadsTable.id, id));
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore del server" });
  }
});

router.delete("/:threadId/risposte/:replyId", async (req, res) => {
  try {
    const threadId = parseInt(req.params.threadId);
    const replyId = parseInt(req.params.replyId);
    if (isNaN(threadId) || isNaN(replyId)) return res.status(400).json({ error: "ID non valido" });

    const clerkId = (req as any).auth?.userId;
    const [reply] = await db.select().from(forumRepliesTable)
      .where(and(eq(forumRepliesTable.id, replyId), eq(forumRepliesTable.threadId, threadId)));
    if (!reply) return res.status(404).json({ error: "Non trovata" });
    if (reply.autoreClerkId && clerkId && reply.autoreClerkId !== clerkId) {
      return res.status(403).json({ error: "Non autorizzato" });
    }

    await db.delete(forumRepliesTable).where(eq(forumRepliesTable.id, replyId));
    await db.update(forumThreadsTable)
      .set({ risposteCount: sql`GREATEST(${forumThreadsTable.risposteCount} - 1, 0)` })
      .where(eq(forumThreadsTable.id, threadId));

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore del server" });
  }
});

export { router as forumRouter };
