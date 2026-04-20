import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const userProfilesTable = pgTable("user_profiles", {
  clerkId: text("clerk_id").primaryKey(),
  username: text("username").notNull().unique(),
  nome: text("nome").notNull(),
  cognome: text("cognome").notNull(),
  email: text("email").notNull(),
  universita: text("universita").notNull(),
  annoCorso: text("anno_corso").notNull(),
  corsoDiLaurea: text("corso_di_laurea").notNull(),
  telefono: text("telefono"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertUserProfileSchema = createInsertSchema(userProfilesTable).omit({
  createdAt: true,
  updatedAt: true,
});

export const updateUserProfileSchema = insertUserProfileSchema.partial().omit({ clerkId: true });

export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UpdateUserProfile = z.infer<typeof updateUserProfileSchema>;
export type UserProfile = typeof userProfilesTable.$inferSelect;
