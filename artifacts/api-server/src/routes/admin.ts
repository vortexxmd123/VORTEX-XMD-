import { Router } from "express";
import bcrypt from "bcryptjs";
import { db, adminUsersTable, settingsTable, commandsTable, sessionsTable, logsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import {
  AdminLoginBody,
  AdminLoginResponse,
  GetAdminMeResponse,
  AdminChangePasswordBody,
  AdminChangePasswordResponse,
  GetSettingsResponse,
  UpdateSettingsBody,
  UpdateSettingsResponse,
  UpdateApiKeysBody,
  UpdateApiKeysResponse,
  ListCommandsResponse,
  ToggleCommandParams,
  ToggleCommandBody,
  ToggleCommandResponse,
  AdminListSessionsResponse,
  AdminBroadcastBody,
  AdminBroadcastResponse,
  AdminRestartSessionsResponse,
  AdminGetLogsQueryParams,
  AdminGetLogsResponse,
} from "@workspace/api-zod";
import { signToken, requireAuth } from "../lib/jwtAuth";
import { invalidateSettingsCache } from "../lib/settingsCache";
import { dbLog } from "../lib/dbLogger";
import { restoreAllSessions } from "../lib/sessionManager";
import type { IRouter, Request } from "express";

const router: IRouter = Router();

type AuthRequest = Request & { adminUser?: { id: number; username: string } };

// POST /admin/login
router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [user] = await db
    .select()
    .from(adminUsersTable)
    .where(eq(adminUsersTable.username, parsed.data.username));

  if (!user) { res.status(401).json({ error: "Invalid credentials" }); return; }

  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!valid) { res.status(401).json({ error: "Invalid credentials" }); return; }

  const token = signToken({ id: user.id, username: user.username });
  res.json(AdminLoginResponse.parse({ token, username: user.username }));
});

// GET /admin/me
router.get("/admin/me", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  res.json(GetAdminMeResponse.parse({ id: req.adminUser!.id, username: req.adminUser!.username }));
});

// POST /admin/change-password
router.post("/admin/change-password", requireAuth, async (req: AuthRequest, res): Promise<void> => {
  const parsed = AdminChangePasswordBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [user] = await db.select().from(adminUsersTable).where(eq(adminUsersTable.id, req.adminUser!.id));
  if (!user) { res.status(404).json({ error: "User not found" }); return; }

  const valid = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
  if (!valid) { res.status(401).json({ error: "Current password incorrect" }); return; }

  const newHash = await bcrypt.hash(parsed.data.newPassword, 12);
  await db.update(adminUsersTable).set({ passwordHash: newHash }).where(eq(adminUsersTable.id, user.id));

  res.json(AdminChangePasswordResponse.parse({ success: true, message: "Password changed" }));
});

// GET /admin/settings
router.get("/admin/settings", requireAuth, async (_req, res): Promise<void> => {
  const rows = await db.select().from(settingsTable);
  const obj: Record<string, string> = {};
  for (const row of rows) {
    if (!["openai_api_key", "weather_api_key"].includes(row.key)) {
      obj[row.key] = row.value;
    }
  }
  res.json(GetSettingsResponse.parse(obj));
});

// PUT /admin/settings
router.put("/admin/settings", requireAuth, async (req, res): Promise<void> => {
  const parsed = UpdateSettingsBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const SENSITIVE = ["openai_api_key", "weather_api_key"];
  for (const [key, value] of Object.entries(parsed.data)) {
    if (SENSITIVE.includes(key) || value == null) continue;
    await db
      .insert(settingsTable)
      .values({ key, value: String(value) })
      .onConflictDoUpdate({ target: settingsTable.key, set: { value: String(value) } });
  }
  invalidateSettingsCache();

  const rows = await db.select().from(settingsTable);
  const obj: Record<string, string> = {};
  for (const row of rows) { if (!SENSITIVE.includes(row.key)) obj[row.key] = row.value; }
  res.json(UpdateSettingsResponse.parse(obj));
});

// PUT /admin/settings/apikeys
router.put("/admin/settings/apikeys", requireAuth, async (req, res): Promise<void> => {
  const parsed = UpdateApiKeysBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  for (const [key, value] of Object.entries(parsed.data)) {
    if (value == null) continue;
    await db
      .insert(settingsTable)
      .values({ key, value: String(value) })
      .onConflictDoUpdate({ target: settingsTable.key, set: { value: String(value) } });
  }
  invalidateSettingsCache();
  res.json(UpdateApiKeysResponse.parse({ success: true, message: "API keys updated" }));
});

// GET /admin/commands
router.get("/admin/commands", requireAuth, async (_req, res): Promise<void> => {
  const rows = await db.select().from(commandsTable).orderBy(commandsTable.category, commandsTable.name);
  res.json(ListCommandsResponse.parse(rows));
});

// PATCH /admin/commands/:name
router.patch("/admin/commands/:name", requireAuth, async (req, res): Promise<void> => {
  const rawName = Array.isArray(req.params.name) ? req.params.name[0] : req.params.name;
  const params = ToggleCommandParams.safeParse({ name: rawName });
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

  const parsed = ToggleCommandBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [updated] = await db
    .update(commandsTable)
    .set({ enabled: parsed.data.enabled })
    .where(eq(commandsTable.name, params.data.name))
    .returning();

  if (!updated) { res.status(404).json({ error: "Command not found" }); return; }
  res.json(ToggleCommandResponse.parse(updated));
});

// GET /admin/sessions
router.get("/admin/sessions", requireAuth, async (_req, res): Promise<void> => {
  const rows = await db.select().from(sessionsTable).orderBy(sessionsTable.createdAt);
  res.json(AdminListSessionsResponse.parse(rows));
});

// POST /admin/broadcast
router.post("/admin/broadcast", requireAuth, async (req, res): Promise<void> => {
  const parsed = AdminBroadcastBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  await dbLog("info", `Admin broadcast: ${parsed.data.message.slice(0, 80)}`);
  res.json(AdminBroadcastResponse.parse({ success: true, message: "Broadcast logged" }));
});

// POST /admin/restart-sessions
router.post("/admin/restart-sessions", requireAuth, async (_req, res): Promise<void> => {
  await dbLog("info", "Admin triggered restart-sessions");
  setImmediate(() => restoreAllSessions());
  res.json(AdminRestartSessionsResponse.parse({ success: true, message: "Session restart initiated" }));
});

// GET /admin/logs
router.get("/admin/logs", requireAuth, async (req, res): Promise<void> => {
  const params = AdminGetLogsQueryParams.safeParse(req.query);
  if (!params.success) { res.status(400).json({ error: params.error.message }); return; }

  const limit = params.data.limit ?? 200;
  const level = params.data.level;

  const rows = level
    ? await db.select().from(logsTable).where(eq(logsTable.level, level)).orderBy(desc(logsTable.timestamp)).limit(limit)
    : await db.select().from(logsTable).orderBy(desc(logsTable.timestamp)).limit(limit);

  res.json(AdminGetLogsResponse.parse(rows));
});

// DELETE /admin/logs
router.delete("/admin/logs", requireAuth, async (_req, res): Promise<void> => {
  await db.delete(logsTable);
  res.sendStatus(204);
});

export default router;
