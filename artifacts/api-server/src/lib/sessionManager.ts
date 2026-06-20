import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  makeCacheableSignalKeyStore,
  type WASocket,
} from "@whiskeysockets/baileys";
import pino from "pino";
import path from "path";
import fs from "fs";
import { db, sessionsTable, pairingStatsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "./logger";
import { dbLog } from "./dbLogger";
import { loadAllPlugins, handleCommand } from "./commandLoader";
import { getSettings } from "./settingsCache";

const workspaceRoot = process.cwd().endsWith(path.join("artifacts", "api-server"))
  ? path.resolve(process.cwd(), "../..")
  : process.cwd();

export const sessionsDir = path.resolve(workspaceRoot, "sessions");

const activeSockets = new Map<string, WASocket>();

function getSessionDir(sessionId: string): string {
  return path.join(sessionsDir, sessionId);
}

function ensureSessionsDir() {
  if (!fs.existsSync(sessionsDir)) {
    fs.mkdirSync(sessionsDir, { recursive: true });
  }
}

async function updateSessionStatus(
  sessionId: string,
  status: string,
  phoneNumber?: string
) {
  try {
    const existing = await db
      .select()
      .from(sessionsTable)
      .where(eq(sessionsTable.sessionId, sessionId));

    const now = new Date();
    if (existing.length === 0) {
      await db.insert(sessionsTable).values({
        sessionId,
        status,
        phoneNumber: phoneNumber ?? null,
        lastSeen: now,
        ...(status === "connected" ? { connectedAt: now } : {}),
      });
    } else {
      await db
        .update(sessionsTable)
        .set({
          status,
          lastSeen: now,
          ...(phoneNumber ? { phoneNumber } : {}),
          ...(status === "connected" ? { connectedAt: now } : {}),
        })
        .where(eq(sessionsTable.sessionId, sessionId));
    }
  } catch (err) {
    logger.warn({ err }, "Failed to update session status in DB");
  }
}

export async function createSession(sessionId: string): Promise<{ pairingCode: string }> {
  ensureSessionsDir();
  const sessionDir = getSessionDir(sessionId);
  fs.mkdirSync(sessionDir, { recursive: true });

  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
  const silentLogger = pino({ level: "silent" });

  const sock = makeWASocket({
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, silentLogger),
    },
    logger: silentLogger,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    keepAliveIntervalMs: 30000,
    connectTimeoutMs: 60000,
    markOnlineOnConnect: true,
    syncFullHistory: false,
    printQRInTerminal: false,
  });

  // Register creds.update IMMEDIATELY — before any await or waitForConnectionUpdate
  sock.ev.on("creds.update", saveCreds);

  activeSockets.set(sessionId, sock);
  await updateSessionStatus(sessionId, "pairing");

  // Wait for QR/connection
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Connection timeout")), 55000);
    sock.ev.on("connection.update", (update) => {
      if (update.qr || update.connection === "open") {
        clearTimeout(timeout);
        resolve();
      }
    });
  });

  // Request pairing code
  const phone = sock.authState.creds.me?.id?.split(":")[0] ?? sessionId;
  const code = await sock.requestPairingCode(phone.replace(/\D/g, ""));

  // Register remaining event listeners
  attachSessionListeners(sessionId, sock, saveCreds);

  return { pairingCode: code };
}

export async function requestPairingCode(
  sessionId: string,
  phoneNumber: string
): Promise<string> {
  ensureSessionsDir();
  const sessionDir = getSessionDir(sessionId);
  fs.mkdirSync(sessionDir, { recursive: true });

  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
  const silentLogger = pino({ level: "silent" });

  const sock = makeWASocket({
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, silentLogger),
    },
    logger: silentLogger,
    browser: ["Ubuntu", "Chrome", "20.0.04"],
    keepAliveIntervalMs: 30000,
    connectTimeoutMs: 60000,
    markOnlineOnConnect: true,
    syncFullHistory: false,
    printQRInTerminal: false,
  });

  // CRITICAL: Register creds.update IMMEDIATELY before any await
  sock.ev.on("creds.update", saveCreds);

  activeSockets.set(sessionId, sock);
  await updateSessionStatus(sessionId, "pairing");

  // Wait for QR or open event (whichever comes first)
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Connection timeout")), 55000);
    sock.ev.on("connection.update", (update) => {
      if (update.qr || update.connection === "open") {
        clearTimeout(timeout);
        resolve();
      }
    });
  });

  const digitsOnly = phoneNumber.replace(/\D/g, "");
  const pairingCode = await sock.requestPairingCode(digitsOnly);

  // Track pairing attempt
  try {
    const existing = await db
      .select()
      .from(pairingStatsTable)
      .where(eq(pairingStatsTable.sessionId, sessionId));
    if (existing.length === 0) {
      await db.insert(pairingStatsTable).values({
        phoneNumber,
        sessionId,
        attempts: 1,
        success: 0,
        lastAttemptAt: new Date(),
      });
    } else {
      await db
        .update(pairingStatsTable)
        .set({ attempts: existing[0].attempts + 1, lastAttemptAt: new Date() })
        .where(eq(pairingStatsTable.sessionId, sessionId));
    }
  } catch {}

  attachSessionListeners(sessionId, sock, saveCreds);

  return pairingCode;
}

