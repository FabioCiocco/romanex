import { Router } from "express";
import { db, annunciTable, usersTable, userProfilesTable } from "@workspace/db";
import { eq, like, gte, lte, desc, and, count, sql, ilike } from "drizzle-orm";
import {
  ListAnnunciQueryParams,
  CreateAnnuncioBody,
  UpdateAnnuncioBody,
} from "@workspace/api-zod";
import { requireAuth } from "../middlewares/auth";
import { sendContactNotificationEmail } from "../lib/email";

const router = Router();

const CATEGORIE = [
  { id: "appartamenti", nome: "Appartamenti", icona: "Home", descrizione: "Stanze e appartamenti in affitto vicino all'università" },
  { id: "libri", nome: "Libri di Testo", icona: "BookOpen", descrizione: "Compra e vendi libri universitari usati" },
  { id: "ripetizioni", nome: "Ripetizioni", icona: "GraduationCap", descrizione: "Tutor e lezioni private per ogni materia" },
  { id: "consigli", nome: "Consigli", icona: "Lightbulb", descrizione: "Consigli su università, esami e vita da studente" },
  { id: "gruppi-studio", nome: "Gruppi Studio", icona: "Users", descrizione: "Trova compagni per studiare insieme" },
];

router.get("/", async (req, res) => {
  const parsed = ListAnnunciQueryParams.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ error: "Parametri non validi" });
  }

  const {
    categoria,
    q,
    prezzoMin,
    prezzoMax,
    citta,
    page = 1,
    limit = 20,
  } = parsed.data;

  const pageNum = page ?? 1;
  const limitNum = Math.min(limit ?? 20, 100);
  const offset = (pageNum - 1) * limitNum;

  const conditions = [];
  if (categoria) conditions.push(eq(annunciTable.categoria, categoria));
  if (q) conditions.push(ilike(annunciTable.titolo, `%${q}%`));
  if (prezzoMin != null) conditions.push(gte(annunciTable.prezzo, prezzoMin));
  if (prezzoMax != null) conditions.push(lte(annunciTable.prezzo, prezzoMax));
  if (citta) conditions.push(ilike(annunciTable.citta, `%${citta}%`));

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [annunci, totalResult] = await Promise.all([
    db
      .select()
      .from(annunciTable)
      .where(where)
      .orderBy(desc(annunciTable.inEvidenza), desc(annunciTable.createdAt))
      .limit(limitNum)
      .offset(offset),
    db.select({ count: count() }).from(annunciTable).where(where),
  ]);

  const total = totalResult[0]?.count ?? 0;

  return res.json({
    annunci,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
  });
});

router.get("/recenti", async (req, res) => {
  const annunci = await db
    .select()
    .from(annunciTable)
    .orderBy(desc(annunciTable.createdAt))
    .limit(8);
  return res.json(annunci);
});

router.get("/in-evidenza", async (req, res) => {
  const annunci = await db
    .select()
    .from(annunciTable)
    .where(eq(annunciTable.inEvidenza, true))
    .orderBy(desc(annunciTable.createdAt))
    .limit(6);
  return res.json(annunci);
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID non valido" });

  const annunci = await db
    .select()
    .from(annunciTable)
    .where(eq(annunciTable.id, id));

  if (annunci.length === 0) {
    return res.status(404).json({ error: "Annuncio non trovato" });
  }

  return res.json(annunci[0]);
});

router.post("/", async (req, res) => {
  const parsed = CreateAnnuncioBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Dati non validi", details: parsed.error.issues });
  }

  let autoreEmail: string | null = null;
  if (req.session?.userId) {
    const [user] = await db.select({ email: usersTable.email }).from(usersTable).where(eq(usersTable.id, req.session.userId));
    autoreEmail = user?.email ?? null;
  }

  const [annuncio] = await db
    .insert(annunciTable)
    .values({
      titolo: parsed.data.titolo,
      descrizione: parsed.data.descrizione,
      prezzo: parsed.data.prezzo ?? null,
      categoria: parsed.data.categoria,
      citta: parsed.data.citta,
      contatto: parsed.data.contatto,
      autoreEmail,
      immagineUrl: parsed.data.immagineUrl ?? null,
      inEvidenza: false,
    })
    .returning();

  return res.status(201).json(annuncio);
});

router.post("/:id/richiesta", requireAuth, async (req, res) => {
  const id = parseInt(req.params.id as string);
  if (isNaN(id)) return res.status(400).json({ error: "ID non valido" });

  const [annuncio] = await db.select().from(annunciTable).where(eq(annunciTable.id, id));
  if (!annuncio) return res.status(404).json({ error: "Annuncio non trovato" });
  if (!annuncio.autoreEmail) return res.status(200).json({ ok: true, notified: false });

  const userId = req.session!.userId!;
  const [user] = await db.select({ email: usersTable.email }).from(usersTable).where(eq(usersTable.id, userId));
  const [profile] = await db.select({ nome: userProfilesTable.nome, cognome: userProfilesTable.cognome }).from(userProfilesTable).where(eq(userProfilesTable.userId, userId));

  const richiedenteEmail = user?.email ?? "Utente RomaNex";
  const nome = [profile?.nome, profile?.cognome].filter(Boolean).join(" ") || richiedenteEmail;

  sendContactNotificationEmail({
    ownerEmail: annuncio.autoreEmail,
    richiedenteName: nome,
    richiedenteEmail,
    annuncioTitolo: annuncio.titolo,
    annuncioId: annuncio.id,
    categoria: annuncio.categoria,
  }).catch(() => {});

  return res.status(200).json({ ok: true, notified: true });
});

router.patch("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID non valido" });

  const parsed = UpdateAnnuncioBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Dati non validi" });
  }

  const existing = await db
    .select()
    .from(annunciTable)
    .where(eq(annunciTable.id, id));

  if (existing.length === 0) {
    return res.status(404).json({ error: "Annuncio non trovato" });
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.titolo !== undefined) updateData.titolo = parsed.data.titolo;
  if (parsed.data.descrizione !== undefined) updateData.descrizione = parsed.data.descrizione;
  if (parsed.data.prezzo !== undefined) updateData.prezzo = parsed.data.prezzo;
  if (parsed.data.categoria !== undefined) updateData.categoria = parsed.data.categoria;
  if (parsed.data.citta !== undefined) updateData.citta = parsed.data.citta;
  if (parsed.data.contatto !== undefined) updateData.contatto = parsed.data.contatto;
  if (parsed.data.immagineUrl !== undefined) updateData.immagineUrl = parsed.data.immagineUrl;

  const [updated] = await db
    .update(annunciTable)
    .set(updateData)
    .where(eq(annunciTable.id, id))
    .returning();

  return res.json(updated);
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "ID non valido" });

  const existing = await db
    .select()
    .from(annunciTable)
    .where(eq(annunciTable.id, id));

  if (existing.length === 0) {
    return res.status(404).json({ error: "Annuncio non trovato" });
  }

  await db.delete(annunciTable).where(eq(annunciTable.id, id));
  return res.status(204).send();
});

export { router as annunciRouter, CATEGORIE };
