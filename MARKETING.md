# Content Forge — Product Marketing Handoff

This document describes the product for anyone building marketing around it (landing page, social posts, ads, App descriptions, launch copy). It covers what the product is, who it's for, what it truly does (and what it does NOT do — don't overclaim), pricing, and ready-to-use messaging.

---

## 1. One-liner options

- **Create once. Publish everywhere.** ← primary tagline; use verbatim
- Turn one idea into a finished post — copy, image, and all — for every network.
- You never start with a blank page.
- The content workstation that writes, designs, and preps your post for 11 networks at once.
- One brief in. Platform-ready content out.

**Elevator pitch (30 sec):**
Content Forge is a desktop + web app for creators and small businesses who post everywhere but don't have time to rewrite everything for every platform. You give it one idea; it generates the finished caption and image with AI, then instantly adapts that post to the rules of 11 different networks — right character counts, right hashtag limits — and opens each network's composer with your post ready to go. Your own OpenAI key powers the generation, so there's no markup on AI costs. $9.99/month after a 3-day free trial.

## 2. What the product is

A **platform-first content workstation** available three ways from one codebase:
- **Windows desktop app** (installer, works like any normal program)
- **Web app / installable PWA** (add to home screen on any phone)
- (Internal: a claude.ai artifact demo build also exists)

**Core workflow:** Pick a platform → pick a generator → add a brief or reference images → the app builds an expert-level content prompt → Generate (formerly AI Studio) generates the finished caption + image → Launch (formerly Publish Studio) adapts it to all 11 networks and launches each composer.

## 3. Who it's for (audiences, in priority order)

1. **Solo creators / influencers** posting the same content across many networks daily. Pain: rewriting for each platform's limits. 
2. **Small local businesses** (the app was born from a logo/branding business) that need consistent, professional social presence without hiring an agency.
3. **Freelance social media managers** juggling several client brands — brand defaults + saved projects fit multi-brand work.

## 4. Features → benefits (use benefits in copy, features as proof)

| Feature (true) | Benefit (say this) |
|---|---|
| Generators for X, Instagram, Threads, Facebook, TikTok, YouTube (carousels, reels, threads, stories, giveaways, articles) | "Never start from a blank page — pick the format, it knows the recipe." |
| 6 bundled professional prompt systems (Carousel Forge, Editorial OS, Neon Listicle, TikTok Reel Forge, Article 5:2, FB Prompt Post) | "Agency-grade content systems built in." |
| Generate (formerly AI Studio): generates finished captions (hook/caption/CTA/hashtags) and real images | "It doesn't just prompt — it produces the post." |
| Bring-your-own OpenAI key | "No AI markup. Pay OpenAI pennies directly; we never touch your usage." |
| Launch (formerly Publish Studio): one post auto-adapted to **11 networks** (X, Instagram, Threads, Facebook, TikTok, YouTube, LinkedIn, Pinterest, Reddit, Bluesky, Snapchat) — live char counts, hashtag caps per network, smart trimming | "Write once. Fits everywhere. No more counting characters." |
| One-click **Open** launches each network's real composer docked beside the app; X/Threads/Bluesky/Reddit/LinkedIn arrive pre-filled, others auto-copy for one paste | "Post to every network in minutes, not an afternoon." |
| Everything stored locally on the user's device; no account with us, no content on our servers | "Your content and your API key never leave your machine." |
| Works as phone app (PWA) + desktop | "Same tool at your desk and in your pocket." |
| Brand defaults, saved projects, import/export backup | "Set your brand once; every post sounds like you." |

## 5. Pricing & offer

- **$9.99/month subscription** with a **3-day free trial** (card required; cancel anytime through the customer portal).
- Sold via Lemon Squeezy (handles checkout, tax/VAT, receipts). License key unlocks the app on up to N devices (activation limit set in store; recommend 3).
- Angle: *"Less than one boosted post. Cheaper than an hour of a social media manager."*
- Cost transparency angle: AI usage bills to the user's own OpenAI key (typically cents per post) — we don't resell AI.

## 6. Honest-claims guardrails (IMPORTANT — do not overclaim)

