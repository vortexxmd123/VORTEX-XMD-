import { registerCommand } from "../lib/commandLoader";
import os from "os";

const MENU_CATEGORIES = [
  { key: "gcmenu", label: "🏠 GROUP MENU", cmds: [".kick",".add",".promote",".demote",".mute",".unmute",".link",".revoke",".groupinfo",".everyone",".hidetag",".warn",".unwarn",".warnings",".setname",".setdesc",".leave",".tagall",".antilink",".antibadword",".welcome",".goodbye"] },
  { key: "downloadmenu", label: "📥 DOWNLOADER MENU", cmds: [".yt",".ytmp3",".ytmp4",".tiktok",".ig",".fb",".twitter",".spotify",".soundcloud",".mediafire",".github",".apk",".play",".play2"] },
  { key: "funmenu", label: "🎉 FUN MENU", cmds: [".joke",".quote",".fact",".8ball",".coinflip",".dice",".rps",".ship",".truth",".dare",".roast",".pickup",".hack",".simprate",".love",".couple",".character"] },
  { key: "ownermenu", label: "👑 OWNER MENU", cmds: [".block",".unblock",".setprefix",".broadcast",".listgroups",".setbotname",".setowner",".setfooter",".eval",".enablecmd",".disablecmd",".shutdown",".update",".clearsessions",".logs",".backup",".setbotprofile"] },
  { key: "xmenu", label: "🤖 AI MENU", cmds: [".ai",".gpt",".chat",".imagine",".weather",".wiki",".translate",".define",".news",".summarize",".explain",".code",".fixcode",".review",".ask"] },
];

function buildMenuText(label: string, cmds: string[]): string {
  const top = `╭━━〔 ${label} 〕━━⬣`;
  const lines = cmds.map((c) => `┃ ${c}`).join("\n");
  const bottom = "╰━━━━━━━━━━━━⬣";
  return `${top}\n${lines}\n${bottom}`;
}

registerCommand({
  name: "menu",
  aliases: ["help"],
  category: "general",
  description: "Show main menu",
  handler: async ({ sock, jid, settings }) => {
    const botName = settings["bot_name"] ?? "VORTEX XMD";
    const prefix = settings["prefix"] ?? ".";
    const owner = settings["owner_name"] ?? "LORD RAY";
    const dev = settings["developer_name"] ?? "GHOST";
    const footer = settings["menu_footer"] ?? "Powered by VORTEX XMD";
    const text = [
      `╭━━〔 ${botName} 〕━━⬣`,
      `┃ Owner : ${owner}`,
      `┃ Developer : ${dev}`,
      `┃ Prefix : ${prefix}`,
      "┃",
      "┃ .gcmenu — Group commands",
      "┃ .downloadmenu — Download tools",
      "┃ .funmenu — Fun commands",
      "┃ .ownermenu — Owner commands",
      "┃ .xmenu — AI commands",
      "┃ .bugmenu — Utility & tools",
      "╰━━━━━━━━━━━━⬣",
      "",
      footer,
    ].join("\n");
    await sock.sendMessage(jid, { text });
  },
});

for (const cat of MENU_CATEGORIES) {
  const { key, label, cmds } = cat;
  registerCommand({
    name: key,
    category: "general",
    description: `Show ${label}`,
    handler: async ({ sock, jid }) => {
      await sock.sendMessage(jid, { text: buildMenuText(label, cmds) });
    },
  });
}

registerCommand({
  name: "bugmenu",
  category: "general",
  description: "Show utility/tools menu",
  handler: async ({ sock, jid }) => {
    const cmds = [".base64",".reverse",".calc",".wordcount",".upper",".lower",".repeat",".password",".toascii",".fancy",".id",".qr",".readqr",".shorten",".length",".color",".random",".iplookup",".whois",".dns",".pinghost",".portscan",".encode",".decode",".hash",".uuid",".timestamp"];
    await sock.sendMessage(jid, { text: buildMenuText("🔧 UTILITY & TOOLS", cmds) });
  },
});

registerCommand({
  name: "alive",
  aliases: ["ping"],
  category: "general",
  description: "Check if bot is alive",
  handler: async ({ sock, jid, settings }) => {
    const botName = settings["bot_name"] ?? "VORTEX XMD";
    await sock.sendMessage(jid, { text: `✅ *${botName}* is ALIVE and ready!\n🟢 Status: Online\n⚡ Response: Fast` });
  },
});

registerCommand({
  name: "uptime",
  aliases: ["runtime"],
  category: "general",
  description: "Show bot uptime",
  handler: async ({ sock, jid }) => {
    const secs = Math.floor(process.uptime());
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    await sock.sendMessage(jid, { text: `⏱️ *Uptime:* ${h}h ${m}m ${s}s` });
  },
});

registerCommand({
  name: "time",
  category: "general",
  description: "Show current time",
  handler: async ({ sock, jid }) => {
    await sock.sendMessage(jid, { text: `🕐 *Time:* ${new Date().toLocaleString()}` });
  },
});

