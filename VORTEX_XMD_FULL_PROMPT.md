# VORTEX XMD — Full Build Prompt (A–Z)

## PROJECT OVERVIEW

Build **VORTEX XMD** — a production-ready, multi-user WhatsApp bot pairing system with a cyberpunk-themed web dashboard.

- **Owner:** LORD RAY
- **Developer:** GHOST
- **GitHub:** https://github.com/vortexxmd123/VORTEX-XMD-.git
- **Stack:** React + Vite (frontend), Express 5 (API), PostgreSQL + Drizzle ORM (DB), Baileys (WhatsApp), JWT (admin auth), TypeScript throughout.

---

## STACK & ARCHITECTURE

### Monorepo Structure (pnpm workspaces)
```
workspace/
├── artifacts/
│   ├── api-server/          # Express 5 API + Baileys WhatsApp engine
│   └── vortex-xmd/          # React + Vite cyberpunk frontend
├── lib/
│   ├── db/                  # Drizzle ORM schema + migrations
│   └── api-spec/            # OpenAPI spec + Orval codegen (hooks + Zod)
└── pnpm-workspace.yaml
```

### Key packages
- `pnpm` workspaces, Node.js 24, TypeScript 5.9
- API: Express 5, Baileys (WhatsApp), JWT, bcrypt, pino logger
- DB: PostgreSQL, Drizzle ORM, drizzle-zod
- Frontend: React 18, Vite, TanStack Query, Orval codegen
- Validation: Zod (`zod/v4`), drizzle-zod

---

## DATABASE SCHEMA (lib/db)

Seven tables in PostgreSQL using Drizzle ORM:

```typescript
// sessions — one row per WhatsApp session/phone pair
sessions: { id, phoneNumber, status, sessionData, createdAt, updatedAt }

// settings — key/value store for bot configuration
settings: { key, value }   // unique key constraint

// commandLogs — log every command execution
commandLogs: { id, sessionId, command, args, sender, jid, success, error, createdAt }

// commands — registry of all registered commands
commands: { id, name, category, description, usage, enabled, ownerOnly, adminOnly, groupOnly }

// broadcasts — broadcast message queue
broadcasts: { id, message, status, sentCount, totalCount, createdAt }

// adminUsers — admin panel users
adminUsers: { id, username, passwordHash, role, createdAt }

// securityLogs — security event log
securityLogs: { id, event, details, ip, createdAt }
```

### Seed data
- Settings: `bot_name=VORTEX XMD`, `prefix=.`, `owner_name=LORD RAY`, `developer_name=GHOST`, `owner_contact=22879492633`, `mode=public`
- Admin user: username `lordray`, password `vortex2024` (bcrypt hashed)

---

## API SERVER (artifacts/api-server)

### Entry point: `src/index.ts`
- Express 5 app with pino-http logging
- CORS enabled for all origins
- JSON body parser
- Routes mounted at their full base paths (proxy handles routing)
- Baileys WhatsApp connection manager

### Auth: `src/lib/auth.ts`
- JWT tokens, 24h expiry
- `SECRET` from `SESSION_SECRET` env var
- `verifyAdmin` middleware checks `Authorization: Bearer <token>`

### Settings cache: `src/lib/settingsCache.ts`
- In-memory cache with 30s TTL
- `getSettings()` → `Record<string, string>`
- `invalidateSettingsCache()` — called after any settings write

### Command loader: `src/lib/commandLoader.ts`
- `registerCommand({ name, aliases?, category, description, usage?, ownerOnly?, adminOnly?, groupOnly?, handler })` 
- Handler receives: `{ sock, jid, sender, args, msg, settings }`
- All plugins auto-imported at startup
- Commands stored in DB on first load

### WhatsApp engine: `src/lib/whatsappManager.ts`
- Multi-session support using Baileys
- Pairing code flow (no QR required)
- Session state persisted to `sessions/` directory
- Message handler dispatches to command system

---

## API ROUTES

### Public routes
```
POST /api/auth/login          — Admin login → JWT token
GET  /api/health              — Health check
```

### Session routes (no auth needed for pairing)
```
POST /api/sessions/pair       — Start pairing, returns pairing code
GET  /api/sessions            — List all sessions
GET  /api/sessions/:id        — Get session by ID
DELETE /api/sessions/:id      — Disconnect session
POST /api/sessions/:id/reconnect — Reconnect session
```

### Admin routes (JWT required)
```
GET  /api/admin/stats         — Dashboard stats
GET  /api/admin/settings      — All settings
POST /api/admin/settings      — Upsert setting {key, value}
GET  /api/admin/commands      — All commands
POST /api/admin/commands/:name/toggle — Enable/disable command
GET  /api/admin/logs          — Command logs
POST /api/admin/broadcast     — Send broadcast
GET  /api/admin/security-logs — Security log entries
```

