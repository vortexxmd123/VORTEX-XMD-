import { Router } from "express";
import { db, sessionsTable, logsTable, commandsTable, pairingStatsTable } from "@workspace/db";
import { eq, count, sum } from "drizzle-orm";
import { GetStatsResponse } from "@workspace/api-zod";
import { getActiveSocketCount } from "../lib/sessionManager";
import { getCommandList } from "../lib/commandLoader";
import type { IRouter } from "express";

const router: IRouter = Router();

router.get("/stats", async (_req, res): Promise<void> => {
  const [totalSessions] = await db.select({ count: count() }).from(sessionsTable);
  const [totalLogs] = await db.select({ count: count() }).from(logsTable);

  const pairingData = await db.select({
    totalSuccess: sum(pairingStatsTable.success),
    totalAttempts: sum(pairingStatsTable.attempts),
  }).from(pairingStatsTable);

  const totalSuccess = Number(pairingData[0]?.totalSuccess ?? 0);
  const totalAttempts = Number(pairingData[0]?.totalAttempts ?? 0);
  const pairingSuccessRate = totalAttempts > 0 ? Math.round((totalSuccess / totalAttempts) * 100) : 0;

  res.json(
    GetStatsResponse.parse({
      activeSessions: getActiveSocketCount(),
      totalSessions: Number(totalSessions.count),
      pairingSuccessRate,
      uptime: process.uptime(),
      totalLogs: Number(totalLogs.count),
      commandsLoaded: getCommandList().length,
    })
  );
});

export default router;
