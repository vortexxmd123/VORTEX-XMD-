import { registerCommand } from "../lib/commandLoader";

const jokes = [
  "Why don't scientists trust atoms? Because they make up everything!",
  "What do you call a fake noodle? An impasta!",
  "Why did the scarecrow win an award? He was outstanding in his field!",
  "I told my wife she was drawing her eyebrows too high. She looked surprised.",
  "What do you call cheese that isn't yours? Nacho cheese!",
  "Why can't you give Elsa a balloon? Because she'll let it go.",
  "I'm reading a book about anti-gravity. It's impossible to put down.",
  "Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them.",
];

const quotes = [
  "The only way to do great work is to love what you do. — Steve Jobs",
  "Life is what happens when you're busy making other plans. — John Lennon",
  "Be the change you wish to see in the world. — Gandhi",
  "In the middle of every difficulty lies opportunity. — Albert Einstein",
  "It does not matter how slowly you go as long as you do not stop. — Confucius",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. — Churchill",
  "The future belongs to those who believe in the beauty of their dreams. — Eleanor Roosevelt",
];

const facts = [
  "Honey never expires. Archaeologists found 3000-year-old honey in Egyptian tombs.",
  "Bananas are berries, but strawberries aren't.",
  "A group of flamingos is called a flamboyance.",
  "Sharks are older than trees. They've existed for over 400 million years.",
  "The word 'nerd' was first used by Dr. Seuss in 1950.",
  "A day on Venus is longer than a year on Venus.",
  "Cows have best friends and get stressed when separated from them.",
  "Octopuses have three hearts and blue blood.",
];

const roasts = [
  "You're not stupid; you just have bad luck thinking.",
  "I'd agree with you, but then we'd both be wrong.",
  "You're like a software update. Whenever I see you, I think 'not now'.",
  "You have your entire life to be stupid. Please take a day off.",
  "I'd call you a tool but that would imply you're useful.",
  "You're the reason they put instructions on shampoo bottles.",
];

const pickups = [
  "Are you a magician? Because whenever I look at you, everyone else disappears.",
  "Do you have a map? I keep getting lost in your eyes.",
  "Is your name Google? Because you have everything I've been searching for.",
  "Do you believe in love at first text, or should I message you again?",
  "Are you a charger? Because I'd die without you.",
  "Is your name Wi-Fi? Because I'm feeling a connection.",
];

const truths = [
  "What's the most embarrassing thing you've ever done?",
  "Have you ever lied to your best friend?",
  "What's your biggest fear?",
  "What's the most childish thing you still do?",
  "Have you ever cheated on a test?",
  "What's the most embarrassing thing on your phone?",
];

const dares = [
  "Send a voice note singing your favorite song.",
  "Change your profile picture for 1 hour.",
  "Text someone you haven't talked to in months.",
  "Send your last 5 Google searches.",
  "Do 20 push-ups right now.",
  "Send a selfie with a funny face.",
];

const characters = ["Brave", "Cunning", "Wise", "Loyal", "Chaotic", "Noble", "Mysterious", "Fierce", "Gentle", "Bold", "Crafty", "Honorable"];

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const pct = () => Math.floor(Math.random() * 101);

