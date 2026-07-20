# Content Forge — Overnight Work Log (2026-07-19/20)

Everything below was built, verified, committed, and deployed while Adam was away. No decisions requiring his approval were taken; nothing was posted to any real account; no third-party service was purchased or committed to.

## Shipped tonight

### 1. Image relevance tuning ✅ (web + desktop)
`deriveImagePrompt` now infers what the business actually does and depicts its real product/service **literally**, avoiding unrelated metaphor drift (the trading-floor-for-a-trades-brand problem). `IMAGE_GUARD` reinforces on-topic subject matter.

### 2. "Coming soon" landing page ✅ (web)
`landing/index.html` → live at **/content-forge/landing/**. Dark brand, honest claims, IDEA→GENERATE→ADAPT→LAUNCH pipeline, an 11-network visual strip, and the "Comment FORGE to be notified" CTA. **No pricing** (per the guardrail). On a subpath so it doesn't touch the live app.

### 3. Verified feasibility matrix ✅ (`FEASIBILITY-MATRIX.md`)
All 11 networks researched against current 2026 docs. Buffer covers 9 (with its own scheduler); Reddit + Snapchat are composer-only (already handled). Buffer is personal-token-only — no third-party OAuth — which confirms BYO-desktop-first is the only viable Buffer model.

### 4. Real per-network capability model ✅
`NET_CAPS` (from the matrix) is now the single source of truth for the mock and Buffer adapters. Reddit/Snapchat show as composer-only (no fake connect); the other 9 as directly publishable with notes (YouTube Shorts-only, Instagram carousel ≤10, etc.).

### 5. Scheduling ✅
Launch has a **Publish-now / Schedule** toggle + datetime + timezone label. Schedule mode records a `scheduled` result with an absolute `scheduledFor` epoch. A campaign-level **status roll-up** (published / scheduled / failed, partial-success aware — handoff §6.5). Real execution is Buffer's job once the token is verified.

### 6. "Publish all connected" ✅
One action publishes/schedules to every connected, directly-publishable network and reports a roll-up. Composer-only networks are left for the user to open.

### 7. Buffer connect flow — BETA ✅ (built, NOT yet live-verified)
`BufferAdapter` behind the same interface: `listChannels` + `createPost` via Buffer's GraphQL beta. **Connect Buffer** UI in Settings → Connected Accounts (paste token → validate → connect matching networks). Disconnect clears it.
- **Security:** token stored in `settings.bufferToken` (on-device, excluded from exports), **never** in `state.connections` (exportable). Verified headless.
- **⚠️ Unverified:** the two GraphQL calls (`listChannels`, `createPost`) are built from Buffer's docs + the matrix but Buffer's schema pages were unreachable, so the exact field/enum names (`schedulingType`, `dueAt`, `CreatePostInput`) may need a tweak on first real use. They're isolated and flagged in code.

## Verification
Every code change was checked with: JS/main.js parse, web+artifact build, and a **real headless-Chromium harness** driving the flows — capability truth, connect/disconnect, publish-all + roll-up, scheduling, adapter routing, and the token-never-in-exportable-state invariant. All passed, no page errors. (Live OpenAI and live Buffer calls can't run from the sandbox — those need Adam's machine.)

## What needs Adam (nothing is blocked otherwise)
1. **Buffer API token** → paste it in Settings → Connected Accounts to verify the beta adapter end-to-end. First real post confirms/adjusts the flagged GraphQL field names. *(Token: Buffer → Settings → API, `publish.buffer.com/settings/api`.)*
2. **Code-signing** decision (SmartScreen) — SignPath (free) / Azure (~$10) / Certum (~$70).
3. **Web paywall** decision — free demo vs licensing proxy.

## Deploys
All committed to `main`, web redeployed to `gh-pages` (app + `/landing`), desktop `.exe` rebuilt via Actions. Commit range: image tuning → landing → matrix → capability model/scheduling → Buffer beta.

## Not done (out of scope / needs a decision)
Real Bluesky direct adapter (Buffer already covers Bluesky), analytics/DMs/comment automation (Phase 5), a full calendar/queue view (compact roll-up shipped instead), and a demo video.
