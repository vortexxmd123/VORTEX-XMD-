import { registerCommand } from "../lib/commandLoader";
import os from "os";

function box(title: string, lines: string[]): string {
  return [
    `╭━━━━━━━━━━━━━━━━━━━━╮`,
    `┃ ${title}`,
    ...lines.map(l => `┃ ${l}`),
    `╰━━━━━━━━━━━━━━━━━━━━╯`,
  ].join("\n");
}

function section(title: string, cmds: string[]): string {
  return [
    `━━━━━━━━━━━━━━━━━━━━`,
    title,
    `━━━━━━━━━━━━━━━━━━━━`,
    ...cmds,
    "",
  ].join("\n");
}

registerCommand({
  name: "menu",
  category: "general",
  description: "Show main menu with all categories",
  handler: async ({ sock, jid, settings, sender }) => {
    const botName  = settings["bot_name"]  ?? "VORTEX BOT";
    const prefix   = settings["prefix"]    ?? ".";
    const owner    = settings["owner_name"] ?? "LORD RAY";
    const footer   = settings["menu_footer"] ?? "Powered by VORTEX XMD ✨";
    const secs     = Math.floor(process.uptime());
    const uptime   = `${Math.floor(secs/3600)}h ${Math.floor((secs%3600)/60)}m ${secs%60}s`;
    const username = sender.split("@")[0];

    const header = box(`🤖 ${botName} MENU`, [
      `👤 User: ${username}`,
      `⚡ Prefix: ${prefix}`,
      `⏱️ Uptime: ${uptime}`,
    ]);

    const body = [
      section("📌 GENERAL MENU", [`${prefix}menu`,`${prefix}xmenu`,`${prefix}gcmenu`,`${prefix}downloadmenu`,`${prefix}funmenu`,`${prefix}ownermenu`,`${prefix}support`,`${prefix}wachannel`,`${prefix}wagroup`,`${prefix}owner`,`${prefix}repo`,`${prefix}payment`,`${prefix}teledev`,`${prefix}telechannel`,`${prefix}telegroup`,`${prefix}info`,`${prefix}ping`,`${prefix}alive`,`${prefix}runtime`,`${prefix}time`,`${prefix}speed`,`${prefix}help`,`${prefix}about`,`${prefix}system`,`${prefix}version`,`${prefix}stats`,`${prefix}uptime`]),
      section("🎉 FUN MENU", [`${prefix}joke`,`${prefix}quote`,`${prefix}fact`,`${prefix}8ball [question]`,`${prefix}coinflip`,`${prefix}dice`,`${prefix}rps`,`${prefix}ship [name1] [name2]`,`${prefix}truth`,`${prefix}dare`,`${prefix}roast`,`${prefix}pickup`,`${prefix}simprate`,`${prefix}love`,`${prefix}couple`,`${prefix}character`]),
      section("👥 GROUP MENU", [`${prefix}kick`,`${prefix}add`,`${prefix}promote`,`${prefix}demote`,`${prefix}mute`,`${prefix}unmute`,`${prefix}link`,`${prefix}revoke`,`${prefix}groupinfo`,`${prefix}everyone`,`${prefix}hidetag`,`${prefix}warn`,`${prefix}unwarn`,`${prefix}warnings`,`${prefix}setname`,`${prefix}setdesc`,`${prefix}leave`,`${prefix}tagall`,`${prefix}antilink`,`${prefix}antibadword`,`${prefix}welcome`,`${prefix}goodbye`]),
      section("👑 OWNER MENU", [`${prefix}block`,`${prefix}unblock`,`${prefix}setprefix`,`${prefix}broadcast`,`${prefix}listgroups`,`${prefix}setbotname`,`${prefix}setowner`,`${prefix}setfooter`,`${prefix}enablecmd`,`${prefix}disablecmd`,`${prefix}shutdown`,`${prefix}update`,`${prefix}logs`,`${prefix}backup`,`${prefix}setbotprofile`,`${prefix}private`,`${prefix}public`]),
      section("🧰 UTILITY MENU", [`${prefix}base64`,`${prefix}reverse`,`${prefix}calc`,`${prefix}wordcount`,`${prefix}upper`,`${prefix}lower`,`${prefix}repeat`,`${prefix}password`,`${prefix}toascii`,`${prefix}fancy`,`${prefix}id`,`${prefix}qr`,`${prefix}readqr`,`${prefix}shorten`,`${prefix}length`,`${prefix}color`,`${prefix}random`]),
      section("⬇️ DOWNLOADER MENU", [`${prefix}yt`,`${prefix}ytmp3`,`${prefix}ytmp4`,`${prefix}tiktok`,`${prefix}ig`,`${prefix}fb`,`${prefix}twitter`,`${prefix}spotify`,`${prefix}soundcloud`,`${prefix}mediafire`,`${prefix}github`,`${prefix}apk`,`${prefix}play`,`${prefix}play2`]),
      section("🧠 AI MENU", [`${prefix}ai`,`${prefix}gpt`,`${prefix}chat`,`${prefix}imagine`,`${prefix}weather`,`${prefix}wiki`,`${prefix}translate`,`${prefix}define`,`${prefix}news`,`${prefix}summarize`,`${prefix}explain`,`${prefix}code`,`${prefix}fixcode`,`${prefix}review`,`${prefix}ask`]),
      section("🎬 MEDIA MENU", [`${prefix}sticker`,`${prefix}take`,`${prefix}toimg`,`${prefix}tovid`,`${prefix}tomp3`,`${prefix}gif`,`${prefix}attp`,`${prefix}emix`,`${prefix}photo`,`${prefix}enhance`,`${prefix}blur`,`${prefix}crop`,`${prefix}removebg`,`${prefix}vv`,`${prefix}vv2`]),
      section("🔎 SEARCH MENU", [`${prefix}google`,`${prefix}youtube`,`${prefix}github`,`${prefix}npm`,`${prefix}pinterest`,`${prefix}image`,`${prefix}movie`,`${prefix}song`,`${prefix}lyrics`,`${prefix}wallpaper`,`${prefix}anime`,`${prefix}manga`]),
      section("🔄 CONVERTER MENU", [`${prefix}tourl`,`${prefix}toimg`,`${prefix}tomp3`,`${prefix}tovn`,`${prefix}toptt`,`${prefix}todoc`,`${prefix}topdf`,`${prefix}totext`]),
      section("🛡️ SECURITY MENU", [`${prefix}ban`,`${prefix}unban`,`${prefix}blacklist`,`${prefix}whitelist`,`${prefix}lock`,`${prefix}unlock`,`${prefix}antispam`,`${prefix}antibot`,`${prefix}sessioninfo`,`${prefix}security`]),
      section("💰 ECONOMY MENU", [`${prefix}balance`,`${prefix}daily`,`${prefix}work`,`${prefix}rob`,`${prefix}deposit`,`${prefix}withdraw`,`${prefix}shop`,`${prefix}buy`,`${prefix}sell`,`${prefix}inventory`,`${prefix}leaderboard`]),
      section("🎮 GAMES MENU", [`${prefix}tictactoe`,`${prefix}hangman`,`${prefix}math`,`${prefix}guess`,`${prefix}trivia`,`${prefix}chess`,`${prefix}memory`,`${prefix}wordgame`,`${prefix}slot`,`${prefix}lottery`]),
      section("🌸 ANIME MENU", [`${prefix}waifu`,`${prefix}neko`,`${prefix}animequote`,`${prefix}animewallpaper`,`${prefix}manga`,`${prefix}character`,`${prefix}cosplay`,`${prefix}animesearch`]),
      section("🛠️ TOOLS MENU", [`${prefix}encode`,`${prefix}decode`,`${prefix}hash`,`${prefix}uuid`,`${prefix}timestamp`]),
    ].join("\n");

    const helpFooter = box(`Type ${prefix}help [command]`, [`for command usage.`]);

    const text = [header, "", body, helpFooter, "", `«${footer}»`].join("\n");
    await sock.sendMessage(jid, { text });
  },
});