registerCommand({
  name: "speed",
  category: "general",
  description: "Test bot response speed",
  handler: async ({ sock, jid }) => {
    const start = Date.now();
    await sock.sendMessage(jid, { text: "🚀 Testing speed..." });
    await sock.sendMessage(jid, { text: `⚡ Response time: ${Date.now() - start}ms` });
  },
});

registerCommand({
  name: "version",
  aliases: ["about"],
  category: "general",
  description: "Show bot version info",
  handler: async ({ sock, jid, settings }) => {
    const text = [
      `╭━━〔 VORTEX XMD INFO 〕━━⬣`,
      `┃ Bot Name: ${settings["bot_name"] ?? "VORTEX XMD"}`,
      `┃ Owner: ${settings["owner_name"] ?? "LORD RAY"}`,
      `┃ Developer: ${settings["developer_name"] ?? "GHOST"}`,
      `┃ Version: 1.0.0`,
      `┃ Platform: ${os.platform()}`,
      `┃ Node: ${process.version}`,
      `╰━━━━━━━━━━━━⬣`,
    ].join("\n");
    await sock.sendMessage(jid, { text });
  },
});

registerCommand({
  name: "system",
  category: "general",
  description: "Show system information",
  handler: async ({ sock, jid }) => {
    const mem = process.memoryUsage();
    const text = [
      `╭━━〔 SYSTEM INFO 〕━━⬣`,
      `┃ Platform: ${os.platform()} ${os.arch()}`,
      `┃ Node: ${process.version}`,
      `┃ Memory: ${Math.round(mem.rss / 1024 / 1024)}MB RSS`,
      `┃ CPU: ${os.cpus()[0]?.model ?? "N/A"}`,
      `┃ Uptime: ${Math.floor(process.uptime())}s`,
      `╰━━━━━━━━━━━━⬣`,
    ].join("\n");
    await sock.sendMessage(jid, { text });
  },
});

registerCommand({
  name: "stats",
  category: "general",
  description: "Show bot statistics",
  handler: async ({ sock, jid }) => {
    await sock.sendMessage(jid, { text: "📊 Stats available via admin panel." });
  },
});

registerCommand({
  name: "owner",
  category: "general",
  description: "Show owner contact",
  handler: async ({ sock, jid, settings }) => {
    const contact = settings["owner_contact"] ?? "22879492633";
    const name = settings["owner_name"] ?? "LORD RAY";
    await sock.sendMessage(jid, { text: `👑 *Owner:* ${name}\n📱 Contact: wa.me/${contact}` });
  },
});

registerCommand({
  name: "support",
  category: "general",
  description: "Show support links",
  handler: async ({ sock, jid }) => {
    await sock.sendMessage(jid, {
      text: [
        "╭━━〔 SUPPORT 〕━━⬣",
        "┃ 📱 WhatsApp Group:",
        "┃ https://chat.whatsapp.com/C6OnEkjVKaH2g7hsNbjIhd",
        "┃ 📢 Channel:",
        "┃ https://whatsapp.com/channel/0029VbDHkrrFSAsxToE5Fw3o",
        "╰━━━━━━━━━━━━⬣",
      ].join("\n"),
    });
  },
});

registerCommand({ name: "wagroup", category: "general", description: "WhatsApp group link", handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: "https://chat.whatsapp.com/C6OnEkjVKaH2g7hsNbjIhd?s=cl&p=a&mlu=0" }); } });
registerCommand({ name: "wachannel", category: "general", description: "WhatsApp channel link", handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: "https://whatsapp.com/channel/0029VbDHkrrFSAsxToE5Fw3o" }); } });
registerCommand({ name: "repo", category: "general", description: "Repository link", handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: "🔗 VORTEX XMD GitHub repo link." }); } });
registerCommand({ name: "payment", category: "general", description: "Payment info", handler: async ({ sock, jid, settings }) => { await sock.sendMessage(jid, { text: `💰 Contact owner: wa.me/${settings["owner_contact"] ?? "22879492633"}` }); } });
registerCommand({ name: "teledev", category: "general", description: "Developer Telegram", handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: "📲 Developer Telegram: t.me/GHOST" }); } });
registerCommand({ name: "telechannel", category: "general", description: "Telegram channel", handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: "📢 Telegram Channel: t.me/VORTEXMD" }); } });
registerCommand({ name: "telegroup", category: "general", description: "Telegram group", handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: "👥 Telegram Group: t.me/VORTEXMD_GROUP" }); } });
registerCommand({ name: "info", category: "general", description: "Bot info", handler: async ({ sock, jid, settings }) => { await sock.sendMessage(jid, { text: `ℹ️ *${settings["bot_name"] ?? "VORTEX XMD"}* — Multi-user WhatsApp bot by ${settings["developer_name"] ?? "GHOST"}` }); } });
registerCommand({ name: "restart", category: "general", description: "Restart bot", ownerOnly: true, handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: "🔄 Restarting..." }); process.exit(0); } });
