import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const annunciTable = pgTable("annunci", {
  id: serial("id").primaryKey(),
  titolo: text("titolo").notNull(),
  descrizione: text("descrizione").notNull(),
  prezzo: integer("prezzo"),
  categoria: text("categoria").notNull(),
  citta: text("citta").notNull(),
  contatto: text("contatto").notNull(),
  immagineUrl: text("immagine_url"),
  inEvidenza: boolean("in_evidenza").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertAnnuncioSchema = createInsertSchema(annunciTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAnnuncio = z.infer<typeof insertAnnuncioSchema>;
export type Annuncio = typeof annunciTable.$inferSelect;
