import { registerCommand } from "../lib/commandLoader";

const trivia = [
  { q: "What is the capital of France?", a: "paris" },
  { q: "What is 12 × 12?", a: "144" },
  { q: "Which planet is closest to the Sun?", a: "mercury" },
  { q: "How many sides does a hexagon have?", a: "6" },
  { q: "What is the largest ocean?", a: "pacific" },
  { q: "What year did WW2 end?", a: "1945" },
  { q: "What language does WhatsApp use for bots?", a: "javascript" },
  { q: "Who created WhatsApp?", a: "jan koum" },
];

const hangmanWords = ["VORTEX", "BAILEYS", "CIPHER", "MATRIX", "PHANTOM", "SHADOW", "PYTHON", "NODEJS", "GITHUB", "BINARY"];

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

registerCommand({
  name: "tictactoe",
  aliases: ["ttt"],
  category: "games",
  description: "Play Tic-Tac-Toe (text-based)",
  handler: async ({ sock, jid }) => {
    const board = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣"];
    const display = `${board[0]}${board[1]}${board[2]}\n${board[3]}${board[4]}${board[5]}\n${board[6]}${board[7]}${board[8]}`;
    await sock.sendMessage(jid, { text: `❌⭕ *TIC-TAC-TOE*\n\n${display}\n\nType a number (1-9) to play!\n_(Full multiplayer coming soon)_` });
  },
});

registerCommand({
  name: "hangman",
  category: "games",
  description: "Start a hangman game",
  handler: async ({ sock, jid }) => {
    const word = pick(hangmanWords);
    const blanks = "_ ".repeat(word.length).trim();
    await sock.sendMessage(jid, {
      text: [
        `🎯 *HANGMAN*`,
        ``,
        `  +---+`,
        `  |   |`,
        `      |`,
        `      |`,
        `      |`,
        `      |`,
        `=========`,
        ``,
        `Word: ${blanks} (${word.length} letters)`,
        ``,
        `_Hint: It's a tech/bot related word!_`,
        `Reply with a letter to guess.`,
      ].join("\n"),
    });
  },
});

registerCommand({
  name: "math",
  category: "games",
  description: "Random math challenge",
  handler: async ({ sock, jid }) => {
    const ops = ["+", "-", "×", "÷"];
    const op = pick(ops);
    let a = Math.floor(Math.random() * 50) + 1;
    let b = Math.floor(Math.random() * 20) + 1;
    let answer: number;
    if (op === "÷") { answer = a; a = a * b; }
    else if (op === "×") { answer = a * b; }
    else if (op === "-") { answer = a - b; }
    else { answer = a + b; }
    await sock.sendMessage(jid, { text: `🔢 *MATH CHALLENGE*\n\n${a} ${op} ${b} = ?\n\n_Reply with your answer!_\n||Answer: ${answer}||` });
  },
});

registerCommand({
  name: "guess",
  category: "games",
  description: "Guess a number between 1-100",
  handler: async ({ sock, jid, args }) => {
    const secret = Math.floor(Math.random() * 100) + 1;
    const guess = parseInt(args[0]);
    if (!args[0]) {
      await sock.sendMessage(jid, { text: `🎲 *GUESS THE NUMBER*\n\nI'm thinking of a number between 1-100.\nUse: .guess [number]` });
      return;
    }
    if (guess === secret) {
      await sock.sendMessage(jid, { text: `🎉 *CORRECT!* The number was *${secret}*! Amazing!` });
    } else if (guess < secret) {
      await sock.sendMessage(jid, { text: `📈 *Too low!* The number was *${secret}*. Try higher next time!` });
    } else {
      await sock.sendMessage(jid, { text: `📉 *Too high!* The number was *${secret}*. Try lower next time!` });
    }
  },
});

