import { registerCommand } from "../lib/commandLoader";

async function fetchNeko(endpoint: string): Promise<string | null> {
  try {
    const res = await fetch(`https://nekos.life/api/v2/img/${endpoint}`);
    const d = await res.json() as { url?: string };
    return d.url ?? null;
  } catch {
    return null;
  }
}

const animeQuotes = [
  { quote: "If you don't take risks, you can't create a future.", character: "Monkey D. Luffy", anime: "One Piece" },
  { quote: "Hard work is worthless for those that don't believe in themselves.", character: "Naruto Uzumaki", anime: "Naruto" },
  { quote: "The world is not beautiful, therefore it is.", character: "Kino", anime: "Kino's Journey" },
  { quote: "Whatever you lose, you'll find it again. But what you throw away you'll never get back.", character: "Kenshin Himura", anime: "Rurouni Kenshin" },
  { quote: "Fear is not evil. It tells you what your weakness is.", character: "Gildarts Clive", anime: "Fairy Tail" },
  { quote: "A lesson without pain is meaningless.", character: "Edward Elric", anime: "Fullmetal Alchemist" },
  { quote: "It's not the face that makes someone a monster; it's the choices they make with their lives.", character: "Naruto", anime: "Naruto" },
];

const characterTraits = [
  { name: "Kakashi Hatake", trait: "Cool & Mysterious", anime: "Naruto" },
  { name: "Goku", trait: "Pure-hearted Warrior", anime: "Dragon Ball Z" },
  { name: "Luffy", trait: "Carefree & Determined", anime: "One Piece" },
  { name: "Levi Ackerman", trait: "Cold & Efficient", anime: "Attack on Titan" },
  { name: "Itachi Uchiha", trait: "Wise & Sacrificial", anime: "Naruto" },
  { name: "Zoro", trait: "Loyal & Ambitious", anime: "One Piece" },
  { name: "Killua", trait: "Fast & Ruthless", anime: "Hunter x Hunter" },
  { name: "Saitama", trait: "Overpowered & Bored", anime: "One Punch Man" },
];

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

registerCommand({
  name: "waifu",
  category: "anime",
  description: "Random waifu image",
  handler: async ({ sock, jid }) => {
    const url = await fetchNeko("waifu");
    if (url) {
      await sock.sendMessage(jid, { image: { url }, caption: "👩 Waifu~ 💕" });
    } else {
      await sock.sendMessage(jid, { text: "❌ Failed to fetch waifu image. Try again!" });
    }
  },
});

registerCommand({
  name: "neko",
  category: "anime",
  description: "Random neko/catgirl image",
  handler: async ({ sock, jid }) => {
    const url = await fetchNeko("neko");
    if (url) {
      await sock.sendMessage(jid, { image: { url }, caption: "🐱 Neko~ nya!" });
    } else {
      await sock.sendMessage(jid, { text: "❌ Failed to fetch neko image. Try again!" });
    }
  },
});

registerCommand({
  name: "animequote",
  category: "anime",
  description: "Random anime quote",
  handler: async ({ sock, jid }) => {
    try {
      const res = await fetch("https://animechan.io/api/v1/quotes/random");
      const d = await res.json() as { data?: { content?: string; character?: { name?: string }; anime?: { name?: string } } };
      const q = d.data;
      if (q?.content) {
        await sock.sendMessage(jid, { text: `🎌 *"${q.content}"*\n\n— *${q.character?.name}*\n📺 ${q.anime?.name}` });
        return;
      }
    } catch { /* fall through to local quotes */ }
    const q = pick(animeQuotes);
    await sock.sendMessage(jid, { text: `🎌 *"${q.quote}"*\n\n— *${q.character}*\n📺 ${q.anime}` });
  },
});

registerCommand({
  name: "animewallpaper",
  category: "anime",
  description: "Random anime wallpaper",
  handler: async ({ sock, jid }) => {
    const url = await fetchNeko("wallpaper");
    if (url) {
      await sock.sendMessage(jid, { image: { url }, caption: "🖼️ Anime Wallpaper~" });
    } else {
      await sock.sendMessage(jid, { text: "🖼️ Anime Wallpaper: Integrate Wallhaven API for HD wallpapers." });
    }
  },
});

registerCommand({
  name: "manga",
  category: "anime",
  description: "Search manga by name",
  usage: ".manga [name]",
  handler: async ({ sock, jid, args }) => {
    const query = args.join(" ");
    if (!query) { await sock.sendMessage(jid, { text: "Usage: .manga [manga name]" }); return; }
    try {
      const res = await fetch(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(query)}&limit=3`);
      const d = await res.json() as { data?: Array<{ title?: string; score?: number; chapters?: number; status?: string; synopsis?: string }> };
      if (!d.data?.length) { await sock.sendMessage(jid, { text: `❌ No manga found for: "${query}"` }); return; }
      const results = d.data.map((m, i) =>
        `${i + 1}. 📚 *${m.title}*\n   ⭐ ${m.score ?? "?"} | 📖 ${m.chapters ?? "?"} chapters | ${m.status ?? "?"}`
      ).join("\n\n");
      await sock.sendMessage(jid, { text: `📚 *Manga Search: "${query}"*\n\n${results}` });
    } catch {
      await sock.sendMessage(jid, { text: "❌ Manga search failed. Try again later." });
    }
  },
});

registerCommand({
  name: "character",
  category: "anime",
  description: "Get a random anime character",
  handler: async ({ sock, jid }) => {
    const c = pick(characterTraits);
    await sock.sendMessage(jid, {
      text: [
        `🎭 *ANIME CHARACTER*`,
        ``,
        `👤 Name: *${c.name}*`,
        `📺 Anime: *${c.anime}*`,
        `✨ Trait: *${c.trait}*`,
        ``,
        `_You matched with this character!_`,
      ].join("\n"),
    });
  },
});

registerCommand({
  name: "cosplay",
  category: "anime",
  description: "Cosplay image/info",
  handler: async ({ sock, jid }) => {
    const url = await fetchNeko("uniform");
    if (url) {
      await sock.sendMessage(jid, { image: { url }, caption: "🎭 Cosplay vibes~ ✨" });
    } else {
      await sock.sendMessage(jid, { text: "🎭 Cosplay: Search Pinterest or Instagram for amazing cosplay photos!" });
    }
  },
});

registerCommand({
  name: "animesearch",
  category: "anime",
  description: "Search anime by name",
  usage: ".animesearch [anime name]",
  handler: async ({ sock, jid, args }) => {
    const query = args.join(" ");
    if (!query) { await sock.sendMessage(jid, { text: "Usage: .animesearch [anime name]" }); return; }
    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=3`);
      const d = await res.json() as { data?: Array<{ title?: string; score?: number; episodes?: number; status?: string; synopsis?: string }> };
      if (!d.data?.length) { await sock.sendMessage(jid, { text: `❌ No anime found for: "${query}"` }); return; }
      const results = d.data.map((a, i) =>
        `${i + 1}. 🎌 *${a.title}*\n   ⭐ ${a.score ?? "?"} | 📺 ${a.episodes ?? "?"} eps | ${a.status ?? "?"}`
      ).join("\n\n");
      await sock.sendMessage(jid, { text: `🎌 *Anime Search: "${query}"*\n\n${results}` });
    } catch {
      await sock.sendMessage(jid, { text: "❌ Anime search failed. Try again later." });
    }
  },
});
