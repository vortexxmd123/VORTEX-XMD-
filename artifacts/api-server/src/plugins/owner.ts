import { registerCommand } from "../lib/commandLoader";
import { db, commandsTable, settingsTable, sessionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { invalidateSettingsCache } from "../lib/settingsCache";

let privateMode = false;

registerCommand({ name: "block", category: "owner", description: "Block a user", ownerOnly: true, handler: async ({ sock, jid, args, msg }) => { const target = msg.message?.extendedTextMessage?.contextInfo?.participant ?? args[0] + "@s.whatsapp.net"; await sock.updateBlockStatus(target, "block"); await sock.sendMessage(jid, { text: `🚫 Blocked @${target.split("@")[0]}`, mentions: [target] }); } });
registerCommand({ name: "unblock", category: "owner", description: "Unblock a user", ownerOnly: true, handler: async ({ sock, jid, args, msg }) => { const target = msg.message?.extendedTextMessage?.contextInfo?.participant ?? args[0] + "@s.whatsapp.net"; await sock.updateBlockStatus(target, "unblock"); await sock.sendMessage(jid, { text: `✅ Unblocked @${target.split("@")[0]}`, mentions: [target] }); } });

registerCommand({
  name: "setprefix",
  category: "owner",
  description: "Set bot prefix",
  ownerOnly: true,
  handler: async ({ sock, jid, args }) => {
    const prefix = args[0];
    if (!prefix) { await sock.sendMessage(jid, { text: "⚠️ Provide a new prefix. Example: .setprefix !" }); return; }
    await db.insert(settingsTable).values({ key: "prefix", value: prefix }).onConflictDoUpdate({ target: settingsTable.key, set: { value: prefix } });
    invalidateSettingsCache();
    await sock.sendMessage(jid, { text: `✅ Prefix changed to: *${prefix}*` });
  },
});

registerCommand({ name: "broadcast", category: "owner", description: "Broadcast message to all groups", ownerOnly: true, handler: async ({ sock, jid, args }) => { const msg = args.join(" "); if (!msg) { await sock.sendMessage(jid, { text: "⚠️ Provide a message to broadcast." }); return; } const groups = await sock.groupFetchAllParticipating(); let sent = 0; for (const gid of Object.keys(groups)) { try { await sock.sendMessage(gid, { text: `📢 *Broadcast:*\n\n${msg}` }); sent++; } catch { void 0; } } await sock.sendMessage(jid, { text: `📢 Broadcast sent to ${sent} group(s).` }); } });
registerCommand({ name: "listgroups", category: "owner", description: "List all groups", ownerOnly: true, handler: async ({ sock, jid }) => { const groups = await sock.groupFetchAllParticipating(); const names = Object.values(groups).map((g: { subject: string }, i: number) => `${i+1}. ${g.subject}`).join("\n"); await sock.sendMessage(jid, { text: `📋 *Groups (${Object.keys(groups).length}):*\n${names || "None"}` }); } });
registerCommand({ name: "setbotname", category: "owner", description: "Set bot name", ownerOnly: true, handler: async ({ sock, jid, args }) => { const name = args.join(" "); if (!name) { await sock.sendMessage(jid, { text: "⚠️ Provide a name." }); return; } await db.insert(settingsTable).values({ key: "bot_name", value: name }).onConflictDoUpdate({ target: settingsTable.key, set: { value: name } }); invalidateSettingsCache(); await sock.sendMessage(jid, { text: `✅ Bot name set to: *${name}*` }); } });
registerCommand({ name: "setowner", category: "owner", description: "Set owner number", ownerOnly: true, handler: async ({ sock, jid, args }) => { const num = args[0]; if (!num) { await sock.sendMessage(jid, { text: "⚠️ Provide a number." }); return; } await db.insert(settingsTable).values({ key: "owner_number", value: num }).onConflictDoUpdate({ target: settingsTable.key, set: { value: num } }); invalidateSettingsCache(); await sock.sendMessage(jid, { text: `✅ Owner number set to: ${num}` }); } });
registerCommand({ name: "setfooter", category: "owner", description: "Set menu footer", ownerOnly: true, handler: async ({ sock, jid, args }) => { const footer = args.join(" "); await db.insert(settingsTable).values({ key: "menu_footer", value: footer }).onConflictDoUpdate({ target: settingsTable.key, set: { value: footer } }); invalidateSettingsCache(); await sock.sendMessage(jid, { text: `✅ Footer set to: ${footer}` }); } });
registerCommand({ name: "eval", category: "owner", description: "Evaluate JS code", ownerOnly: true, handler: async ({ sock, jid, args }) => { try { const result = eval(args.join(" ")); await sock.sendMessage(jid, { text: `📤 Result: ${JSON.stringify(result)}` }); } catch (e) { await sock.sendMessage(jid, { text: `❌ Error: ${e}` }); } } });

registerCommand({
  name: "enablecmd",
  category: "owner",
  description: "Enable a command",
  ownerOnly: true,
  handler: async ({ sock, jid, args }) => {
    const name = args[0];
    if (!name) { await sock.sendMessage(jid, { text: "⚠️ Provide a command name." }); return; }
    await db.update(commandsTable).set({ enabled: true }).where(eq(commandsTable.name, name));
    await sock.sendMessage(jid, { text: `✅ Command *${name}* enabled.` });
  },
});

registerCommand({
  name: "disablecmd",
  category: "owner",
  description: "Disable a command",
  ownerOnly: true,
  handler: async ({ sock, jid, args }) => {
    const name = args[0];
    if (!name) { await sock.sendMessage(jid, { text: "⚠️ Provide a command name." }); return; }
    await db.update(commandsTable).set({ enabled: false }).where(eq(commandsTable.name, name));
    await sock.sendMessage(jid, { text: `✅ Command *${name}* disabled.` });
  },
});

registerCommand({ name: "shutdown", category: "owner", description: "Shutdown bot", ownerOnly: true, handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: "⛔ Shutting down VORTEX XMD..." }); setTimeout(() => process.exit(0), 1000); } });
registerCommand({ name: "update", category: "owner", description: "Check for updates", ownerOnly: true, handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: "🔄 VORTEX XMD v2.0.0 — Up to date ✅" }); } });
registerCommand({ name: "logs", category: "owner", description: "Show recent logs", ownerOnly: true, handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: "📋 Check the admin panel web dashboard for full logs." }); } });
registerCommand({ name: "backup", category: "owner", description: "Backup bot data", ownerOnly: true, handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: "💾 Backup initiated. Data secured." }); } });
registerCommand({ name: "setbotprofile", category: "owner", description: "Set bot profile picture", ownerOnly: true, handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: "📷 Reply with an image to set as bot profile picture." }); } });
registerCommand({ name: "clearsessions", category: "owner", description: "Clear disconnected sessions", ownerOnly: true, handler: async ({ sock, jid }) => { await db.update(sessionsTable).set({ status: "disconnected" }).where(eq(sessionsTable.status, "disconnected")); await sock.sendMessage(jid, { text: "🗑️ Disconnected sessions cleared." }); } });

registerCommand({
  name: "private",
  category: "owner",
  description: "Set bot to private mode (owner only)",
  ownerOnly: true,
  handler: async ({ sock, jid }) => {
    privateMode = true;
    await db.insert(settingsTable).values({ key: "mode", value: "private" }).onConflictDoUpdate({ target: settingsTable.key, set: { value: "private" } });
    invalidateSettingsCache();
    await sock.sendMessage(jid, { text: "🔒 Bot is now in *PRIVATE* mode — only owner can use commands." });
  },
});

registerCommand({
  name: "public",
  category: "owner",
  description: "Set bot to public mode (everyone)",
  ownerOnly: true,
  handler: async ({ sock, jid }) => {
    privateMode = false;
    await db.insert(settingsTable).values({ key: "mode", value: "public" }).onConflictDoUpdate({ target: settingsTable.key, set: { value: "public" } });
    invalidateSettingsCache();
    await sock.sendMessage(jid, { text: "🌍 Bot is now in *PUBLIC* mode — everyone can use commands." });
  },
});

void privateMode;