registerCommand({
  name: "xmenu",
  category: "general",
  description: "Show AI menu",
  handler: async ({ sock, jid, settings }) => {
    const p = settings["prefix"] ?? ".";
    const cmds = ["ai","gpt","chat","imagine","weather","wiki","translate","define","news","summarize","explain","code","fixcode","review","ask"];
    await sock.sendMessage(jid, { text: section("🧠 AI MENU", cmds.map(c => `${p}${c}`)) });
  },
});

registerCommand({
  name: "gcmenu",
  category: "general",
  description: "Show group menu",
  handler: async ({ sock, jid, settings }) => {
    const p = settings["prefix"] ?? ".";
    const cmds = ["kick","add","promote","demote","mute","unmute","link","revoke","groupinfo","everyone","hidetag","warn","unwarn","warnings","setname","setdesc","leave","tagall","antilink","antibadword","welcome","goodbye"];
    await sock.sendMessage(jid, { text: section("👥 GROUP MENU", cmds.map(c => `${p}${c}`)) });
  },
});

registerCommand({
  name: "downloadmenu",
  category: "general",
  description: "Show downloader menu",
  handler: async ({ sock, jid, settings }) => {
    const p = settings["prefix"] ?? ".";
    const cmds = ["yt","ytmp3","ytmp4","tiktok","ig","fb","twitter","spotify","soundcloud","mediafire","github","apk","play","play2"];
    await sock.sendMessage(jid, { text: section("⬇️ DOWNLOADER MENU", cmds.map(c => `${p}${c}`)) });
  },
});