---

## COMMAND PLUGIN SYSTEM

All plugins in `artifacts/api-server/src/plugins/`. Each file calls `registerCommand()` for every command.

### Plugin files (15 total)

#### `general.ts` — General & Menu commands
Commands: `menu`, `xmenu`, `gcmenu`, `downloadmenu`, `funmenu`, `ownermenu`, `help`, `alive`, `uptime`, `runtime`, `time`, `speed`, `version`, `about`, `system`, `stats`, `owner`, `support`, `wagroup`, `wachannel`, `repo`, `payment`, `teledev`, `telechannel`, `telegroup`, `info`, `ping`, `restart`

**Menu format** (exact):
```
╭━━━━━━━━━━━━━━━━━━━━╮
┃ 🤖 VORTEX BOT MENU
┃ 👤 User: {username}
┃ ⚡ Prefix: {prefix}
┃ ⏱️ Uptime: {uptime}
╰━━━━━━━━━━━━━━━━━━━━╯

━━━━━━━━━━━━━━━━━━━━
📌 GENERAL MENU
━━━━━━━━━━━━━━━━━━━━
{prefix}menu ... (all commands listed)

[all 13 category sections]

╭━━━━━━━━━━━━━━━━━━━━╮
┃ Type {prefix}help [command]
┃ for command usage.
╰━━━━━━━━━━━━━━━━━━━━╯

«Powered by VORTEX XMD ✨»
```

#### `fun.ts` — Fun commands
Commands: `joke`, `quote`, `fact`, `8ball`, `coinflip`, `dice`, `rps`, `ship`, `truth`, `dare`, `roast`, `pickup`, `simprate`, `love`, `couple`, `character`

#### `group.ts` — Group management commands
Commands: `kick`, `add`, `promote`, `demote`, `mute`, `unmute`, `link`, `revoke`, `groupinfo`, `everyone`, `tagall`, `hidetag`, `warn`, `unwarn`, `warnings`, `setname`, `setdesc`, `leave`, `antilink`, `antibadword`, `welcome`, `goodbye`
- Warn system: auto-kick at 3 warnings
- State tracking: antilink, antibadword, welcome, goodbye per-group Sets

#### `owner.ts` — Owner-only commands
Commands: `block`, `unblock`, `setprefix`, `broadcast`, `listgroups`, `setbotname`, `setowner`, `setfooter`, `eval`, `enablecmd`, `disablecmd`, `shutdown`, `update`, `logs`, `backup`, `setbotprofile`, `clearsessions`, `private`, `public`
- `private` mode: stores `mode=private` in settings, only owner can use commands
- `public` mode: stores `mode=public`, everyone can use commands

#### `security.ts` — Security commands
Commands: `ban`, `unban`, `blacklist`, `whitelist`, `lock`, `unlock`, `antispam`, `antibot`, `sessioninfo`, `security`
- All backed by in-memory Sets with real state

#### `economy.ts` — Economy/coin commands
Commands: `balance`, `daily`, `work`, `rob`, `deposit`, `withdraw`, `shop`, `buy`, `sell`, `inventory`, `leaderboard`

#### `games.ts` — Game commands
Commands: `tictactoe`, `hangman`, `math`, `guess`, `trivia`, `chess`, `memory`, `wordgame`, `slot`, `lottery`

#### `anime.ts` — Anime commands
Commands: `waifu`, `neko`, `animequote`, `animewallpaper`, `manga`, `character`, `cosplay`, `animesearch`
- Uses nekos.life API for images, Jikan API for anime/manga search, animechan.io for quotes

#### `ai.ts` — AI commands
Commands: `ai`, `gpt`, `chat`, `ask`, `imagine`, `weather`, `wiki`, `translate`, `define`, `news`, `summarize`, `explain`, `code`, `fixcode`, `review`
- Uses OpenAI API (set `openai_api_key` in settings)
- Uses OpenWeatherMap (set `weather_api_key` in settings)
- Wikipedia API for wiki (no key needed)
- Dictionary API for define (no key needed)

#### `search.ts` — Search commands
Commands: `google`, `youtube`, `github`, `npm`, `pinterest`, `image`, `movie`, `song`, `lyrics`, `wallpaper`, `anime`, `manga`
- GitHub API for repo search (no key needed)
- NPM registry API for package search
- OMDb API for movies (uses free key)
- Lyrics.ovh for lyrics
- Jikan API for anime/manga

#### `media.ts` — Media commands
Commands: `sticker`, `take`, `toimg`, `tovid`, `tomp3`, `gif`, `attp`, `emix`, `photo`, `enhance`, `blur`, `crop`, `removebg`, `vv`, `vv2`

