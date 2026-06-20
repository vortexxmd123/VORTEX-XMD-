import { db, commandsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "./logger";
import type { WASocket, proto } from "@whiskeysockets/baileys";

export interface CommandContext {
  sock: WASocket;
  msg: proto.IWebMessageInfo;
  jid: string;
  args: string[];
  sender: string;
  isGroup: boolean;
  isOwner: boolean;
  settings: Record<string, string>;
  commandList: string[];
  onRestart?: () => void;
}

export interface CommandDef {
  name: string;
  aliases?: string[];
  category: string;
  description: string;
  usage?: string;
  adminOnly?: boolean;
  ownerOnly?: boolean;
  groupOnly?: boolean;
  handler: (ctx: CommandContext) => Promise<void>;
}

const registry = new Map<string, CommandDef>();

export function registerCommand(def: CommandDef) {
  registry.set(def.name, def);
  if (def.aliases) {
    for (const alias of def.aliases) {
      registry.set(alias, def);
    }
  }
}

export async function loadAllPlugins() {
  // Dynamically import all plugin modules
  const modules = [
    () => import("../plugins/general"),
    () => import("../plugins/fun"),
    () => import("../plugins/group"),
    () => import("../plugins/owner"),
    () => import("../plugins/utility"),
    () => import("../plugins/downloader"),
    () => import("../plugins/ai"),
    () => import("../plugins/media"),
    () => import("../plugins/search"),
    () => import("../plugins/converter"),
    () => import("../plugins/security"),
    () => import("../plugins/economy"),
    () => import("../plugins/games"),
    () => import("../plugins/anime"),
    () => import("../plugins/tools"),
  ];

  for (const load of modules) {
    try {
      await load();
    } catch (err) {
      logger.warn({ err }, "Failed to load plugin");
    }
  }

  // Upsert all commands into DB
  for (const [name, def] of registry) {
    if (name !== def.name) continue; // skip aliases in DB
    try {
      await db
        .insert(commandsTable)
        .values({
          name: def.name,
          category: def.category,
          description: def.description,
          aliases: def.aliases?.join(",") ?? null,
          usage: def.usage ?? null,
          enabled: true,
          adminOnly: def.adminOnly ?? false,
          ownerOnly: def.ownerOnly ?? false,
          groupOnly: def.groupOnly ?? false,
        })
        .onConflictDoNothing();
    } catch {}
  }

  logger.info({ count: registry.size }, `Loaded ${registry.size} commands total`);
}

export async function handleCommand(ctx: CommandContext, cmdName: string): Promise<void> {
  const def = registry.get(cmdName);
  if (!def) return;

  // Check DB enabled state
  try {
    const [dbCmd] = await db
      .select()
      .from(commandsTable)
      .where(eq(commandsTable.name, def.name));
    if (dbCmd && !dbCmd.enabled) {
      await ctx.sock.sendMessage(ctx.jid, { text: "❌ This command is disabled." });
      return;
    }
  } catch {}

  if (def.ownerOnly && !ctx.isOwner) {
    await ctx.sock.sendMessage(ctx.jid, { text: "⛔ Owner only command." });
    return;
  }

  if (def.groupOnly && !ctx.isGroup) {
    await ctx.sock.sendMessage(ctx.jid, { text: "⛔ Group only command." });
    return;
  }

  try {
    await def.handler(ctx);
  } catch (err) {
    logger.error({ err, cmd: def.name }, "Command handler error");
    try {
      await ctx.sock.sendMessage(ctx.jid, { text: "⚠️ Command failed. Please try again." });
    } catch {}
  }
}

export function getCommandList(): CommandDef[] {
  const seen = new Set<string>();
  const result: CommandDef[] = [];
  for (const [, def] of registry) {
    if (!seen.has(def.name)) {
      seen.add(def.name);
      result.push(def);
    }
  }
  return result;
}
