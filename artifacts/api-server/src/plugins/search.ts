import { registerCommand } from "../lib/commandLoader";

registerCommand({
  name: "google",
  category: "search",
  description: "Search Google for anything",
  usage: ".google [query]",
  handler: async ({ sock, jid, args }) => {
    const q = args.join(" ");
    if (!q) { await sock.sendMessage(jid, { text: "Usage: .google [query]" }); return; }
    const url = `https://www.google.com/search?q=${encodeURIComponent(q)}`;
    await sock.sendMessage(jid, { text: `🔍 *Google Search:* "${q}"\n\n🌐 ${url}` });
  },
});

registerCommand({
  name: "youtube",
  category: "search",
  description: "Search YouTube for videos",
  usage: ".youtube [query]",
  handler: async ({ sock, jid, args }) => {
    const q = args.join(" ");
    if (!q) { await sock.sendMessage(jid, { text: "Usage: .youtube [query]" }); return; }
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
    await sock.sendMessage(jid, { text: `▶️ *YouTube Search:* "${q}"\n\n🎥 ${url}\n\n_Use .yt [url] to download a video_` });
  },
});

registerCommand({
  name: "github",
  category: "search",
  description: "Search GitHub repositories",
  usage: ".github [query]",
  handler: async ({ sock, jid, args }) => {
    const q = args.join(" ");
    if (!q) { await sock.sendMessage(jid, { text: "Usage: .github [query]" }); return; }
    try {
      const res = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&per_page=5`);
      const d = await res.json() as { items?: Array<{ full_name?: string; description?: string; stargazers_count?: number; language?: string; html_url?: string }> };
      if (!d.items?.length) { await sock.sendMessage(jid, { text: `❌ No repos found for: "${q}"` }); return; }
      const results = d.items.slice(0, 3).map((r, i) =>
        `${i + 1}. ⭐ *${r.full_name}*\n   ⭐ ${r.stargazers_count?.toLocaleString()} stars | ${r.language ?? "N/A"}\n   ${r.description?.slice(0, 80) ?? "No description"}`
      ).join("\n\n");
      await sock.sendMessage(jid, { text: `🐙 *GitHub Search: "${q}"*\n\n${results}` });
    } catch {
      await sock.sendMessage(jid, { text: "❌ GitHub search failed. Try again." });
    }
  },
});

registerCommand({
  name: "npm",
  category: "search",
  description: "Search NPM packages",
  usage: ".npm [package name]",
  handler: async ({ sock, jid, args }) => {
    const q = args.join(" ");
    if (!q) { await sock.sendMessage(jid, { text: "Usage: .npm [package name]" }); return; }
    try {
      const res = await fetch(`https://registry.npmjs.org/-/v1/search?text=${encodeURIComponent(q)}&size=5`);
      const d = await res.json() as { objects?: Array<{ package?: { name?: string; description?: string; version?: string; links?: { npm?: string } } }> };
      if (!d.objects?.length) { await sock.sendMessage(jid, { text: `❌ No packages found for: "${q}"` }); return; }
      const results = d.objects.slice(0, 3).map((o, i) =>
        `${i + 1}. 📦 *${o.package?.name}* v${o.package?.version}\n   ${o.package?.description?.slice(0, 80) ?? "No description"}`
      ).join("\n\n");
      await sock.sendMessage(jid, { text: `📦 *NPM Search: "${q}"*\n\n${results}` });
    } catch {
      await sock.sendMessage(jid, { text: "❌ NPM search failed." });
    }
  },
});

registerCommand({
  name: "pinterest",
  category: "search",
  description: "Search Pinterest boards",
  usage: ".pinterest [query]",
  handler: async ({ sock, jid, args }) => {
    const q = args.join(" ");
    if (!q) { await sock.sendMessage(jid, { text: "Usage: .pinterest [query]" }); return; }
    const url = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(q)}`;
    await sock.sendMessage(jid, { text: `📌 *Pinterest Search:* "${q}"\n\n🌐 ${url}` });
  },
});

registerCommand({
  name: "image",
  category: "search",
  description: "Search images on Google",
  usage: ".image [query]",
  handler: async ({ sock, jid, args }) => {
    const q = args.join(" ");
    if (!q) { await sock.sendMessage(jid, { text: "Usage: .image [query]" }); return; }
    const url = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(q)}`;
    await sock.sendMessage(jid, { text: `🖼️ *Image Search:* "${q}"\n\n🌐 ${url}` });
  },
});