registerCommand({
  name: "funmenu",
  category: "general",
  description: "Show fun menu",
  handler: async ({ sock, jid, settings }) => {
    const p = settings["prefix"] ?? ".";
    const cmds = ["joke","quote","fact","8ball","coinflip","dice","rps","ship","truth","dare","roast","pickup","simprate","love","couple","character"];
    await sock.sendMessage(jid, { text: section("🎉 FUN MENU", cmds.map(c => `${p}${c}`)) });
  },
});

registerCommand({
  name: "ownermenu",
  category: "general",
  description: "Show owner menu",
  handler: async ({ sock, jid, settings }) => {
    const p = settings["prefix"] ?? ".";
    const cmds = ["block","unblock","setprefix","broadcast","listgroups","setbotname","setowner","setfooter","enablecmd","disablecmd","shutdown","update","logs","backup","setbotprofile","private","public"];
    await sock.sendMessage(jid, { text: section("👑 OWNER MENU", cmds.map(c => `${p}${c}`)) });
  },
});

registerCommand({
  name: "help",
  aliases: ["ping"],
  category: "general",
  description: "Show help / check latency",
  handler: async ({ sock, jid, args, settings }) => {
    if (args[0]) {
      const cmd = args[0].replace(/^\./, "");
      await sock.sendMessage(jid, { text: `ℹ️ Use *${settings["prefix"] ?? "."}${cmd}* — check ${settings["prefix"] ?? "."}menu for all commands.` });
    } else {
      await sock.sendMessage(jid, { text: `✅ Bot online! Type *${settings["prefix"] ?? "."}menu* to see all commands.` });
    }
  },
});

registerCommand({
  name: "alive",
  category: "general",
  description: "Check if bot is alive",
  handler: async ({ sock, jid, settings }) => {
    const botName = settings["bot_name"] ?? "VORTEX XMD";
    await sock.sendMessage(jid, { text: `✅ *${botName}* is ALIVE!\n🟢 Status: Online\n⚡ Response: Fast\n🤖 Ready to serve.` });
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
      `╭━━━━━━━━━━━━━━━━━━━━╮`,
      `┃ 🤖 VORTEX XMD INFO`,
      `┃ Bot: ${settings["bot_name"] ?? "VORTEX XMD"}`,
      `┃ Owner: ${settings["owner_name"] ?? "LORD RAY"}`,
      `┃ Dev: ${settings["developer_name"] ?? "GHOST"}`,
      `┃ Version: 2.0.0`,
      `┃ Platform: ${os.platform()}`,
      `┃ Node: ${process.version}`,
      `╰━━━━━━━━━━━━━━━━━━━━╯`,
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
    const secs = Math.floor(process.uptime());
    const text = [
      `╭━━━━━━━━━━━━━━━━━━━━╮`,
      `┃ 🖥️ SYSTEM INFO`,
      `┃ Platform: ${os.platform()} ${os.arch()}`,
      `┃ Node: ${process.version}`,
      `┃ Memory: ${Math.round(mem.rss / 1024 / 1024)}MB`,
      `┃ Heap: ${Math.round(mem.heapUsed / 1024 / 1024)}MB`,
      `┃ CPU: ${os.cpus()[0]?.model?.slice(0, 25) ?? "N/A"}`,
      `┃ Uptime: ${Math.floor(secs/3600)}h ${Math.floor((secs%3600)/60)}m`,
      `╰━━━━━━━━━━━━━━━━━━━━╯`,
    ].join("\n");
    await sock.sendMessage(jid, { text });
  },
});

