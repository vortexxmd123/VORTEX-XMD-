import { registerCommand } from "../lib/commandLoader";

async function fetchNeko(endpoint: string) {
  const res = await fetch(`https://nekos.life/api/v2/img/${endpoint}`);
  const d = await res.json() as { url?: string };
  return d.url ?? null;
}

registerCommand({ name: "waifu", category: "anime", description: "Random waifu image", handler: async ({ sock, jid }) => { try { const url = await fetchNeko("waifu"); await sock.sendMessage(jid, { image: { url: url! }, caption: "👩 Waifu~" }); } catch { await sock.sendMessage(jid, { text: "❌ Waifu image failed." }); } } });
registerCommand({ name: "neko", category: "anime", description: "Random neko image", handler: async ({ sock, jid }) => { try { const url = await fetchNeko("neko"); await sock.sendMessage(jid, { image: { url: url! }, caption: "🐱 Neko~" }); } catch { await sock.sendMessage(jid, { text: "❌ Neko image failed." }); } } });
registerCommand({ name: "animequote", category: "anime", description: "Random anime quote", handler: async ({ sock, jid }) => { try { const res = await fetch("https://animechan.io/api/v1/quotes/random"); const d = await res.json() as { data?: { content?: string; character?: { name?: string }; anime?: { name?: string } } }; const q = d.data; await sock.sendMessage(jid, { text: `🎌 *${q?.character?.name}* (${q?.anime?.name})\n\n"${q?.content}"` }); } catch { await sock.sendMessage(jid, { text: "❌ Anime quote failed." }); } } });
registerCommand({ name: "animewallpaper", category: "anime", description: "Random anime wallpaper", handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: "🖼️ Anime wallpaper: Integrate Wallhaven API." }); } });
registerCommand({ name: "cosplay", category: "anime", description: "Cosplay image", handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: "🎭 Cosplay: Search Pinterest for cosplay images." }); } });
registerCommand({ name: "animesearch", category: "anime", description: "Search anime by name", handler: async ({ sock, jid, args }) => { try { const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(args.join(" "))}&limit=3`); const d = await res.json() as { data?: Array<{ title?: string; score?: number; episodes?: number; status?: string }> }; const results = d.data?.map(a => `🎌 *${a.title}*\n⭐ ${a.score} | 📺 ${a.episodes} eps | ${a.status}`).join("\n\n") ?? "No results."; await sock.sendMessage(jid, { text: results }); } catch { await sock.sendMessage(jid, { text: "❌ Anime search failed." }); } } });
