import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const pairingStatsTable = pgTable("pairing_stats", {
  id: serial("id").primaryKey(),
  phoneNumber: text("phone_number").notNull(),
  sessionId: text("session_id").notNull(),
  success: integer("success").notNull().default(0),
  attempts: integer("attempts").notNull().default(0),
  lastAttemptAt: timestamp("last_attempt_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPairingStatSchema = createInsertSchema(pairingStatsTable).omit({ id: true, createdAt: true });
export type InsertPairingStat = z.infer<typeof insertPairingStatSchema>;
export type PairingStat = typeof pairingStatsTable.$inferSelect;