registerCommand({ name: "joke", category: "fun", description: "Get a random joke", handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: `😂 ${pick(jokes)}` }); } });
registerCommand({ name: "quote", category: "fun", description: "Get an inspirational quote", handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: `💬 ${pick(quotes)}` }); } });
registerCommand({ name: "fact", category: "fun", description: "Get a random fact", handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: `🧠 *Did you know?*\n${pick(facts)}` }); } });
registerCommand({ name: "8ball", category: "fun", description: "Ask the magic 8-ball", usage: ".8ball [question]", handler: async ({ sock, jid, args }) => { const responses = ["Yes! 🎱", "No. 🎱", "Maybe... 🎱", "Definitely! 🎱", "Ask again later. 🎱", "I don't think so. 🎱", "Absolutely! 🎱", "Not a chance. 🎱", "Signs point to yes. 🎱", "Very doubtful. 🎱"]; const q = args.join(" ") || "your question"; await sock.sendMessage(jid, { text: `🎱 *Question:* ${q}\n\n*Answer:* ${pick(responses)}` }); } });
registerCommand({ name: "coinflip", category: "fun", description: "Flip a coin", handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: `🪙 *Coin Flip:* ${Math.random() < 0.5 ? "Heads! 🦅" : "Tails! 💫"}` }); } });
registerCommand({ name: "dice", category: "fun", description: "Roll a dice", handler: async ({ sock, jid, args }) => { const sides = parseInt(args[0]) || 6; const result = Math.floor(Math.random() * sides) + 1; await sock.sendMessage(jid, { text: `🎲 *Rolled a d${sides}:* ${result}` }); } });
registerCommand({ name: "rps", category: "fun", description: "Rock Paper Scissors", usage: ".rps rock/paper/scissors", handler: async ({ sock, jid, args }) => { const choices = ["rock 🪨", "paper 📄", "scissors ✂️"]; const bot = pick(choices); const raw = args[0]?.toLowerCase(); const user = choices.find(c => c.startsWith(raw)); if (!user) { await sock.sendMessage(jid, { text: "Usage: .rps rock / paper / scissors" }); return; } const userKey = user.split(" ")[0]; const botKey = bot.split(" ")[0]; const wins: Record<string, string> = { rock: "scissors", paper: "rock", scissors: "paper" }; const result = userKey === botKey ? "It's a *Draw!* 🤝" : wins[userKey] === botKey ? "You *Win!* 🎉" : "Bot *Wins!* 😏"; await sock.sendMessage(jid, { text: `You: ${user}\nBot: ${bot}\n\n${result}` }); } });
registerCommand({ name: "ship", category: "fun", description: "Ship two people", usage: ".ship [name1] [name2]", handler: async ({ sock, jid, args }) => { const n1 = args[0] ?? "Person1"; const n2 = args[1] ?? "Person2"; const score = pct(); const bar = "█".repeat(Math.floor(score/10)) + "░".repeat(10-Math.floor(score/10)); await sock.sendMessage(jid, { text: `💕 *Ship Meter*\n\n${n1} ❤️ ${n2}\n\n[${bar}] ${score}%\n\n${score >= 80 ? "Perfect match! 💍" : score >= 50 ? "Good chemistry! 💞" : "Keep trying! 😅"}` }); } });
registerCommand({ name: "truth", category: "fun", description: "Truth or dare — truth", handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: `💬 *Truth:* ${pick(truths)}` }); } });
registerCommand({ name: "dare", category: "fun", description: "Truth or dare — dare", handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: `🎯 *Dare:* ${pick(dares)}` }); } });
registerCommand({ name: "roast", category: "fun", description: "Get roasted", handler: async ({ sock, jid, args }) => { await sock.sendMessage(jid, { text: `🔥 *Roast:* ${args[0] ? `@${args[0]}` : "You"}: ${pick(roasts)}` }); } });
registerCommand({ name: "pickup", category: "fun", description: "Random pickup line", handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: `😉 *Pickup Line:*\n${pick(pickups)}` }); } });
registerCommand({ name: "simprate", category: "fun", description: "Check simp rate", handler: async ({ sock, jid, args }) => { const score = pct(); await sock.sendMessage(jid, { text: `😂 *Simp Rate*\n${args[0] ?? "You"}: ${score}% simp\n${"🥺".repeat(Math.ceil(score/20))}` }); } });
registerCommand({ name: "love", category: "fun", description: "Check love percentage", handler: async ({ sock, jid, args }) => { const score = pct(); await sock.sendMessage(jid, { text: `❤️ *Love Meter*\n${args[0] ?? "You"}: ${score}%\n${"❤️".repeat(Math.ceil(score/20))}` }); } });
registerCommand({ name: "couple", category: "fun", description: "Check couple compatibility", handler: async ({ sock, jid, args }) => { const score = pct(); await sock.sendMessage(jid, { text: `💑 *Compatibility*\n${args[0] ?? "A"} + ${args[1] ?? "B"} = ${score}%\n${score >= 70 ? "Goals! 💍" : score >= 40 ? "Keep working! 💪" : "Hmm... 🤔"}` }); } });
registerCommand({ name: "character", category: "fun", description: "Get a random character trait", handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: `🎭 *Your Character:* ${pick(characters)}\n${pick(["You are destined for greatness!", "The stars align in your favor.", "Your true power is yet to be revealed."])}` }); } });
