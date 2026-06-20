import { registerCommand } from "../lib/commandLoader";

const aiReply = (name: string) => async ({ sock, jid, args, settings }: Parameters<Parameters<typeof registerCommand>[0]["handler"]>[0]) => {
  const key = settings["openai_api_key"];
  const query = args.join(" ");
  if (!query) { await sock.sendMessage(jid, { text: `Usage: .${name} <your question>` }); return; }
  if (!key) { await sock.sendMessage(jid, { text: `🤖 AI: Set openai_api_key in admin settings to enable AI responses.\n\nYou asked: "${query}"` }); return; }
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: "gpt-3.5-turbo", messages: [{ role: "user", content: query }], max_tokens: 500 }),
    });
    const data = await res.json() as { choices?: Array<{ message?: { content?: string } }> };
    const reply = data.choices?.[0]?.message?.content ?? "No response.";
    await sock.sendMessage(jid, { text: `🤖 ${name}: ${reply}` });
  } catch { await sock.sendMessage(jid, { text: "❌ AI request failed." }); }
};

registerCommand({ name: "ai", aliases: ["gpt", "chat", "ask"], category: "ai", description: "Ask AI a question", handler: aiReply("AI") });
registerCommand({ name: "imagine", category: "ai", description: "Generate image from text", handler: async ({ sock, jid, args }) => { await sock.sendMessage(jid, { text: `🖼️ Image generation for: "${args.join(" ")}" — set OpenAI API key to enable.` }); } });
registerCommand({ name: "weather", category: "ai", description: "Get weather for a location", handler: async ({ sock, jid, args, settings }) => { const key = settings["weather_api_key"]; const city = args.join(" ") || "London"; if (!key) { await sock.sendMessage(jid, { text: `🌤️ Weather for ${city}: Set weather_api_key in admin settings.` }); return; } try { const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${key}&units=metric`); const d = await res.json() as { name?: string; main?: { temp?: number; humidity?: number }; weather?: Array<{ description?: string }> }; await sock.sendMessage(jid, { text: `🌤️ *${d.name}*\n🌡️ Temp: ${d.main?.temp}°C\n💧 Humidity: ${d.main?.humidity}%\n📋 ${d.weather?.[0]?.description}` }); } catch { await sock.sendMessage(jid, { text: "❌ Weather request failed." }); } } });
registerCommand({ name: "wiki", category: "ai", description: "Search Wikipedia", handler: async ({ sock, jid, args }) => { const q = args.join(" "); try { const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(q)}`); const d = await res.json() as { extract?: string; title?: string }; await sock.sendMessage(jid, { text: `📖 *${d.title}*\n\n${d.extract ?? "No summary found."}` }); } catch { await sock.sendMessage(jid, { text: "❌ Wikipedia search failed." }); } } });
registerCommand({ name: "translate", category: "ai", description: "Translate text", handler: async ({ sock, jid, args }) => { await sock.sendMessage(jid, { text: `🌐 Translate: "${args.join(" ")}" — integrate Google Translate API.` }); } });
registerCommand({ name: "define", category: "ai", description: "Define a word", handler: async ({ sock, jid, args }) => { try { const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${args[0]}`); const d = await res.json() as Array<{ meanings?: Array<{ definitions?: Array<{ definition?: string }> }> }>; const def = d[0]?.meanings?.[0]?.definitions?.[0]?.definition ?? "No definition found."; await sock.sendMessage(jid, { text: `📚 *${args[0]}*: ${def}` }); } catch { await sock.sendMessage(jid, { text: "❌ Dictionary lookup failed." }); } } });
registerCommand({ name: "news", category: "ai", description: "Get latest news", handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: "📰 News: Integrate a news API for live headlines." }); } });
registerCommand({ name: "summarize", category: "ai", description: "Summarize text", handler: aiReply("Summarize") });
registerCommand({ name: "explain", category: "ai", description: "Explain a concept", handler: aiReply("Explain") });
registerCommand({ name: "code", category: "ai", description: "Generate code", handler: aiReply("Code") });
registerCommand({ name: "fixcode", category: "ai", description: "Fix code issues", handler: aiReply("FixCode") });
registerCommand({ name: "review", category: "ai", description: "Review code", handler: aiReply("Review") });
