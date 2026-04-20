import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const forumThreadsTable = pgTable("forum_threads", {
  id: serial("id").primaryKey(),
  titolo: text("titolo").notNull(),
  corpo: text("corpo").notNull(),
  categoria: text("categoria").notNull(),
  autore: text("autore").notNull(),
  autoreClerkId: text("autore_clerk_id"),
  risposteCount: integer("risposte_count").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const forumRepliesTable = pgTable("forum_replies", {
  id: serial("id").primaryKey(),
  threadId: integer("thread_id").notNull().references(() => forumThreadsTable.id, { onDelete: "cascade" }),
  corpo: text("corpo").notNull(),
  autore: text("autore").notNull(),
  autoreClerkId: text("autore_clerk_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertForumThreadSchema = createInsertSchema(forumThreadsTable).omit({
  id: true, createdAt: true, updatedAt: true, risposteCount: true,
});
export const insertForumReplySchema = createInsertSchema(forumRepliesTable).omit({
  id: true, createdAt: true,
});

export type InsertForumThread = z.infer<typeof insertForumThreadSchema>;
export type InsertForumReply = z.infer<typeof insertForumReplySchema>;
export type ForumThread = typeof forumThreadsTable.$inferSelect;
export type ForumReply = typeof forumRepliesTable.$inferSelect;
