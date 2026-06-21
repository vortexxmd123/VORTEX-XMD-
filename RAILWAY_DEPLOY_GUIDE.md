# 🚂 VORTEX XMD — Railway Deployment Guide

> Host your WhatsApp bot 24/7 on Railway for free (within the $5/month free tier).

---

## ✅ Prerequisites

- GitHub account with the VORTEX XMD repo pushed ✅
- Railway account (free at https://railway.app)
- Your WhatsApp number for pairing

---

## STEP 1 — Create a Railway Account

1. Go to **https://railway.app**
2. Click **"Start a New Project"**
3. Sign up with **GitHub** (this auto-links your repos)
4. Verify your account (Railway requires phone verification for the free tier)

---

## STEP 2 — Create a New Project

1. On your Railway dashboard, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Find and select **`vortexxmd123/VORTEX-XMD-`**
4. Railway will detect the `railway.toml` config automatically ✅

---

## STEP 3 — Add a PostgreSQL Database

Your bot needs a database. Railway provides one free:

1. In your project, click **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway creates the database and automatically sets `DATABASE_URL` in your service's environment ✅
3. No extra configuration needed — it connects automatically

---

## STEP 4 — Set Environment Variables

In your Railway service, click **"Variables"** tab and add these:

| Variable | Value | Notes |
|----------|-------|-------|
| `SESSION_SECRET` | any long random string | e.g. `vortex_secret_lordray_2024_xmd` |
| `NODE_ENV` | `production` | tells the app it's in production |

> **`DATABASE_URL` and `PORT` are set automatically by Railway — do NOT add them manually.**

**How to add variables:**
1. Click your service → **"Variables"** tab
2. Click **"New Variable"**
3. Enter the name and value
4. Click **"Add"**
5. Railway redeploys automatically after saving

---

## STEP 5 — Add a Persistent Volume (for WhatsApp Sessions)

This is critical — without this, your bot loses its WhatsApp login every time it restarts.

1. Click your service → **"Settings"** tab
2. Scroll to **"Volumes"**
3. Click **"New Volume"**
4. Set:
   - **Mount Path:** `/app/sessions`
   - **Size:** 1 GB (free)
5. Click **"Create Volume"**

> This keeps your WhatsApp session files even when Railway restarts the service.

---

## STEP 6 — Deploy

1. Railway will start building automatically after you connect the repo
2. Watch the **"Build Logs"** — it runs:
   ```
   pnpm install
   pnpm build (frontend + API)
   ```
3. Watch the **"Deploy Logs"** — you should see:
   ```
   Server listening on port XXXX
   Default settings seeded
   Loaded 203 commands
   All plugins loaded
   ```
4. If it shows **"Active"** with a green dot → ✅ Bot is live!

---

## STEP 7 — Get Your Public URL

1. Click your service → **"Settings"** tab
2. Under **"Networking"** → click **"Generate Domain"**
3. You'll get a URL like: `https://vortex-xmd-production.up.railway.app`
4. Open that URL in your browser — you'll see the VORTEX XMD dashboard ✅

---

## STEP 8 — Pair Your WhatsApp

1. Open your Railway URL in browser
2. Click **"Pair Device"** in the sidebar
3. Enter your WhatsApp phone number (with country code, no `+`)
   - Example: `2348123046227` for a Nigerian number
4. You'll get a **8-character pairing code** like: `ABCD-1234`
5. On your phone: WhatsApp → **Settings** → **Linked Devices** → **Link a Device**
6. When it asks to scan QR, tap **"Link with phone number instead"**
7. Enter the pairing code
8. Done! ✅ Your bot is now connected and always online

---

## STEP 9 — Configure Your Bot

Open `https://your-railway-url/admin` in your browser:

- **Username:** `lordray`
- **Password:** `vortex2024`

From the admin panel you can:
- Change bot name, prefix, owner name
- Enable/disable individual commands
- Set your OpenAI API key (for AI commands)
- Set your weather API key
- View live logs
- Send broadcasts

---

## 💰 Railway Pricing

| Plan | Cost | What you get |
|------|------|-------------|
| Free | $0 | $5/month credit (usually enough for a bot) |
| Hobby | $5/month | More resources + no credit expiry |

> A single bot service + PostgreSQL typically uses ~$2-3/month of the free credit.

---

## 🔧 Troubleshooting

### Bot crashes on startup
- Check **"Deploy Logs"** in Railway
- Most common: missing `SESSION_SECRET` variable → add it in Variables tab

### Database connection fails
- Make sure PostgreSQL service is in the **same Railway project**
- `DATABASE_URL` should be set automatically — check Variables tab

### WhatsApp session disconnects
- Make sure the **Volume is mounted** at `/app/sessions`
- Without the volume, sessions are lost on every restart

### Build fails
- Check **"Build Logs"**
- Try clicking **"Redeploy"** → sometimes it's a network timeout
- Make sure your GitHub repo has `railway.toml` in the root

### Bot pairs but commands don't work
- Check that your prefix is `.` (dot) — use `.menu` to test
- If you set a custom prefix, use that prefix instead

---

## 🔄 Updating Your Bot

When you want to push new code:

```bash
# In Replit, all saves auto-commit
# Then push to GitHub:
git push github main
```

Railway **auto-deploys** every time you push to the `main` branch. No manual steps needed.

---

## 📱 Your Bot Info

| Item | Value |
|------|-------|
| GitHub Repo | https://github.com/vortexxmd123/VORTEX-XMD- |
| Admin Login | lordray / vortex2024 |
| Default Prefix | `.` (dot) |
| Owner | LORD RAY |
| Developer | GHOST |
| Total Commands | 196 |

---

*VORTEX XMD — Always online with Railway 🚂*