registerCommand({
  name: "movie",
  category: "search",
  description: "Search movie information",
  usage: ".movie [title]",
  handler: async ({ sock, jid, args }) => {
    const title = args.join(" ");
    if (!title) { await sock.sendMessage(jid, { text: "Usage: .movie [movie title]" }); return; }
    try {
      const res = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=trilogy`);
      const d = await res.json() as { Title?: string; Year?: string; Plot?: string; imdbRating?: string; Genre?: string; Director?: string; Response?: string };
      if (d.Response === "False") { await sock.sendMessage(jid, { text: `❌ Movie not found: "${title}"` }); return; }
      await sock.sendMessage(jid, {
        text: [
          `🎬 *${d.Title}* (${d.Year})`,
          ``,
          `⭐ IMDb: ${d.imdbRating}/10`,
          `🎭 Genre: ${d.Genre}`,
          `🎬 Director: ${d.Director}`,
          ``,
          `📖 ${d.Plot}`,
        ].join("\n"),
      });
    } catch {
      await sock.sendMessage(jid, { text: "❌ Movie search failed. Try again." });
    }
  },
});

registerCommand({
  name: "song",
  category: "search",
  description: "Search for a song",
  usage: ".song [song name]",
  handler: async ({ sock, jid, args }) => {
    const q = args.join(" ");
    if (!q) { await sock.sendMessage(jid, { text: "Usage: .song [song name]" }); return; }
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(q + " official audio")}`;
    await sock.sendMessage(jid, { text: `🎵 *Song Search:* "${q}"\n\n▶️ ${url}\n\n_Use .ytmp3 to download as audio_` });
  },
});

registerCommand({
  name: "lyrics",
  category: "search",
  description: "Search lyrics for a song",
  usage: ".lyrics [song name]",
  handler: async ({ sock, jid, args }) => {
    const q = args.join(" ");
    if (!q) { await sock.sendMessage(jid, { text: "Usage: .lyrics [song name]" }); return; }
    try {
      const res = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(q.split(" ")[0])}/${encodeURIComponent(q.split(" ").slice(1).join(" ") || q)}`);
      const d = await res.json() as { lyrics?: string; error?: string };
      if (d.error || !d.lyrics) { await sock.sendMessage(jid, { text: `❌ Lyrics not found for: "${q}"` }); return; }
      await sock.sendMessage(jid, { text: `🎵 *Lyrics: ${q}*\n\n${d.lyrics.slice(0, 1000)}${d.lyrics.length > 1000 ? "\n\n_...truncated_" : ""}` });
    } catch {
      await sock.sendMessage(jid, { text: `❌ Lyrics search failed for: "${q}"` });
    }
  },
});

registerCommand({
  name: "wallpaper",
  category: "search",
  description: "Search for wallpapers",
  usage: ".wallpaper [query]",
  handler: async ({ sock, jid, args }) => {
    const q = args.join(" ") || "nature";
    const url = `https://wallhaven.cc/search?q=${encodeURIComponent(q)}`;
    await sock.sendMessage(jid, { text: `🖼️ *Wallpaper Search:* "${q}"\n\n🌐 ${url}\n\n_Visit Wallhaven for HD wallpapers!_` });
  },
});

registerCommand({
  name: "anime",
  category: "search",
  description: "Search anime information",
  usage: ".anime [title]",
  handler: async ({ sock, jid, args }) => {
    const q = args.join(" ");
    if (!q) { await sock.sendMessage(jid, { text: "Usage: .anime [anime title]" }); return; }
    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}&limit=3`);
      const d = await res.json() as { data?: Array<{ title?: string; score?: number; episodes?: number; status?: string; synopsis?: string }> };
      if (!d.data?.length) { await sock.sendMessage(jid, { text: `❌ No anime found for: "${q}"` }); return; }
      const results = d.data.map((a, i) =>
        `${i + 1}. 🎌 *${a.title}*\n   ⭐ ${a.score ?? "?"} | 📺 ${a.episodes ?? "?"} eps | ${a.status ?? "?"}`
      ).join("\n\n");
      await sock.sendMessage(jid, { text: `🎌 *Anime: "${q}"*\n\n${results}` });
    } catch {
      await sock.sendMessage(jid, { text: "❌ Anime search failed." });
    }
  },
});

registerCommand({
  name: "manga",
  category: "search",
  description: "Search manga information",
  usage: ".manga [title]",
  handler: async ({ sock, jid, args }) => {
    const q = args.join(" ");
    if (!q) { await sock.sendMessage(jid, { text: "Usage: .manga [manga title]" }); return; }
    try {
      const res = await fetch(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(q)}&limit=3`);
      const d = await res.json() as { data?: Array<{ title?: string; score?: number; chapters?: number; status?: string }> };
      if (!d.data?.length) { await sock.sendMessage(jid, { text: `❌ No manga found for: "${q}"` }); return; }
      const results = d.data.map((m, i) =>
        `${i + 1}. 📚 *${m.title}*\n   ⭐ ${m.score ?? "?"} | 📖 ${m.chapters ?? "?"} chapters | ${m.status ?? "?"}`
      ).join("\n\n");
      await sock.sendMessage(jid, { text: `📚 *Manga: "${q}"*\n\n${results}` });
    } catch {
      await sock.sendMessage(jid, { text: "❌ Manga search failed." });
    }
  },
});