function attachSessionListeners(
  sessionId: string,
  sock: WASocket,
  saveCreds: () => Promise<void>
) {
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === "open") {
      const phone = sock.authState.creds.me?.id?.split(":")[0] ?? "";
      await updateSessionStatus(sessionId, "connected", phone);
      await dbLog("info", `Session ${sessionId} connected`, sessionId);
      logger.info({ sessionId, phone }, "Session connected");

      // Mark pairing as success
      try {
        const stat = await db
          .select()
          .from(pairingStatsTable)
          .where(eq(pairingStatsTable.sessionId, sessionId));
        if (stat.length > 0) {
          await db
            .update(pairingStatsTable)
            .set({ success: stat[0].success + 1 })
            .where(eq(pairingStatsTable.sessionId, sessionId));
        }
      } catch {}
    }

    if (connection === "connecting") {
      await updateSessionStatus(sessionId, "connecting");
    }

    if (connection === "close") {
      const code = (lastDisconnect?.error as { output?: { statusCode?: number } })?.output?.statusCode;
      const loggedOut = code === DisconnectReason.loggedOut;

      activeSockets.delete(sessionId);

      if (loggedOut) {
        // 401 logged out — do NOT reconnect
        await updateSessionStatus(sessionId, "disconnected");
        await dbLog("warn", `Session ${sessionId} logged out (401) — not reconnecting`, sessionId);
        logger.warn({ sessionId }, "Session logged out — not reconnecting");
      } else {
        await updateSessionStatus(sessionId, "disconnected");
        await dbLog("info", `Session ${sessionId} disconnected (code ${code}) — reconnecting in 5s`, sessionId);
        logger.info({ sessionId, code }, "Session disconnected — reconnecting in 5s");
        setTimeout(() => restoreSession(sessionId), 5000);
      }
    }
  });

  // messages.upsert — MUST check type === "notify" to skip history sync
  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;

    for (const msg of messages) {
      // Skip protocol/reaction/distribution messages
      if (
        !msg.message ||
        msg.message.protocolMessage ||
        msg.message.reactionMessage ||
        msg.message.senderKeyDistributionMessage
      ) {
        continue;
      }

      // NOTE: do NOT filter msg.key.fromMe — owner sends commands from their own phone
      const jid = msg.key.remoteJid ?? "";
      const text =
        msg.message.conversation ??
        msg.message.extendedTextMessage?.text ??
        "";

      const settings = await getSettings();
      const prefix = settings["prefix"] ?? ".";

      if (!text.startsWith(prefix)) continue;

      const [rawCmd, ...args] = text.slice(prefix.length).trim().split(/\s+/);
      const cmdName = rawCmd.toLowerCase();

      await handleCommand({
        sock,
        msg,
        jid,
        args,
        sender: msg.key.participant ?? msg.key.remoteJid ?? "",
        isGroup: jid.endsWith("@g.us"),
        isOwner: isOwner(settings, msg.key.participant ?? msg.key.remoteJid ?? ""),
        settings,
        commandList: [],
      }, cmdName);
    }
  });
}

function isOwner(settings: Record<string, string>, sender: string): boolean {
  const ownerNumber = settings["owner_number"] ?? settings["owner_contact"] ?? "";
  const senderNumber = sender.split("@")[0].split(":")[0];
  return senderNumber === ownerNumber.replace(/\D/g, "");
}

export async function restoreSession(sessionId: string): Promise<void> {
  const sessionDir = getSessionDir(sessionId);
  if (!fs.existsSync(sessionDir)) {
    logger.warn({ sessionId }, "Session folder missing — skipping restore");
    await updateSessionStatus(sessionId, "disconnected");
    return;
  }

  try {
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
    const silentLogger = pino({ level: "silent" });

    const sock = makeWASocket({
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, silentLogger),
      },
      logger: silentLogger,
      browser: ["Ubuntu", "Chrome", "20.0.04"],
      keepAliveIntervalMs: 30000,
      connectTimeoutMs: 60000,
      markOnlineOnConnect: true,
      syncFullHistory: false,
      printQRInTerminal: false,
    });

    // CRITICAL: Register creds.update IMMEDIATELY
    sock.ev.on("creds.update", saveCreds);

    activeSockets.set(sessionId, sock);
    await updateSessionStatus(sessionId, "connecting");
    attachSessionListeners(sessionId, sock, saveCreds);
    logger.info({ sessionId }, "Session restore initiated");
  } catch (err) {
    logger.error({ err, sessionId }, "Failed to restore session");
    await updateSessionStatus(sessionId, "disconnected");
  }
}

export async function restoreAllSessions(): Promise<void> {
  ensureSessionsDir();
  try {
    const dbSessions = await db
      .select()
      .from(sessionsTable)
      .where(eq(sessionsTable.status, "connected"));

    for (const session of dbSessions) {
      const sessionDir = getSessionDir(session.sessionId);
      if (!fs.existsSync(sessionDir)) {
        logger.warn({ sessionId: session.sessionId }, "Session folder missing — marking disconnected");
        await db
          .update(sessionsTable)
          .set({ status: "disconnected" })
          .where(eq(sessionsTable.sessionId, session.sessionId));
        continue;
      }
      await restoreSession(session.sessionId);
    }
  } catch (err) {
    logger.error({ err }, "Failed to restore all sessions");
  }
}

export async function disconnectSession(sessionId: string): Promise<void> {
  const sock = activeSockets.get(sessionId);
  if (sock) {
    try {
      await sock.logout();
    } catch {}
    activeSockets.delete(sessionId);
  }
  await updateSessionStatus(sessionId, "disconnected");
}

export async function reconnectSessionById(sessionId: string): Promise<void> {
  const sock = activeSockets.get(sessionId);
  if (sock) {
    try {
      await sock.end(new Error("Manual reconnect"));
    } catch {}
    activeSockets.delete(sessionId);
  }
  await restoreSession(sessionId);
}

export function getActiveSocketCount(): number {
  return activeSockets.size;
}