**You CAN say:**
- "Generates finished captions and images with AI" (true — via user's OpenAI key)
- "Adapts your post to 11 networks' rules automatically" (true)
- "Opens every network's composer with your post ready — several arrive pre-filled" (true)
- "Private by design: content and keys stay on your device" (true)

**You must NOT say:**
- ~~"Auto-posts / schedules to 11 networks"~~ — it does NOT post on the user's behalf or schedule; it preps the post and opens the composer (user hits Post). No network APIs are connected.
- ~~"Free AI included"~~ — generation requires the user's own OpenAI API key.
- ~~"Available on the App Store / Google Play"~~ — it's a PWA + Windows installer, not store-listed.
- ~~"Mac/Linux app"~~ — desktop build currently ships for **Windows** (Mac/Linux possible later; web app works on Mac today).
- Avoid "unlimited AI" phrasing — usage is limited by the user's OpenAI account.

## 7. Differentiators / positioning

- **vs. Buffer/Hootsuite (schedulers):** they schedule what you already wrote; Content Forge *creates* the content and fits it to each network. (And no per-channel pricing.)
- **vs. ChatGPT alone:** no prompt engineering, no copy-pasting between tools; platform rules, brand voice, image systems, and multi-network adaptation are built in.
- **vs. Canva:** Canva is design-first; Content Forge is *post*-first — copy + image + per-network fit in one flow.
- **Privacy angle:** no SaaS database of your content; everything is local.

## 8. Objections & answers (FAQ fodder)

- **"Do I need an OpenAI account?"** For AI generation, yes — a free key from platform.openai.com; typical cost is cents. Everything else (generators, prompts, Launch (formerly Publish Studio) adaptation) works without it.
- **"Does it post for me?"** It preps the post and opens each network's composer — you tap Post. You stay in control of every account (and no risky API access to your socials).
- **"What devices?"** Windows desktop app + web app that installs on iPhone/Android home screen (and runs in any browser, including on Mac).
- **"Can I cancel?"** Anytime via the Manage Subscription link in the app; the app keeps working until the period ends.
- **"Is my content private?"** Yes — projects, brand settings, and your API key live only on your device. Export/backup is manual and yours.

## 9. Assets & links (for campaigns)

- Live web app: https://adamdesgns.github.io/content-forge/
- Desktop download (always-latest): https://github.com/Adamdesgns/content-forge/releases/tag/desktop-latest
- Versioned releases: `vX.Y.Z` tags on the same Releases page (current: v1.0.0-beta.1)
- App icon: `assets/icon.png` (512px, "LL"→ regenerate a "CF" version before public launch — see note below)
- Screenshot sources: run the app and capture (1) home with generator cards, (2) wizard, (3) Generate (formerly AI Studio) with generated post + image, (4) Launch (formerly Publish Studio)'s 11 cards. Dark UI screenshots read well on both light/dark feeds.
- **Checkout link:** from Lemon Squeezy once the store is wired (see HANDOFF.md §6). Until then the app is gated by invite password — **don't run paid traffic before the store is live.**

**Pre-launch asset gaps to close:**
1. App icon still shows "LL" monogram (legacy) — should be updated to "CF" to match the Content Forge brand.
2. No domain — links are github.io; consider a custom domain for credibility.
3. No demo video — a 30–60s screen capture of brief → generated post → 11 cards → docked composer is the single highest-value asset.

## 10. Suggested launch messaging (starters)

**Hook bank:**
- "I stopped copy-pasting between five tabs to make one post."
- "One brief. Eleven networks. Ten minutes."
- "Your caption is 281 characters. X allows 280. This app already fixed it."

**Launch caption (short):**
> Content Forge is live. Give it one idea → it writes the caption, generates the image, and fits your post to 11 networks' rules — then opens each composer with everything ready. 3-day free trial, $9.99/mo. Your content stays on your device.

**Demo-video script beats (45s):** blank page pain (5s) → type one brief (5s) → AI writes caption + renders image (10s) → Launch (formerly Publish Studio)'s 11 cards adapt live, counts turning green (10s) → click Open on X, composer pops up pre-filled, hit Post (10s) → logo + price + trial CTA (5s).

## 11. Product facts (for accuracy checks)

- Current version: **1.0.0-beta.1** · Windows installer ~100 MB · PWA works offline after first load
- Access: license key (subscription) once store is wired; invite password during pre-launch
- Networks adapted: X 280 · Bluesky 300 · Threads 500 (1 hashtag) · Snapchat 250 (3 tags) · Pinterest 500 · LinkedIn 3,000 (5 tags) · Instagram 2,200 (30 tags) · TikTok 2,200 · YouTube 5,000 · Facebook 63,206 · Reddit 40,000 (tags stripped, title auto-split)
- Tech trust points: no telemetry, no account system, open codebase (currently public repo)

---
*Companion docs: `HANDOFF.md` (technical state + deploy loop), `README.md` (feature docs). Keep claims in sync with §6 when the product changes.*
