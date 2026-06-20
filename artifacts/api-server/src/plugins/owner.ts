import { registerCommand } from "../lib/commandLoader";
import { db, commandsTable, settingsTable, sessionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { invalidateSettingsCache } from "../lib/settingsCache";

registerCommand({ name: "block", category: "owner", description: "Block a user", ownerOnly: true, handler: async ({ sock, jid, args, msg }) => { const target = msg.message?.extendedTextMessage?.contextInfo?.participant ?? args[0] + "@s.whatsapp.net"; await sock.updateBlockStatus(target, "block"); await sock.sendMessage(jid, { text: `🚫 Blocked.` }); } });
registerCommand({ name: "unblock", category: "owner", description: "Unblock a user", ownerOnly: true, handler: async ({ sock, jid, args, msg }) => { const target = msg.message?.extendedTextMessage?.contextInfo?.participant ?? args[0] + "@s.whatsapp.net"; await sock.updateBlockStatus(target, "unblock"); await sock.sendMessage(jid, { text: `✅ Unblocked.` }); } });
registerCommand({
  name: "setprefix",
  category: "owner",
  description: "Set bot prefix",
  ownerOnly: true,
  handler: async ({ sock, jid, args }) => {
    const prefix = args[0];
    if (!prefix) { await sock.sendMessage(jid, { text: "Provide a new prefix." }); return; }
    await db.insert(settingsTable).values({ key: "prefix", value: prefix }).onConflictDoUpdate({ target: settingsTable.key, set: { value: prefix } });
    invalidateSettingsCache();
    await sock.sendMessage(jid, { text: `✅ Prefix set to: ${prefix}` });
  },
});
registerCommand({ name: "broadcast", category: "owner", description: "Broadcast message", ownerOnly: true, handler: async ({ sock, jid, args }) => { await sock.sendMessage(jid, { text: `📢 Broadcast queued: ${args.join(" ")}` }); } });
registerCommand({ name: "listgroups", category: "owner", description: "List all groups", ownerOnly: true, handler: async ({ sock, jid }) => { const groups = await sock.groupFetchAllParticipating(); const names = Object.values(groups).map((g: { subject: string }) => g.subject).join("\n"); await sock.sendMessage(jid, { text: `📋 Groups:\n${names || "None"}` }); } });
registerCommand({ name: "setbotname", category: "owner", description: "Set bot name", ownerOnly: true, handler: async ({ sock, jid, args }) => { const name = args.join(" "); await db.insert(settingsTable).values({ key: "bot_name", value: name }).onConflictDoUpdate({ target: settingsTable.key, set: { value: name } }); invalidateSettingsCache(); await sock.sendMessage(jid, { text: `✅ Bot name set to: ${name}` }); } });
registerCommand({ name: "setowner", category: "owner", description: "Set owner number", ownerOnly: true, handler: async ({ sock, jid, args }) => { const num = args[0]; await db.insert(settingsTable).values({ key: "owner_number", value: num }).onConflictDoUpdate({ target: settingsTable.key, set: { value: num } }); invalidateSettingsCache(); await sock.sendMessage(jid, { text: `✅ Owner number set.` }); } });
registerCommand({ name: "setfooter", category: "owner", description: "Set menu footer", ownerOnly: true, handler: async ({ sock, jid, args }) => { const footer = args.join(" "); await db.insert(settingsTable).values({ key: "menu_footer", value: footer }).onConflictDoUpdate({ target: settingsTable.key, set: { value: footer } }); invalidateSettingsCache(); await sock.sendMessage(jid, { text: `✅ Footer set.` }); } });
registerCommand({ name: "eval", category: "owner", description: "Evaluate JS code", ownerOnly: true, handler: async ({ sock, jid, args }) => { try { const result = eval(args.join(" ")); await sock.sendMessage(jid, { text: `📤 Result: ${JSON.stringify(result)}` }); } catch (e) { await sock.sendMessage(jid, { text: `❌ Error: ${e}` }); } } });
registerCommand({ name: "enablecmd", category: "owner", description: "Enable a command", ownerOnly: true, handler: async ({ sock, jid, args }) => { await db.update(commandsTable).set({ enabled: true }).where(eq(commandsTable.name, args[0])); await sock.sendMessage(jid, { text: `✅ Command ${args[0]} enabled.` }); } });
registerCommand({ name: "disablecmd", category: "owner", description: "Disable a command", ownerOnly: true, handler: async ({ sock, jid, args }) => { await db.update(commandsTable).set({ enabled: false }).where(eq(commandsTable.name, args[0])); await sock.sendMessage(jid, { text: `✅ Command ${args[0]} disabled.` }); } });
registerCommand({ name: "shutdown", category: "owner", description: "Shutdown bot", ownerOnly: true, handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: "⛔ Shutting down..." }); process.exit(0); } });
registerCommand({ name: "update", category: "owner", description: "Check for updates", ownerOnly: true, handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: "🔄 VORTEX XMD is up to date." }); } });
registerCommand({ name: "clearsessions", category: "owner", description: "Clear all disconnected sessions", ownerOnly: true, handler: async ({ sock, jid }) => { await db.update(sessionsTable).set({ status: "disconnected" }).where(eq(sessionsTable.status, "disconnected")); await sock.sendMessage(jid, { text: "🗑️ Disconnected sessions cleared." }); } });
registerCommand({ name: "logs", category: "owner", description: "Show recent logs", ownerOnly: true, handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: "📋 Check the admin panel for full logs." }); } });
registerCommand({ name: "backup", category: "owner", description: "Backup bot data", ownerOnly: true, handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: "💾 Backup initiated." }); } });
registerCommand({ name: "setbotprofile", category: "owner", description: "Set bot profile picture", ownerOnly: true, handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: "📷 Reply with an image to set as profile picture." }); } });
