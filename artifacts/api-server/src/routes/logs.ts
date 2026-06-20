import { Router } from "express";
import { db, logsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { GetLogsQueryParams, GetLogsResponse } from "@workspace/api-zod";
import type { IRouter } from "express";

const router: IRouter = Router();

router.get("/logs", async (req, res): Promise<void> => {
  const params = GetLogsQueryParams.safeParse(req.query);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

  const limit = params.data.limit ?? 50;
  const level = params.data.level;

  const query = db.select().from(logsTable).orderBy(desc(logsTable.timestamp)).limit(limit);
  const rows = level
    ? await db.select().from(logsTable).where(eq(logsTable.level, level)).orderBy(desc(logsTable.timestamp)).limit(limit)
    : await query;

  res.json(GetLogsResponse.parse(rows));
});

export default router;
