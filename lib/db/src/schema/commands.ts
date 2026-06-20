import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const commandsTable = pgTable("commands", {
  name: text("name").primaryKey(),
  category: text("category").notNull(),
  description: text("description"),
  aliases: text("aliases"),
  usage: text("usage"),
  enabled: boolean("enabled").notNull().default(true),
  adminOnly: boolean("admin_only").notNull().default(false),
  ownerOnly: boolean("owner_only").notNull().default(false),
  groupOnly: boolean("group_only").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertCommandSchema = createInsertSchema(commandsTable);
export type InsertCommand = z.infer<typeof insertCommandSchema>;
export type Command = typeof commandsTable.$inferSelect;
