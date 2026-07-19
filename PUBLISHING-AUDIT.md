# Content Forge — Publishing Upgrade: Repository Audit (Phase 0)

Prepared in response to the "Connected Accounts, Scheduling, and Auto-Publishing" engineering handoff.
This is the audit + architecture recommendation only. **No backend, provider, hosting, or cost commitment has been made** — those are gated on Adam's approval (handoff §19).

---

## A. Verified current architecture (traced from code, not inferred)

| Question (handoff §5) | Finding |
|---|---|
| Framework / build | Plain HTML/CSS/JS. **No framework.** Electron desktop shell (`main.js`, `preload.js`) + electron-builder. PWA built by `scripts/build-web.js`. Single-file artifact by `scripts/build-artifact.js`. |
| Static / PWA / Electron? | **All three from one source** (`src/index.html`): Windows `.exe`, installable PWA on GitHub Pages, claude.ai artifact demo. |
| Data storage | **Local only.** Web: `localStorage` (`contentForgeSettings`, project state). Desktop: JSON file `content-forge-data.json` in Electron `userData` (`main.js` read/write/export/import). No database. |
| OpenAI key flow | User pastes key in Settings → stored in `localStorage` (`contentForgeSettings`), **deliberately excluded from exports**. Requests go **browser → api.openai.com directly** (`openaiFetch`). |
| Supported networks | **11, confirmed** in `PUBLISH_NETWORKS` (src/index.html:3060): Instagram, TikTok, YouTube, X, Facebook, LinkedIn, Threads, Pinterest, Reddit, Bluesky, Snapchat. |
| Platform rules location | `PUBLISH_NETWORKS` (char/tag/title limits + composer URL + optional URL intent) and `EXPORT_PRESETS` (image sizes/ratios, src/index.html:1722). `adaptForNetwork()` does char/hashtag adaptation; `splitTrailingTags`/`truncateAtWord` handle trimming. |
| Composer implementation | `publishLaunch(key)` (src/index.html:3109): copies adapted text, then opens the network's `intent` URL (X/Threads/Bluesky/Reddit/LinkedIn pre-fill) or plain `composer` URL as a docked popup. **This is the universal fallback the handoff wants preserved.** |
| Scheduling / queue / drafts | **None exists.** No calendar, queue, draft, or job code. |
| Auth / user accounts | **None (no server identity).** Access gate is client-side: SHA-256 password hash (`CF_AUTH_HASH`) OR Lemon Squeezy license activation called **client-side** from the desktop build. There is no user record, no ownership boundary. |
| Backend / serverless / DB / env | **None.** No `server/`, no `functions/`, no Supabase/Express/serverless, no env-var usage. Two GitHub Actions: `build-windows.yml`, `deploy-pages.yml`. Hosting = GitHub Pages (static) + GitHub Releases (.exe). |
| Media pipeline | AI images via `images/generations` (gpt-image-1), **session-only** (base64 in memory, never persisted — to protect storage quota). `EXPORT_PRESETS` defines per-platform target sizes; `nearestImageSize()` maps platform → nearest gpt-image-1 shape. No video. No server media upload. |
| Existing security concerns | (1) Access gate is client-side/public-code — keeps casual users out, not unbreakable. (2) Lemon Squeezy validation is client-side (fine — key-only, no secret). (3) **No secret is currently server-held because there is no server** — which is exactly why auto-publishing can't be bolted on client-side. |

### What works now
One brief → finished captions + AI image → per-network adaptation → composer-open handoff. Licensing (desktop), password gate, local persistence, three distributions.

### What's incomplete / missing for auto-publishing
No backend, no auth/ownership, no token storage, no scheduler/queue, no publish-status model, no OAuth anywhere, no video.

### What can be reused (do not rebuild — handoff §1)
`PUBLISH_NETWORKS` + `adaptForNetwork` (rule engine), `EXPORT_PRESETS`, the generation flow, the Launch UI, and `publishLaunch` (keep as the composer fallback). The publishing layer should sit **beside** these, adding an API-capability validation layer as handoff §9 specifies — not replacing them.

