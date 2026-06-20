import { db, logsTable } from "@workspace/db";
import { logger } from "./logger";

export async function dbLog(
  level: "info" | "warn" | "error" | "debug",
  message: string,
  sessionId?: string,
  meta?: Record<string, unknown>
) {
  try {
    await db.insert(logsTable).values({
      level,
      message,
      sessionId: sessionId ?? null,
      meta: meta ? JSON.stringify(meta) : null,
      timestamp: new Date(),
    });
  } catch (err) {
    logger.warn({ err }, "Failed to write to DB log");
  }
}
