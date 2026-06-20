import { db, settingsTable } from "@workspace/db";
import { logger } from "./logger";

let cache: Record<string, string> | null = null;
let cacheTime = 0;
const CACHE_TTL_MS = 30_000;

export async function getSettings(): Promise<Record<string, string>> {
  const now = Date.now();
  if (cache && now - cacheTime < CACHE_TTL_MS) return cache;
  try {
    const rows = await db.select().from(settingsTable);
    const result: Record<string, string> = {};
    for (const row of rows) result[row.key] = row.value;
    cache = result;
    cacheTime = now;
    return result;
  } catch (err) {
    logger.warn({ err }, "Failed to load settings from DB");
    return cache ?? {};
  }
}

export function invalidateSettingsCache() {
  cache = null;
  cacheTime = 0;
}