#### `downloader.ts` — Downloader commands
Commands: `yt`, `ytmp3`, `ytmp4`, `tiktok`, `ig`, `fb`, `twitter`, `spotify`, `soundcloud`, `mediafire`, `github`, `apk`, `play`, `play2`

#### `converter.ts` — Converter commands
Commands: `tourl`, `toimg`, `tomp3`, `tovn`, `toptt`, `todoc`, `topdf`, `totext`

#### `tools.ts` — Tools commands
Commands: `encode`, `decode`, `hash`, `uuid`, `timestamp`, `iplookup`, `whois`, `dns`, `pinghost`, `portscan`
- ip-api.com for IP lookup (no key needed)
- DNS over HTTPS (Google) for DNS lookup
- Real hash using Node.js crypto module

#### `utility.ts` — Utility commands
Commands: `base64`, `reverse`, `calc`, `wordcount`, `upper`, `lower`, `repeat`, `password`, `toascii`, `fancy`, `id`, `qr`, `readqr`, `shorten`, `length`, `color`, `random`, `uuid`, `timestamp`

---

## FRONTEND (artifacts/vortex-xmd)

### Design system
- **Theme:** Cyberpunk/neon — dark background (#0a0a0f), neon cyan (#00f5ff), neon purple (#7c3aed), neon green (#00ff41)
- **Font:** Orbitron (headings), Inter (body)
- **Style:** Glass-morphism cards, glowing borders, matrix-rain effects, scan lines

### Pages (13 total)

#### Public pages (no auth)
| Route | Page | Description |
|-------|------|-------------|
| `/` | `Dashboard` | Bot status, stats overview, live connection status |
| `/pair` | `Pair` | Phone number input → pairing code → QR display flow |
| `/sessions` | `Sessions` | List all active WhatsApp sessions |
| `/logs` | `Logs` | Command execution log viewer |
| `/status` | `Status` | Bot health and uptime status |

#### Admin pages (JWT protected)
| Route | Page | Description |
|-------|------|-------------|
| `/admin` | `AdminLogin` | Login form with JWT auth |
| `/admin/dashboard` | `Admin` | Admin dashboard with stats |
| `/admin/settings` | `AdminSettings` | Bot settings editor (prefix, names, API keys) |
| `/admin/commands` | `AdminCommands` | Enable/disable individual commands |
| `/admin/sessions` | `AdminSessions` | Full session management with disconnect/reconnect |
| `/admin/broadcast` | `AdminBroadcast` | Send message to all groups |
| `/admin/logs` | `AdminLogs` | Full command log history |
| `/admin/security` | `AdminSecurity` | Security events and ban management |

### Auth flow
- `localStorage` key: `vortex_admin_token`
- Set via `setAuthTokenGetter` in `main.tsx`
- All admin API hooks auto-inject the token via Axios interceptor

### API codegen
- OpenAPI spec: `lib/api-spec/openapi.yaml`
- Run `pnpm --filter @workspace/api-spec run codegen` to regenerate
- Generates: React Query hooks + Zod schemas
- Mutations use `{ data: body }` wrapper (Orval generated)

---

## ENVIRONMENT VARIABLES & SECRETS

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `SESSION_SECRET` | JWT signing secret | ✅ |
| `GITHUB_PERSONAL_ACCESS_TOKEN` | For GitHub push | Optional |

### Bot settings (stored in DB `settings` table)
| Key | Default | Description |
|-----|---------|-------------|
| `bot_name` | VORTEX XMD | Bot display name |
| `prefix` | `.` | Command prefix |
| `owner_name` | LORD RAY | Owner name |
| `developer_name` | GHOST | Developer name |
| `owner_contact` | 22879492633 | Owner WhatsApp number |
| `owner_number` | 22879492633 | Owner number for ownerOnly commands |
| `mode` | public | `public` or `private` |
| `menu_footer` | Powered by VORTEX XMD | Footer text on menus |
| `openai_api_key` | (unset) | OpenAI API key for AI commands |
| `weather_api_key` | (unset) | OpenWeatherMap key for weather command |

---

## ADMIN CREDENTIALS

| Field | Value |
|-------|-------|
| Username | `lordray` |
| Password | `vortex2024` |

---

## EXTERNAL APIs USED (no key required)

| API | Used by | Command(s) |
|-----|---------|------------|
| nekos.life | anime.ts | waifu, neko, animewallpaper, cosplay |
| Jikan (MyAnimeList) | anime.ts, search.ts | animesearch, anime, manga |
| animechan.io | anime.ts | animequote |
| Wikipedia REST | ai.ts | wiki |
| Dictionary API | ai.ts | define |
| ip-api.com | tools.ts | iplookup |
| DNS over HTTPS (Google) | tools.ts | dns |
| NPM Registry | search.ts | npm |
| GitHub REST API | search.ts | github |
| Lyrics.ovh | search.ts | lyrics |
| OMDb API (free key) | search.ts | movie |

---

## RUNNING THE PROJECT

```bash
# Install dependencies
pnpm install

# Push DB schema
pnpm --filter @workspace/db run push

# Run API server (port 8080)
pnpm --filter @workspace/api-server run dev

# Run frontend (reads PORT env from workflow)
pnpm --filter @workspace/vortex-xmd run dev

# Typecheck all
pnpm run typecheck

# Regenerate API hooks from OpenAPI spec
pnpm --filter @workspace/api-spec run codegen
```

---

## GITHUB REPOSITORY

**URL:** https://github.com/vortexxmd123/VORTEX-XMD-.git

**Push command:**
```bash
git remote add github https://YOUR_PAT@github.com/vortexxmd123/VORTEX-XMD-.git
git push github main
```

---

## COMPLETE COMMAND LIST (150+ commands)

### 📌 General (28)
`menu` `xmenu` `gcmenu` `downloadmenu` `funmenu` `ownermenu` `support` `wachannel` `wagroup` `owner` `repo` `payment` `teledev` `telechannel` `telegroup` `info` `ping` `alive` `runtime` `time` `speed` `help` `about` `system` `version` `stats` `uptime` `restart`

### 🎉 Fun (16)
`joke` `quote` `fact` `8ball` `coinflip` `dice` `rps` `ship` `truth` `dare` `roast` `pickup` `simprate` `love` `couple` `character`

### 👥 Group (22)
`kick` `add` `promote` `demote` `mute` `unmute` `link` `revoke` `groupinfo` `everyone` `hidetag` `warn` `unwarn` `warnings` `setname` `setdesc` `leave` `tagall` `antilink` `antibadword` `welcome` `goodbye`

### 👑 Owner (18)
`block` `unblock` `setprefix` `broadcast` `listgroups` `setbotname` `setowner` `setfooter` `enablecmd` `disablecmd` `shutdown` `update` `logs` `backup` `setbotprofile` `private` `public` `clearsessions`

### 🧰 Utility (19)
`base64` `reverse` `calc` `wordcount` `upper` `lower` `repeat` `password` `toascii` `fancy` `id` `qr` `readqr` `shorten` `length` `color` `random` `uuid` `timestamp`

### ⬇️ Downloader (14)
`yt` `ytmp3` `ytmp4` `tiktok` `ig` `fb` `twitter` `spotify` `soundcloud` `mediafire` `github` `apk` `play` `play2`

### 🧠 AI (15)
`ai` `gpt` `chat` `imagine` `weather` `wiki` `translate` `define` `news` `summarize` `explain` `code` `fixcode` `review` `ask`

### 🎬 Media (15)
`sticker` `take` `toimg` `tovid` `tomp3` `gif` `attp` `emix` `photo` `enhance` `blur` `crop` `removebg` `vv` `vv2`

### 🔎 Search (12)
`google` `youtube` `github` `npm` `pinterest` `image` `movie` `song` `lyrics` `wallpaper` `anime` `manga`

### 🔄 Converter (8)
`tourl` `toimg` `tomp3` `tovn` `toptt` `todoc` `topdf` `totext`

### 🛡️ Security (10)
`ban` `unban` `blacklist` `whitelist` `lock` `unlock` `antispam` `antibot` `sessioninfo` `security`

### 💰 Economy (11)
`balance` `daily` `work` `rob` `deposit` `withdraw` `shop` `buy` `sell` `inventory` `leaderboard`

### 🎮 Games (10)
`tictactoe` `hangman` `math` `guess` `trivia` `chess` `memory` `wordgame` `slot` `lottery`

### 🌸 Anime (8)
`waifu` `neko` `animequote` `animewallpaper` `manga` `character` `cosplay` `animesearch`

### 🛠️ Tools (10)
`encode` `decode` `hash` `uuid` `timestamp` `iplookup` `whois` `dns` `pinghost` `portscan`

**Total: 196 commands across 15 categories**

---

## SUPPORT LINKS

- **WhatsApp Group:** https://chat.whatsapp.com/C6OnEkjVKaH2g7hsNbjIhd
- **WhatsApp Channel:** https://whatsapp.com/channel/0029VbDHkrrFSAsxToE5Fw3o
- **Telegram Dev:** t.me/GHOST
- **Telegram Channel:** t.me/VORTEXMD
- **Telegram Group:** t.me/VORTEXMD_GROUP

---

*VORTEX XMD — Built by GHOST for LORD RAY. Powered by Baileys, Express 5, PostgreSQL, and React.*
