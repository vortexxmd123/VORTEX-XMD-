import { Router } from "express";
import { db, sessionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListSessionsResponse,
  GetSessionParams,
  GetSessionResponse,
  DeleteSessionParams,
  ReconnectSessionParams,
  ReconnectSessionResponse,
} from "@workspace/api-zod";
import { disconnectSession, reconnectSessionById } from "../lib/sessionManager";
import type { IRouter } from "express";

const router: IRouter = Router();

router.get("/sessions", async (_req, res): Promise<void> => {
  const rows = await db.select().from(sessionsTable).orderBy(sessionsTable.createdAt);
  res.json(ListSessionsResponse.parse(rows));
});

router.get("/sessions/:sessionId", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.sessionId) ? req.params.sessionId[0] : req.params.sessionId;
  const params = GetSessionParams.safeParse({ sessionId: raw });
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

  const [session] = await db
    .select()
    .from(sessionsTable)
    .where(eq(sessionsTable.sessionId, params.data.sessionId));

  if (!session) { res.status(404).json({ error: "Session not found" }); return; }
  res.json(GetSessionResponse.parse(session));
});

router.delete("/sessions/:sessionId", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.sessionId) ? req.params.sessionId[0] : req.params.sessionId;
  const params = DeleteSessionParams.safeParse({ sessionId: raw });
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

  await disconnectSession(params.data.sessionId);
  await db.delete(sessionsTable).where(eq(sessionsTable.sessionId, params.data.sessionId));
  res.sendStatus(204);
});

router.post("/sessions/:sessionId/reconnect", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.sessionId) ? req.params.sessionId[0] : req.params.sessionId;
  const params = ReconnectSessionParams.safeParse({ sessionId: raw });
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

  await reconnectSessionById(params.data.sessionId);
  res.json(ReconnectSessionResponse.parse({ success: true, message: "Reconnect initiated" }));
});

export default router;
