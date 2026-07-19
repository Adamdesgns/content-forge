# Content Forge — Project Handoff

Paste this into a new chat to pick up where we left off. It's the map of everything: what the app is, where it lives, how to build/deploy it, and what's still pending.

---

## 1. What it is
**Content Forge** — a platform-first content workstation. You pick a social platform, choose a generator, add a brief/images, and it builds ready-to-use prompts **and** (with an OpenAI key) generates finished copy and images. Access is gated (invite password now, subscription licensing when configured).

- **Version:** 1.0.0-beta.1 · Tagline: **"Create once. Publish everywhere."** · In-app naming: campaigns (not projects), **Generate** (was AI Studio), **Launch** (was Publish Studio). UI copy only — internal code/data keys still say project/aiStudio/publishStudio.
- **Owner / GitHub:** `Adamdesgns`
- **One-line pitch:** turn one idea into a finished caption + image, on phone or desktop.

## 2. Where everything lives (source of truth = the GitHub repo)
| Thing | Link |
|---|---|
| **Repo (public)** | https://github.com/Adamdesgns/content-forge |
| Default branch | `main` |
| **Live web app (PWA)** | https://adamdesgns.github.io/content-forge/ (served from the `gh-pages` branch) |
| **Desktop installer** | https://github.com/Adamdesgns/content-forge/releases/tag/desktop-latest |
| — Installer | `Content.Forge.Setup.0.8.0.exe` |
| — Portable | `Content.Forge.0.8.0.exe` |
| **Artifact (private, claude.ai)** | https://claude.ai/code/artifact/b6504b09-d78f-4ff0-b5fe-7467b438a604 |

> Note: this project was developed in an ephemeral cloud sandbox. **The GitHub repo is the real source of truth** — clone it to continue.

## 3. Repo layout
```
src/index.html         ← THE APP. All HTML/CSS/JS inline. Edit this; everything else builds from it.
main.js                ← Electron main process (desktop window, menu, IPC, local data file)
preload.js             ← Electron IPC bridge (window.contentForge)
prompts/               ← 6 bundled prompt systems (.md) — Carousel Forge, Editorial OS, Neon Listicle, TikTok Reel, Article Image, Facebook Prompt Post
assets/icon.png        ← 512px app icon; assets/icons/ has 192/512/maskable/apple-touch
scripts/build-web.js   ← builds ./web (static PWA: shell + prompts + icons + manifest + service worker)
scripts/build-artifact.js ← builds ./artifact/content-forge.html (single self-contained file, prompts inlined)
.github/workflows/build-windows.yml ← GitHub Actions: builds the .exe, publishes to the desktop-latest release
.github/workflows/deploy-pages.yml  ← Pages deploy (see caveat #8)
package.json           ← productName "Content Forge", appId com.contentforge.app, build config
web/ , artifact/       ← generated build outputs (gitignored)
```

