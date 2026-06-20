import bcrypt from "bcryptjs";
import { db, adminUsersTable, settingsTable } from "@workspace/db";
import { logger } from "./logger";

const DEFAULT_SETTINGS: Record<string, string> = {
  bot_name: "VORTEX XMD",
  owner_name: "LORD RAY",
  developer_name: "GHOST",
  owner_contact: "22879492633",
  prefix: ".",
  menu_footer: "Powered by VORTEX XMD | Owner: LORD RAY | Dev: GHOST",
  owner_number: "22879492633",
  welcome_message: "Welcome to the group, {user}! 👋",
  goodbye_message: "Goodbye {user}! 👋",
};

export async function seedDefaults(): Promise<void> {
  // Seed default admin user (lordray / vortex2024)
  const existing = await db.select().from(adminUsersTable);
  if (existing.length === 0) {
    const passwordHash = await bcrypt.hash("vortex2024", 12);
    await db.insert(adminUsersTable).values({
      username: "lordray",
      passwordHash,
    });
    logger.info("Default admin user created: lordray / vortex2024");
  }

  // Seed default settings
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    await db
      .insert(settingsTable)
      .values({ key, value })
      .onConflictDoNothing();
  }
  logger.info("Default settings seeded");
}
