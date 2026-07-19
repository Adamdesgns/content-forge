# Content Forge — Publishing Feasibility Matrix (handoff §11)

**Verified:** 2026-07-19, from current official developer documentation + corroborating 2026 developer sources.
**Scope:** the 11 networks Content Forge supports. Two lenses per network: (1) what **Buffer's API** can do (the chosen bring-your-own-token path), and (2) what a **direct** integration would take if we ever bypass Buffer.

> ⚠️ Verification caveat: Buffer's, Meta's, X's, TikTok's, Pinterest's, and Snap's official doc hosts return 403 to automated fetches, so some exact enum/scope/price strings below are corroborated from official-doc search extracts + third-party sources and are **flagged** where not read from the primary page. Concepts are verified; re-confirm the flagged literals against live docs before wiring the real adapter.

---

## Headline

- **Buffer covers 9 of Content Forge's 11 networks** directly, *with its own scheduler and offline publishing*: Instagram, TikTok, YouTube (Shorts), X, Facebook, LinkedIn, Threads, Pinterest, Bluesky.
- **Buffer does NOT support Reddit or Snapchat** — neither is a Buffer channel. Both are already handled by Content Forge's existing **composer fallback** (`publishLaunch`). No gap.
- **Buffer has no third-party OAuth** — it is **personal-API-key only** (a key an org Owner generates in their Buffer settings). This *confirms* the bring-your-own-token, desktop-first model is not just cheapest — it's the *only* model Buffer's beta allows. A hosted multi-tenant onboarding flow is impossible via Buffer today.
- **Direct integrations are worse for an indie on almost every axis:** four of the Meta/LinkedIn APIs need app review; X now charges per post (~$0.015, ~$0.20 with a link) with no free tier for new devs; Reddit's commercial tier has a ~$12k/yr floor; Snapchat has no open API at all. Only **Bluesky** is trivially open for a future direct adapter.

**Recommendation stands:** ship the **Buffer BYO adapter** for the 9, keep **composer fallback** for Reddit + Snapchat, and consider a **direct Bluesky** adapter later (zero gating) if we want one no-Buffer path.

---

## The matrix

| Network | Buffer direct publish | Buffer scheduling | Buffer media / caps | Direct-API gate (if we skip Buffer) | Direct usage cost | **Content Forge plan** |
|---|---|---|---|---|---|---|
| **Bluesky** | ✅ Yes | ✅ Queue/scheduled | text, image, video, threads; img <1 MB, video ≤100 MB | **None** — open protocol, no review | Free | **Buffer** (direct adapter easy later) |
| **X** | ✅ Yes | ✅ | text, threads, ≤4 img, GIF, video | Portal app only, no review | **Pay-per-use** (~$0.015/post, ~$0.20 w/ link) | **Buffer** |
| **Facebook** | ✅ Yes (Pages) | ✅ | text, multi-image, video, reels, link; first-comment (paid) | App review + Page + business verification | Free | **Buffer** |
| **LinkedIn** | ✅ Yes (profile + company page) | ✅ | text, carousel, PDF, video; first-comment | **Restricted** Community Mgmt API approval (hardest) | Free | **Buffer** |
| **Instagram** | ✅ Yes | ✅ (some → "Notify") | post/story/reel; **carousel capped at 10** | App review + **Professional acct** + Page + biz verification | Free | **Buffer** |
| **Threads** | ✅ Yes | ✅ | text, image, video, carousel, threads | App review (`threads_content_publish`) | Free | **Buffer** |
| **Pinterest** | ✅ Yes | ✅ | image/video pin (board required) | **Trial→Standard** or pins stay hidden | Free | **Buffer** |
| **TikTok** | ⚠️ Partial | ✅ / "Notify" | video (over-limit → notify), photo posts | **Content Posting API audit** or forced SELF_ONLY | Free | **Buffer**, else composer |
| **YouTube** | ⚠️ **Shorts only** | ✅ (`publishAt`) | vertical video 1:1 or 9:16; no long-form | OAuth verification + quota audit | Free (~100 uploads/day) | **Buffer** for Shorts; long-form → composer |
| **Reddit** | ❌ Not a Buffer channel | — | — | Registration gated; **commercial ~$12k/yr floor** | Free non-commercial only | **Composer fallback** |
| **Snapchat** | ❌ Not a Buffer channel | — | — | **No open API** — allowlist/partner only | Partnership-gated | **Composer fallback** |

---

## Buffer token & pricing (for the BYO connect flow)

- **Token:** user generates a **personal API key** in Buffer → Settings → API (`publish.buffer.com/settings/api`); only an org **Owner** can create it. Sent as a **Bearer token** to the GraphQL endpoint `https://api.buffer.com`. No SDK. *(Content Forge stores it on-device like the OpenAI key — never in exports, never in a build.)*
- **Free plan includes API access:** free = **1 API key + 3 connected channels**; paid = up to 5 keys.
- **Per-channel pricing** (verify live at buffer.com/pricing — figures are third-party-corroborated, flagged): Essentials ~**$5/channel/mo**, Team ~**$10/channel/mo**. A LinkedIn profile and a company page count as two channels.
- **Publishing modes:** immediate ("share now"), add-to-queue, custom-scheduled (`dueAt`, ISO-8601 UTC), draft, and notification publishing. ⚠️ Exact `schedulingType`/`mode` enum strings conflict between the official guide and third-party refs — resolve against the live GraphQL schema when building.

---

## What this means for the Buffer adapter build

1. **`PublishingAdapter` for Buffer = one `createPost` GraphQL mutation** + a channel-discovery query. The scaffold's mock interface already matches this shape — it's a drop-in.
2. **Capabilities per network come straight from this table** — feed them into `getCapabilities()` so the Launch grid shows "direct publish" for the 9 and "opens composer" for Reddit/Snapchat automatically.
3. **Scheduling is Buffer's job** — Content Forge sends `dueAt`; no custom queue/worker/offline-execution needed. This is the single biggest reason Buffer beats direct.
4. **Media:** Buffer takes an `assets` list (images/videos). Content Forge's generated image (currently session-only base64) must be uploaded/hosted for the asset reference — the one real media task to solve.
5. **Honor the caps:** Instagram carousel ≤10, YouTube Shorts-only (route long-form to composer), TikTok/IG over-limit video → "notify" mode (surface that in the per-destination result, don't claim a clean auto-post).
6. **No hosted OAuth** — the connect UI is "paste your Buffer token," validated by a test query. Matches the scaffold's Connected Accounts panel exactly.

## Flagged for live re-verification before shipping real posting
- Buffer `schedulingType`/`mode` enum literals; exact per-channel prices.
- X post-Feb-2026 per-unit pricing (console.x.com).
- Meta scope names per login flow (IG-Login vs FB-Login); Graph v25.0 minimal photo-post scopes.
- TikTok photo-carousel max + content-init flow; Pinterest carousel source-type field + native-scheduling availability.
- YouTube unverified-app upload behavior (private-lock vs warning).
- Reddit current self-serve registration + exact commercial pricing.
