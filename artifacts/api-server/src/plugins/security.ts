import { registerCommand } from "../lib/commandLoader";

const banned: Set<string> = new Set();
const blacklisted: Set<string> = new Set();
const whitelisted: Set<string> = new Set();
const locked: Set<string> = new Set();
const antispamGroups: Set<string> = new Set();
const antibotGroups: Set<string> = new Set();

registerCommand({
  name: "ban",
  category: "security",
  description: "Ban a user from using the bot",
  ownerOnly: true,
  usage: ".ban @user",
  handler: async ({ sock, jid, msg, args }) => {
    const target = msg.message?.extendedTextMessage?.contextInfo?.participant
      ?? (args[0] ? args[0].replace(/\D/g, "") + "@s.whatsapp.net" : null);
    if (!target) { await sock.sendMessage(jid, { text: "⚠️ Mention or provide a user to ban." }); return; }
    banned.add(target);
    await sock.sendMessage(jid, { text: `🚫 @${target.split("@")[0]} has been *BANNED* from using the bot.`, mentions: [target] });
  },
});

registerCommand({
  name: "unban",
  category: "security",
  description: "Unban a user",
  ownerOnly: true,
  usage: ".unban @user",
  handler: async ({ sock, jid, msg, args }) => {
    const target = msg.message?.extendedTextMessage?.contextInfo?.participant
      ?? (args[0] ? args[0].replace(/\D/g, "") + "@s.whatsapp.net" : null);
    if (!target) { await sock.sendMessage(jid, { text: "⚠️ Mention a user to unban." }); return; }
    banned.delete(target);
    await sock.sendMessage(jid, { text: `✅ @${target.split("@")[0]} has been *UNBANNED*.`, mentions: [target] });
  },
});

registerCommand({
  name: "blacklist",
  category: "security",
  description: "Add a word/user to the blacklist",
  ownerOnly: true,
  usage: ".blacklist [word or number]",
  handler: async ({ sock, jid, args }) => {
    const entry = args.join(" ").toLowerCase();
    if (!entry) { await sock.sendMessage(jid, { text: "⚠️ Provide a word or number to blacklist." }); return; }
    blacklisted.add(entry);
    await sock.sendMessage(jid, { text: `🚫 *"${entry}"* added to blacklist. (${blacklisted.size} entries)` });
  },
});

registerCommand({
  name: "whitelist",
  category: "security",
  description: "Add a word/user to the whitelist",
  ownerOnly: true,
  usage: ".whitelist [word or number]",
  handler: async ({ sock, jid, args }) => {
    const entry = args.join(" ").toLowerCase();
    if (!entry) { await sock.sendMessage(jid, { text: "⚠️ Provide a word or number to whitelist." }); return; }
    whitelisted.add(entry);
    await sock.sendMessage(jid, { text: `✅ *"${entry}"* added to whitelist. (${whitelisted.size} entries)` });
  },
});

registerCommand({
  name: "lock",
  category: "security",
  description: "Lock the bot for this group (admins only)",
  groupOnly: true,
  adminOnly: true,
  handler: async ({ sock, jid }) => {
    locked.add(jid);
    await sock.sendMessage(jid, { text: "🔒 Bot *LOCKED* for this group — only admins can use commands." });
  },
});

registerCommand({
  name: "unlock",
  category: "security",
  description: "Unlock the bot for this group",
  groupOnly: true,
  adminOnly: true,
  handler: async ({ sock, jid }) => {
    locked.delete(jid);
    await sock.sendMessage(jid, { text: "🔓 Bot *UNLOCKED* — everyone can use commands." });
  },
});

registerCommand({
  name: "antispam",
  category: "security",
  description: "Toggle anti-spam protection for group",
  groupOnly: true,
  adminOnly: true,
  handler: async ({ sock, jid }) => {
    if (antispamGroups.has(jid)) {
      antispamGroups.delete(jid);
      await sock.sendMessage(jid, { text: "🔓 Anti-spam *DISABLED*." });
    } else {
      antispamGroups.add(jid);
      await sock.sendMessage(jid, { text: "🛡️ Anti-spam *ENABLED* — spammers will be warned and removed." });
    }
  },
});

registerCommand({
  name: "antibot",
  category: "security",
  description: "Toggle anti-bot protection for group",
  groupOnly: true,
  adminOnly: true,
  handler: async ({ sock, jid }) => {
    if (antibotGroups.has(jid)) {
      antibotGroups.delete(jid);
      await sock.sendMessage(jid, { text: "🔓 Anti-bot *DISABLED*." });
    } else {
      antibotGroups.add(jid);
      await sock.sendMessage(jid, { text: "🤖 Anti-bot *ENABLED* — bots will be removed on join." });
    }
  },
});

registerCommand({
  name: "sessioninfo",
  category: "security",
  description: "Show session security information",
  ownerOnly: true,
  handler: async ({ sock, jid }) => {
    await sock.sendMessage(jid, {
      text: [
        `╭━━━━━━━━━━━━━━━━━━━━╮`,
        `┃ 🛡️ SECURITY STATUS`,
        `┃ Platform: Baileys WA`,
        `┃ Banned users: ${banned.size}`,
        `┃ Blacklist entries: ${blacklisted.size}`,
        `┃ Whitelist entries: ${whitelisted.size}`,
        `┃ Locked groups: ${locked.size}`,
        `┃ Anti-spam groups: ${antispamGroups.size}`,
        `┃ Anti-bot groups: ${antibotGroups.size}`,
        `╰━━━━━━━━━━━━━━━━━━━━╯`,
      ].join("\n"),
    });
  },
});

registerCommand({
  name: "security",
  category: "security",
  description: "Show security overview menu",
  handler: async ({ sock, jid, settings }) => {
    const p = settings["prefix"] ?? ".";
    await sock.sendMessage(jid, {
      text: [
        `━━━━━━━━━━━━━━━━━━━━`,
        `🛡️ SECURITY MENU`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `${p}ban — Ban user from bot`,
        `${p}unban — Unban user`,
        `${p}blacklist [word] — Add to blacklist`,
        `${p}whitelist [word] — Add to whitelist`,
        `${p}lock — Lock bot for group`,
        `${p}unlock — Unlock bot for group`,
        `${p}antispam — Toggle anti-spam`,
        `${p}antibot — Toggle anti-bot`,
        `${p}sessioninfo — Security statistics`,
      ].join("\n"),
    });
  },
});

export { banned, blacklisted, whitelisted, locked };