registerCommand({
  name: "stats",
  category: "general",
  description: "Show bot statistics",
  handler: async ({ sock, jid, settings }) => {
    const text = [
      `╭━━━━━━━━━━━━━━━━━━━━╮`,
      `┃ 📊 BOT STATS`,
      `┃ Bot: ${settings["bot_name"] ?? "VORTEX XMD"}`,
      `┃ Uptime: ${Math.floor(process.uptime()/3600)}h`,
      `┃ Memory: ${Math.round(process.memoryUsage().rss/1024/1024)}MB`,
      `┃ Status: Online ✅`,
      `╰━━━━━━━━━━━━━━━━━━━━╯`,
    ].join("\n");
    await sock.sendMessage(jid, { text });
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
        `╭━━━━━━━━━━━━━━━━━━━━╮`,
        `┃ 🆘 SUPPORT`,
        `┃ 📱 WhatsApp Group:`,
        `┃ https://chat.whatsapp.com/C6OnEkjVKaH2g7hsNbjIhd`,
        `┃ 📢 Channel:`,
        `┃ https://whatsapp.com/channel/0029VbDHkrrFSAsxToE5Fw3o`,
        `╰━━━━━━━━━━━━━━━━━━━━╯`,
      ].join("\n"),
    });
  },
});

registerCommand({ name: "wagroup", category: "general", description: "WhatsApp group link", handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: "📱 WhatsApp Group:\nhttps://chat.whatsapp.com/C6OnEkjVKaH2g7hsNbjIhd?s=cl&p=a&mlu=0" }); } });
registerCommand({ name: "wachannel", category: "general", description: "WhatsApp channel link", handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: "📢 WhatsApp Channel:\nhttps://whatsapp.com/channel/0029VbDHkrrFSAsxToE5Fw3o" }); } });
registerCommand({ name: "repo", category: "general", description: "Repository link", handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: "🔗 GitHub Repo:\nhttps://github.com/vortexxmd123/VORTEX-XMD-.git" }); } });
registerCommand({ name: "payment", category: "general", description: "Payment info", handler: async ({ sock, jid, settings }) => { await sock.sendMessage(jid, { text: `💰 Payment / Donations:\nContact owner: wa.me/${settings["owner_contact"] ?? "22879492633"}` }); } });
registerCommand({ name: "teledev", category: "general", description: "Developer Telegram", handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: "📲 Developer Telegram: t.me/GHOST" }); } });
registerCommand({ name: "telechannel", category: "general", description: "Telegram channel", handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: "📢 Telegram Channel: t.me/VORTEXMD" }); } });
registerCommand({ name: "telegroup", category: "general", description: "Telegram group", handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: "👥 Telegram Group: t.me/VORTEXMD_GROUP" }); } });
registerCommand({ name: "info", category: "general", description: "Bot info", handler: async ({ sock, jid, settings }) => { await sock.sendMessage(jid, { text: `ℹ️ *${settings["bot_name"] ?? "VORTEX XMD"}*\nMulti-user WhatsApp bot\nDev: ${settings["developer_name"] ?? "GHOST"}\nOwner: ${settings["owner_name"] ?? "LORD RAY"}` }); } });
registerCommand({ name: "restart", category: "general", description: "Restart bot", ownerOnly: true, handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: "🔄 Restarting..." }); process.exit(0); } });