## 4. Features implemented
- **Generators** for X, Instagram, Threads, Facebook, TikTok, YouTube; 3-step wizard; prompt library; brand settings; per-platform adaptations + export presets.
- **AI Studio** (in each project): **Generate Text** (OpenAI `chat/completions`) and **Generate Image** (OpenAI `images/generations`). User pastes their **OpenAI key in Settings** (stored on-device only, never in exports). Model + image size are pickable in Settings. Generated text is saved on the project; images are session-only (to protect storage quota). Friendly error handling (401/429/400/403/offline).
- **Access gate** (full-screen lock on load):
  - **Password mode** (current default): username `AdamDesgns` (case-insensitive) / password `Password1` (temporary). Verified against a SHA-256 hash in the code (`CF_AUTH_HASH`), so plaintext isn't stored.
  - **Licensed mode** (Lemon Squeezy) — active once configured (see #6).
- **Account section** in Settings: subscription status, **Manage subscription** (customer portal), **Log out / deactivate device** (frees the LS activation slot, best-effort, then relocks).
- **Publish Studio** (in each project, below AI Studio): one post text box (auto-filled from AI Studio output, editable, saved on the project as `publishText`) + a card per network — **11 networks**: the app's 6 plus LinkedIn, Pinterest, Reddit, Bluesky, Snapchat. Each card live-adapts the text to that network's rules (char limit, hashtag caps — trailing `#tag` lines are detected; tags are dropped before the body is ever truncated, truncation is word-boundary), shows count/status, and offers **Copy** + **Open**. Open launches the real network's composer as a popup docked to the right of the screen; X/Threads/Bluesky/Reddit/LinkedIn arrive **pre-filled via URL intents**, the rest auto-copy first so it's one paste. Code: `PUBLISH_NETWORKS` registry + `adaptForNetwork` + `publishLaunch` in `src/index.html`.
- **Three distributions from one codebase:** desktop (.exe), installable PWA (web link), single-file artifact.

## 5. Access / credentials
- **Password gate (now):** `AdamDesgns` / `Password1` (temporary).
  - To change: compute `SHA-256("username_lowercased:password")` and replace `CF_AUTH_HASH` in `src/index.html`, then rebuild/redeploy.
- **OpenAI:** each user enters their own key in Settings → costs bill to *their* OpenAI account (app has ~$0 running cost).

## 6. Monetization — Lemon Squeezy subscription (BUILT, not yet configured)
Model: **3-day free trial → $9.99 recurring.** The licensing code is in `src/index.html` (`LICENSING` object + `lsActivate`/`lsValidate`/`lsCall` + `initLock`). It's **dormant** until configured; the app falls back to the password gate meanwhile.

**To go live, the owner must (only they can — needs identity + bank):**
1. Create a **Lemon Squeezy** account + store; complete verification + connect payout.
2. New **Subscription** product, price **$9.99**, **3-day free trial**, turn **ON License Keys** (set activation limit e.g. 3).
3. Send back: **Store ID** (required), **checkout link** (required, product → Share), **Product ID** (optional).

**Then fill these in `src/index.html` `LICENSING` and rebuild all three targets:**
```js
const LICENSING = {
  storeId: '__LS_STORE_ID__',        // ← required
  productId: '__LS_PRODUCT_ID__',    // ← optional (store-wide match if left as-is)
  checkoutUrl: '__LS_CHECKOUT_URL__',// ← required (Start free trial button)
  portalUrl: 'https://app.lemonsqueezy.com/my-orders',
  offlineGraceDays: 7,
  revalidateEveryHours: 12
};
```
Behavior once configured: user pastes license key → app calls LS `activate` (stores instance) → `validate` on launch + on a schedule → locks when subscription lapses; 7-day offline grace. License endpoints need only the user's key (no secret in app). Only `!window.__ARTIFACT__` builds use licensed mode (the artifact stays a free demo/password).

## 7. How to build & deploy (the update loop)
1. Edit **`src/index.html`** (source of truth).
2. `npm install` then `npm start` to run desktop locally; `npm run build:web` and `npm run build:artifact` to generate outputs.
3. Commit + push to `main`.
4. **Redeploy the web app:** copy `web/` into a fresh `gh-pages` worktree and force-push to the `gh-pages` branch (Pages serves that branch). *(Done manually because the GitHub App can't enable Pages via API — see #8.)*
5. **Rebuild the .exe:** trigger the **build-windows.yml** workflow (workflow_dispatch or push a `v*` tag). It compiles on `windows-latest` and republishes both .exe files to the `desktop-latest` release (it deletes+recreates the release so only current-named files remain).
6. **Republish the artifact:** re-run the Artifact tool on `artifact/content-forge.html` (keeps the same URL).

## 7a. GitHub push access (there is no shared credential)
Push access is **not** a token stored in this repo or handoff — for security it never should be. You get write access one of these ways:
- **Another Claude Code session:** tell it to *add the repo `Adamdesgns/content-forge`* — the session grants its own push access automatically; no token needed.
- **Your own machine:** authenticate as yourself — `gh auth login` (GitHub CLI), **or** create a fine-grained Personal Access Token (GitHub → Settings → Developer settings → Personal access tokens → give it `content-forge` **Contents: Read/write**) and use it as the git password, **or** add an SSH key.

Never paste a GitHub token or password into a chat or commit it to the repo.

## 8. Known constraints / gotchas
- The **GitHub App integration cannot create repos or enable Pages** (403 "Resource not accessible by integration"). Pages was enabled once by the owner; deploys happen via manual `gh-pages` branch pushes, not the Actions Pages job.
- **Free-plan GitHub Pages requires a public repo.** Making the repo private kills the web link and gates release downloads — decision deferred.
- The dev **sandbox blocks outbound to OpenAI and `github.io`**, and blocks the Electron binary download. So: AI generation and licensing were verified with **mocked APIs + headless Chromium**, not live calls; the **.exe is built by GitHub Actions**, not locally.
- The access gate is **client-side** (public code) — good for keeping the public out, not unbreakable. Compiled `.exe` + (optionally) private repo hardens it.

## 9. Open ideas / next steps (not built)
- **Buffer auto-posting (SPEC'D, owner-approved — next major feature).** See §9a.
- Fill in Lemon Squeezy config and go live (see #6). *(Store is wired; testing in progress.)*
- **Generate-all-platform-adaptations** button in AI Studio.
- Stronger/rotated password, or move fully to licensed mode.
- Decide public vs private repo for anti-piracy.
- Code-signing for the Windows .exe (SignPath free-OSS / Azure Trusted Signing ~$10/mo / Certum ~$70/yr) — owner to pick.
- Web paywall decision: keep web as free demo vs. licensing proxy.
- Landing page (marketing copy exists in MARKETING.md).

## 9a. Buffer auto-posting — integration spec (approved model: hybrid)
**Owner's decision:** hybrid of bring-your-own Buffer + today's composer flow, auto-detected — *"if they don't have Buffer it won't matter."* No forced dependency.

**How it works**
1. **Settings → new "Auto-posting (Buffer)" section**, styled like the OpenAI section: paste your **Buffer API key** (every Buffer customer gets one free — free plan = 1 key, paid = up to 5). Key stored on-device only, never in exports (same rule as `openaiKey`; extend `DEFAULT_SETTINGS`, NOT exportable state).
2. On save, validate the key against Buffer's GraphQL API (`https://api.buffer.com`, `Authorization: Bearer <key>`) and fetch the account's **connected channels** (Buffer supports: Instagram, Facebook, LinkedIn, TikTok, X, Threads, Bluesky, Pinterest, YouTube, Google Business, Mastodon — superset overlap with our 11 networks).
3. **Launch section becomes mode-aware per card:**
   - Channel matched in the user's Buffer → card shows **"Queue"** (and a "Queue all" master button appears): sends the *already-adapted* per-network text (+ generated image, uploaded as media) as a Buffer draft/queued post using Buffer's create-post mutation with channel-specific metadata (threads on X/Bluesky/Threads, first comment on IG/LinkedIn/FB, Pinterest board, etc.).
   - No Buffer key, or network not connected in their Buffer → card behaves exactly as today (**Copy + Open composer**). Zero regression.
4. Per-post results surface on each card (queued ✓ / error with Buffer's message). A "View in Buffer" link opens their Buffer queue.

**Constraints / notes**
- **Desktop-first** (same as licensing): `api.buffer.com` from the web/PWA may be CORS-blocked — verify before enabling in the web build; gate with `CF_IS_DESKTOP` if needed.
- **Marketing copy must change when this ships:** MARKETING.md §6 currently (correctly) forbids claiming auto-posting. New claim once live: "Connect your Buffer account and Content Forge queues every adapted post automatically — or keep one-tap composer mode, no Buffer required."
- **Cost:** $0 to us — the user's Buffer plan covers API usage (per-channel pricing is theirs). Keeps the bring-your-own-key privacy story.
- **Later evolution:** Buffer also ships an official **MCP server** — relevant only when we build the agent-driven "Idea Engine" (an agent that decides and posts autonomously). The in-app Launch button should call the API directly, not embed an MCP client.
- Estimated scope: a few focused days (Settings UI + GraphQL client + channel mapping + media upload + per-card states + error handling). Build AFTER the current fix batch is verified.

## 10. Commit trail (high level, newest last)
v0.8 base → 4 review bug fixes → real PNG icon → installable PWA → single-file artifact → AI Studio (OpenAI text+image) → Pages + Windows build workflows → **rebrand to Content Forge** (dropped Lucedale/Anvil/macOS wording) → invite password gate → Lemon Squeezy subscription licensing → store-only match → Account (manage subscription + log out).

Latest `main` commit at handoff: **`4f69104`** (Account section).
