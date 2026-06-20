import { registerCommand } from "../lib/commandLoader";

const triviaQ = [
  { q: "What is 2+2?", a: "4" },
  { q: "What color is the sky?", a: "blue" },
  { q: "How many days in a week?", a: "7" },
];

registerCommand({ name: "tictactoe", aliases: ["ttt"], category: "games", description: "Play Tic-Tac-Toe", handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: "❌⭕ Tic-Tac-Toe: Feature coming soon! Play with a friend." }); } });
registerCommand({ name: "hangman", category: "games", description: "Play Hangman", handler: async ({ sock, jid }) => { const words = ["VORTEX", "WHISKEY", "BAILEYS", "CIPHER", "MATRIX"]; const word = words[Math.floor(Math.random() * words.length)]; await sock.sendMessage(jid, { text: `🎯 Hangman: _ `.repeat(word.length) + "\nGuess a letter with .guess <letter>" }); } });
registerCommand({ name: "math", category: "games", description: "Math challenge", handler: async ({ sock, jid }) => { const a = Math.floor(Math.random() * 50); const b = Math.floor(Math.random() * 50); await sock.sendMessage(jid, { text: `🔢 Solve: ${a} + ${b} = ?\nAnswer with .guess ${a + b}` }); } });
registerCommand({ name: "guess", category: "games", description: "Guess a number (1-100)", handler: async ({ sock, jid, args }) => { const n = Math.floor(Math.random() * 100) + 1; const guess = parseInt(args[0]); if (guess === n) { await sock.sendMessage(jid, { text: `🎉 Correct! The number was ${n}!` }); } else { await sock.sendMessage(jid, { text: `❌ Wrong! The number was ${n}. Try again!` }); } } });
registerCommand({ name: "trivia", category: "games", description: "Random trivia question", handler: async ({ sock, jid }) => { const q = triviaQ[Math.floor(Math.random() * triviaQ.length)]; await sock.sendMessage(jid, { text: `❓ Trivia: ${q.q}\nAnswer: ||${q.a}||` }); } });
registerCommand({ name: "chess", category: "games", description: "Chess game", handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: "♟️ Chess mode: Coming soon!" }); } });
registerCommand({ name: "memory", category: "games", description: "Memory card game", handler: async ({ sock, jid }) => { await sock.sendMessage(jid, { text: "🃏 Memory game: Coming soon!" }); } });
registerCommand({ name: "wordgame", category: "games", description: "Word game", handler: async ({ sock, jid }) => { const words = ["VORTEX", "PYTHON", "CIPHER", "MATRIX", "PHANTOM"]; const word = words[Math.floor(Math.random() * words.length)]; await sock.sendMessage(jid, { text: `🔤 Unscramble: ${word.split("").sort(() => Math.random() - 0.5).join("")}` }); } });
registerCommand({ name: "slot", category: "games", description: "Slot machine", handler: async ({ sock, jid }) => { const symbols = ["🍎", "🍊", "🍋", "🍇", "⭐", "💎"]; const s = Array.from({ length: 3 }, () => symbols[Math.floor(Math.random() * symbols.length)]); const win = s.every(x => x === s[0]); await sock.sendMessage(jid, { text: `🎰 [ ${s.join(" | ")} ]\n${win ? "🎉 JACKPOT!" : "Try again!"}` }); } });
registerCommand({ name: "lottery", category: "games", description: "Lottery ticket", handler: async ({ sock, jid }) => { const nums = Array.from({ length: 6 }, () => Math.floor(Math.random() * 49) + 1); await sock.sendMessage(jid, { text: `🎱 Lottery numbers: ${nums.join(" - ")}` }); } });