registerCommand({
  name: "trivia",
  category: "games",
  description: "Random trivia question",
  handler: async ({ sock, jid }) => {
    const q = pick(trivia);
    await sock.sendMessage(jid, { text: `❓ *TRIVIA*\n\n${q.q}\n\n_Think before you answer!_\n||Answer: ${q.a.toUpperCase()}||` });
  },
});

registerCommand({
  name: "chess",
  category: "games",
  description: "Chess board display",
  handler: async ({ sock, jid }) => {
    await sock.sendMessage(jid, {
      text: [
        `♟️ *CHESS*`,
        ``,
        `♜♞♝♛♚♝♞♜`,
        `♟♟♟♟♟♟♟♟`,
        `⬜⬛⬜⬛⬜⬛⬜⬛`,
        `⬛⬜⬛⬜⬛⬜⬛⬜`,
        `⬜⬛⬜⬛⬜⬛⬜⬛`,
        `⬛⬜⬛⬜⬛⬜⬛⬜`,
        `♙♙♙♙♙♙♙♙`,
        `♖♘♗♕♔♗♘♖`,
        ``,
        `_Full chess game coming soon!_`,
      ].join("\n"),
    });
  },
});

registerCommand({
  name: "memory",
  category: "games",
  description: "Memory card sequence game",
  handler: async ({ sock, jid }) => {
    const emojis = ["🍎","🍊","🍋","🍇","⭐","💎","🎯","🚀"];
    const sequence = Array.from({ length: 4 }, () => pick(emojis));
    await sock.sendMessage(jid, { text: `🃏 *MEMORY GAME*\n\nRemember this sequence:\n${sequence.join(" ")}\n\n_This message will serve as your challenge. Try to recall the order!_` });
  },
});

registerCommand({
  name: "wordgame",
  category: "games",
  description: "Unscramble the word",
  handler: async ({ sock, jid }) => {
    const words = ["VORTEX", "PYTHON", "CIPHER", "MATRIX", "PHANTOM", "SHADOW", "GITHUB", "BINARY", "SERVER", "BOTNET"];
    const word = pick(words);
    const scrambled = word.split("").sort(() => Math.random() - 0.5).join("");
    await sock.sendMessage(jid, { text: `🔤 *WORD SCRAMBLE*\n\nUnscramble this word:\n*${scrambled}*\n\n_Hint: ${word.length} letters, tech-related_\n||Answer: ${word}||` });
  },
});

registerCommand({
  name: "slot",
  category: "games",
  description: "Spin the slot machine",
  handler: async ({ sock, jid }) => {
    const symbols = ["🍎","🍊","🍋","🍇","⭐","💎","🔔","🎯"];
    const s = Array.from({ length: 3 }, () => pick(symbols));
    const jackpot = s.every(x => x === s[0]);
    const twoMatch = s[0] === s[1] || s[1] === s[2] || s[0] === s[2];
    await sock.sendMessage(jid, {
      text: [
        `🎰 *SLOT MACHINE*`,
        ``,
        `╔═══╦═══╦═══╗`,
        `║ ${s[0]} ║ ${s[1]} ║ ${s[2]} ║`,
        `╚═══╩═══╩═══╝`,
        ``,
        jackpot ? `🎉 *JACKPOT! You WIN big!* 🎉` : twoMatch ? `✨ *Two match! Small win!*` : `❌ *No match. Try again!*`,
      ].join("\n"),
    });
  },
});

registerCommand({
  name: "lottery",
  category: "games",
  description: "Generate lottery ticket numbers",
  handler: async ({ sock, jid }) => {
    const nums = Array.from({ length: 6 }, () => Math.floor(Math.random() * 49) + 1).sort((a, b) => a - b);
    const bonus = Math.floor(Math.random() * 10) + 1;
    await sock.sendMessage(jid, {
      text: [
        `🎱 *VORTEX LOTTERY*`,
        ``,
        `Your numbers: *${nums.join(" — ")}*`,
        `Bonus ball: *${bonus}*`,
        ``,
        `_Good luck! 🍀_`,
      ].join("\n"),
    });
  },
});