---

## B. The blocker (handoff §4 confirmed)

Auto-publishing needs to hold OAuth secrets + social access/refresh tokens, refresh tokens while the browser/app is closed, run scheduled jobs while the user is offline, upload media server-to-server, verify webhooks, and keep an audit trail. **None of that is safe in client JS / localStorage / a GitHub Pages build.** So auto-publishing requires *either* a secure backend *or* a publishing provider that holds those tokens for us.

---

## C. Architecture recommendation

The handoff recommends **Route C (hybrid: provider MVP + direct adapters later)**, and the audit agrees — with one sharpening the generic doc couldn't know:

### Buffer now collapses most of the §4 backend burden
Buffer shipped a **public GraphQL API** (single endpoint, Bearer token, included on every plan — free = 1 key, paid = up to 5) **and** an official **MCP server**, covering the **same 11 networks** Content Forge targets. Critically, **Buffer holds the social OAuth tokens, runs the scheduler, and publishes while the user is offline, with its own retries.** That offloads token storage, refresh, scheduling, offline execution, and per-network OAuth — the hardest and most dangerous parts of §4.

**Implication:** with a **bring-your-own-Buffer-token** model (stored on-device exactly like the OpenAI key), the **desktop MVP may need no custom backend at all** — Content Forge just calls Buffer's API to create/schedule posts and reads back per-destination status. A custom backend becomes necessary only for (a) the **web/PWA** build (CORS + not exposing tokens in a browser) and (b) later **direct** integrations (Route A) for strategic networks.

### Recommended shape
1. **Adapter boundary** exactly as handoff §7 (`PublishingAdapter` interface), so nothing is hardwired to Buffer.
2. **First adapter = Buffer**, bring-your-own token, **desktop-first** (matches the licensing/CORS constraint already documented). Keeps Adam's cost at ~$0.
3. **Keep `publishLaunch` composer fallback** for every network/post-type Buffer can't do (e.g. some video, Stories).
4. **Direct adapters (Route A) later** for Adam's highest-priority networks, behind the same interface.
5. **Web/PWA auto-publish + any Adam-hosted model** ⇒ needs a real backend (Supabase / Cloudflare Workers / similar) and a user-identity/ownership system — that is the part that introduces **recurring cost + a hosting change** and must not be started without approval.

---

## D. Decisions that require Adam's approval (handoff §19) — nothing built until these are set

1. **Provider vs direct first.** Recommendation: start with **Buffer** (fast, 11 networks, offloads the scheduler). Confirm before integrating a third party.
2. **Who pays.** Recommendation: **bring-your-own Buffer** (user pays their own Buffer plan; $0 to Adam; on-device token) vs. **Adam-hosted** (Ayrshare/Buffer-org; Adam pays per profile — recurring cost).
3. **Backend + hosting.** Desktop-only BYO-Buffer ⇒ **no new backend**. Web auto-publish or Adam-hosted ⇒ **backend + auth + DB** (recurring cost + hosting change).

## E. Suggested immediate next step (safe, no cost)
Build the **provider-neutral adapter interface + a mock adapter + the Connected Accounts / Review-destination UI shells**, wired to the *existing* composer fallback. This is pure client work, commits Adam to nothing, is fully testable, and makes the real Buffer adapter a drop-in once decisions 1–3 are made. (Handoff §10 Phase 0/1 with a mock adapter.)

## F. Feasibility matrix — DELIVERED
See **`FEASIBILITY-MATRIX.md`** (verified 2026-07-19). Key results: Buffer covers 9 of 11 networks with its own scheduler; Reddit + Snapchat aren't Buffer channels and stay on composer fallback (no gap — Content Forge already has it); Buffer is personal-token-only (no hosted OAuth), which confirms BYO-desktop-first is the only viable Buffer model. Direct integrations are worse on nearly every axis (app review, X per-post cost, Reddit's ~$12k/yr commercial floor, Snapchat has no open API); only Bluesky is trivially open for a future direct adapter.
