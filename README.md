# Lucedale Content Forge Desktop v0.8

A simple platform-first desktop content workstation for Lucedale Logo. The same app can switch into **Anvil Content Forge** module mode.

## Current workflow

```text
Start a New → Choose Platform → Choose Generator → Add Brief or Images → Set Goal → Create Prompt → Adapt → Export
```

## What works now

- Six grouped platform tabs: X, Instagram, Threads, Facebook, TikTok, and YouTube.
- Platform-specific generator cards.
- A three-step **Start a New** wizard.
- Brief, notes, article, or source-material input.
- Reference-image and screenshot upload with saved previews.
- Saved projects and recent-project reopening.
- Editable, copyable, downloadable prompt packages.
- Brand defaults and standing copy rules.
- Lucedale Logo mode and Anvil module mode.
- Local JSON data storage with import and export.
- Dedicated platform adaptation prompts and export presets.

## Instagram carousel systems included

The original prompt systems are bundled in the `prompts` folder and loaded by the desktop app:

- `CAROUSEL-FORGE-v1.md`
  - Seven slides
  - 1080 × 1350 master format
  - Industrial ivory paper, orange, charcoal, technical marks, 3D dioramas
- `editorial-os-instagram-carousel-prompt.md`
  - Eight slides
  - 1080 × 1350 master format
  - Terracotta editorial system, screenshots, tape, annotations, and proof-led storytelling
- `NEON-LISTICLE-CAROUSEL-v1.md`
  - Seven or more slides
  - 1080 × 1350 master format
  - Near-black premium listicle system, one neon accent, numbered cards, reflective floor, and cinematic 3D metaphor objects

Instagram remains the primary visual master, but Carousel Forge, Editorial OS, and Neon Listicle now also have dedicated X and Facebook generators. X rebuilds them as 1600 × 900 landscape cards. Facebook rebuilds carousel systems as native 1080 × 1080 square cards, standard feed images as 1080 × 1350, and reels or stories as 1080 × 1920. These are destination-specific layouts, not stretched crops.

## TikTok reel system

- `TIKTOK-REEL-FORGE-v1.md`
  - 1080 × 1920 reel-first format
  - Auto-selects talking head, screen recording, product demo, storytime, B-roll, or carousel-to-reel
  - Returns the hook, timed script, shot list, on-screen text, editing plan, caption, pinned comment, and asset map

## Run the desktop app

Install Node.js, open a terminal in this folder, and run:

```bash
npm install
npm start
```

## Build a Windows installer or portable app

```bash
npm install
npm run dist:win
```

The packaged app will appear inside the `release` folder.

## Local data

Projects, brand defaults, prompt edits, and compressed reference-image previews are stored in Electron's user-data folder as:

```text
content-forge-data.json
```

Use the File menu to save, export, import, or open the data folder.

## Next functional build

1. Connect a text-generation API so the app produces finished copy inside the workspace.
2. Connect image generation for Carousel Forge, Editorial OS, and Neon Listicle.
3. Add slide-by-slide approval and regeneration.
4. Add individual PNG export and campaign ZIP export.
5. Add reusable campaign folders that hold each platform-native version and applicable 5:2 article covers.


## v0.5 additions

- macOS-inspired dark interface with X-style contrast and blue accents
- Dedicated Carousel Forge, Editorial OS, and Neon Listicle generators for X
- Dedicated Carousel Forge, Editorial OS, and Neon Listicle generators for Facebook
- 5:2 article-image output remains available at 2000 × 800 on article-capable platform tabs
- TikTok no longer exposes article-image generation
- TikTok output is standardized to a native 1080 × 1920 (9:16) reel plus an optional matching 9:16 cover frame
- Direct Article Image 5:2 generator remains available on X, Instagram, Threads, Facebook, and YouTube
- Article-cover prompt included in the prompt library


## TikTok format decision

TikTok projects intentionally do not include a 5:2 article image. The app uses a 1080 × 1920, 9:16 vertical reel as the master output and can add a matching 9:16 cover frame. Square and landscape video may be accepted by TikTok, but the generator stays vertical-first because 9:16 is TikTok's recommended native presentation.


## v0.7 prompt-system selection

- Every platform now has separate **Writing Prompt** and **Image Prompt** selectors.
- The content generator controls what is being made; the selected writing prompt controls copy structure and voice; the selected image prompt controls visual treatment.
- Facebook now includes a dedicated **Prompt Post** generator for free prompts, paid prompt packs, comment-keyword campaigns, pinned comments, delivery DMs, and follow-up copy.
- Writing options include Platform Native, Prompt Post, Educational Explainer, Giveaway / Lead Magnet, Carousel Copy, MARQUEE Long-Form, Conversation / Reply, and Reel / Short Script.
- Image options include Auto Native, No Image, Prompt Product Card, Carousel Forge, Editorial OS, Neon Listicle, Minimal Static Feed, 9:16 Reel Cover, 5:2 Article Image, and YouTube Thumbnail where supported.
