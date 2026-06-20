import { registerCommand } from "../lib/commandLoader";
import { createHash } from "crypto";
import { v4 as uuidv4 } from "uuid";

registerCommand({
  name: "encode",
  category: "tools",
  description: "Encode text in base64 or URL format",
  usage: ".encode base64|url [text]",
  handler: async ({ sock, jid, args }) => {
    const [type, ...rest] = args;
    const text = rest.join(" ");
    if (!type || !text) { await sock.sendMessage(jid, { text: "Usage: .encode base64|url [text]" }); return; }
    const result = type === "url" ? encodeURIComponent(text) : Buffer.from(text).toString("base64");
    await sock.sendMessage(jid, { text: `🔐 *Encoded (${type.toUpperCase()}):*\n${result}` });
  },
});

registerCommand({
  name: "decode",
  category: "tools",
  description: "Decode base64 or URL encoded text",
  usage: ".decode base64|url [text]",
  handler: async ({ sock, jid, args }) => {
    const [type, ...rest] = args;
    const text = rest.join(" ");
    if (!type || !text) { await sock.sendMessage(jid, { text: "Usage: .decode base64|url [text]" }); return; }
    try {
      const result = type === "url" ? decodeURIComponent(text) : Buffer.from(text, "base64").toString("utf-8");
      await sock.sendMessage(jid, { text: `🔓 *Decoded (${type.toUpperCase()}):*\n${result}` });
    } catch {
      await sock.sendMessage(jid, { text: "❌ Decode failed. Check your input format." });
    }
  },
});

registerCommand({
  name: "hash",
  category: "tools",
  description: "Hash text using md5, sha1, sha256, or sha512",
  usage: ".hash md5|sha1|sha256|sha512 [text]",
  handler: async ({ sock, jid, args }) => {
    const [algo, ...rest] = args;
    const text = rest.join(" ");
    if (!text) { await sock.sendMessage(jid, { text: "Usage: .hash md5|sha1|sha256|sha512 [text]" }); return; }
    const validAlgos = ["md5", "sha1", "sha256", "sha512"];
    const a = validAlgos.includes(algo?.toLowerCase()) ? algo.toLowerCase() : "sha256";
    const hashed = createHash(a).update(text).digest("hex");
    await sock.sendMessage(jid, { text: `#️⃣ *Hash (${a.toUpperCase()}):*\n${hashed}` });
  },
});

registerCommand({
  name: "uuid",
  category: "tools",
  description: "Generate a random UUID v4",
  handler: async ({ sock, jid }) => {
    const id = uuidv4();
    await sock.sendMessage(jid, { text: `🔑 *Generated UUID:*\n${id}` });
  },
});

registerCommand({
  name: "timestamp",
  category: "tools",
  description: "Get current Unix timestamp",
  handler: async ({ sock, jid }) => {
    const now = new Date();
    await sock.sendMessage(jid, {
      text: [
        `⏰ *TIMESTAMP*`,
        ``,
        `Unix (ms): ${now.getTime()}`,
        `Unix (s): ${Math.floor(now.getTime() / 1000)}`,
        `ISO: ${now.toISOString()}`,
        `UTC: ${now.toUTCString()}`,
        `Local: ${now.toLocaleString()}`,
      ].join("\n"),
    });
  },
});

registerCommand({
  name: "iplookup",
  aliases: ["ip"],
  category: "tools",
  description: "IP address geolocation lookup",
  usage: ".iplookup [IP address]",
  handler: async ({ sock, jid, args }) => {
    const ip = args[0] ?? "8.8.8.8";
    try {
      const res = await fetch(`http://ip-api.com/json/${ip}`);
      const d = await res.json() as { country?: string; regionName?: string; city?: string; isp?: string; query?: string; org?: string; timezone?: string };
      await sock.sendMessage(jid, {
        text: [
          `🌐 *IP LOOKUP: ${d.query}*`,
          ``,
          `🏳️ Country: ${d.country}`,
          `🗺️ Region: ${d.regionName}`,
          `🏙️ City: ${d.city}`,
          `📡 ISP: ${d.isp}`,
          `🏢 Org: ${d.org}`,
          `🕐 Timezone: ${d.timezone}`,
        ].join("\n"),
      });
    } catch {
      await sock.sendMessage(jid, { text: "❌ IP lookup failed. Try again." });
    }
  },
});

registerCommand({
  name: "whois",
  category: "tools",
  description: "Domain WHOIS lookup",
  usage: ".whois [domain]",
  handler: async ({ sock, jid, args }) => {
    const domain = args[0] ?? "example.com";
    await sock.sendMessage(jid, { text: `🔍 *WHOIS: ${domain}*\n\nIntegrate a WHOIS API for full domain registration details.` });
  },
});

registerCommand({
  name: "dns",
  category: "tools",
  description: "DNS lookup for a domain",
  usage: ".dns [domain]",
  handler: async ({ sock, jid, args }) => {
    const domain = args[0] ?? "google.com";
    try {
      const res = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
      const d = await res.json() as { Answer?: Array<{ data?: string; TTL?: number }> };
      const records = d.Answer?.map(r => `→ ${r.data} (TTL: ${r.TTL}s)`).join("\n") ?? "No A records found.";
      await sock.sendMessage(jid, { text: `🌐 *DNS (A Records): ${domain}*\n\n${records}` });
    } catch {
      await sock.sendMessage(jid, { text: "❌ DNS lookup failed." });
    }
  },
});

registerCommand({
  name: "pinghost",
  category: "tools",
  description: "Check if a host/URL is online",
  usage: ".pinghost [domain]",
  handler: async ({ sock, jid, args }) => {
    const host = args[0] ?? "google.com";
    const start = Date.now();
    try {
      const res = await fetch(`https://${host}`, { signal: AbortSignal.timeout(5000) });
      const ms = Date.now() - start;
      await sock.sendMessage(jid, { text: `🏓 *Ping: ${host}*\n\n✅ Online — ${ms}ms\nStatus: ${res.status}` });
    } catch {
      await sock.sendMessage(jid, { text: `🏓 *Ping: ${host}*\n\n❌ Unreachable or timeout.` });
    }
  },
});

registerCommand({
  name: "portscan",
  category: "tools",
  description: "Common port reference for a host",
  usage: ".portscan [host]",
  handler: async ({ sock, jid, args }) => {
    const host = args[0] ?? "localhost";
    await sock.sendMessage(jid, {
      text: [
        `🔍 *PORT REFERENCE: ${host}*`,
        ``,
        `Common ports:`,
        `• 80 — HTTP`,
        `• 443 — HTTPS`,
        `• 22 — SSH`,
        `• 21 — FTP`,
        `• 3306 — MySQL`,
        `• 5432 — PostgreSQL`,
        `• 6379 — Redis`,
        `• 27017 — MongoDB`,
        ``,
        `_Full port scanning requires server-side tools._`,
      ].join("\n"),
    });
  },
});
