# VFA Site Architecture & Caching Strategy

> **Purpose of this doc:** explain how the site is put together and how caching
> keeps the low-cost WordPress host from getting hammered during traffic bursts.
> Written to be re-read months later, so it assumes you've forgotten everything.

---

## 1. The big picture: a "headless" / decoupled site

The site is split into two independent halves that talk over HTTP:

| Half | What it is | Where it lives | Scales under load? |
|------|-----------|----------------|--------------------|
| **Frontend** | The React app (this repo) — built by Vite into plain static HTML/JS/CSS | Free static CDN hosting (Cloudflare Pages) at `victoriafestivalofauthors.ca` | ✅ Yes, effectively infinitely & for free |
| **Backend** | WordPress — used only as a content editor + database, not to render pages ("headless") | Low-cost shared host at `api.victoriafestivalofauthors.ca` | ❌ No — this is the fragile, expensive part |

The React app fetches content from WordPress's **REST API** and renders it in the
browser. WordPress never renders a public page; it just serves JSON.

```
                        victoriafestivalofauthors.ca
  Visitor's browser ─────────────────────────────────▶  React app (static, on CDN)
                                                              │
                                                              │  fetches JSON
                                                              ▼
                                         api.victoriafestivalofauthors.ca/wp-json/...
                                                       (WordPress REST API)
```

### Why this matters for performance

The React app is already static, so serving it is free and fast no matter how much
traffic arrives. **All of the lag and all of the server load comes from one place:
the REST API calls to WordPress.** Every visitor's browser makes several
`api.../wp-json/...` calls per page, and each one spins up PHP + MySQL on the cheap
host. Under bursty traffic that host is the bottleneck.

**So the entire caching strategy has one goal: stop letting visitors hit WordPress
directly. Put a cache in between.**

---

## 2. Two doors into WordPress (the key mental model)

The WordPress box answers two very different kinds of request on the **same domain**.
Keeping them straight is the thing that makes caching make sense:

| Path | Who uses it | Method | Cached? |
|------|-------------|--------|---------|
| `api.../wp-admin/` and `wp-login.php` | **Organizers** logging in to edit content | authenticated, dynamic | **Never** |
| `api.../wp-json/vfa/v1/...` | **The public** (via the React app) reading content | anonymous `GET` | **Yes — this is what we cache** |

Editing content and caching content happen on **different paths**, so they never
collide:

- Organizers go to `/wp-admin`, log in (carrying a login cookie), and edit. These
  requests are authenticated and dynamic, so **any cache bypasses them automatically**
  and always talks to live WordPress. **The editing workflow is never affected by
  caching.**
- The public only ever reads the `/wp-json/` JSON, and that's the only thing we cache.

### The one wrinkle: staleness

When an organizer saves an edit, WordPress's database updates instantly — but a cached
copy of the old JSON may still be sitting in the cache, so the public keeps seeing the
old version until the cache entry expires (its **TTL**) or is **purged**. Managing that
gap is the only real complexity, and it's solved by either a short TTL or a
save-triggered purge (see §4).

---

## 3. Caching layers (each is optional and additive)

Think of these as levers. You can pull any subset; they stack.

1. **In-app dedup — React Query `staleTime`.** The frontend already uses TanStack
   Query. Setting a long `staleTime` (e.g. 1 hour) means a single visitor's session
   won't re-fetch the same endpoint repeatedly. *Helps within one session; does nothing
   for the first hit or for other visitors.* Zero infra.

2. **Browser caching — `Cache-Control` headers from WordPress.** If the REST API sends
   `Cache-Control: public, max-age=...`, each visitor's browser caches the JSON, so
   repeat visits and navigation stop re-hitting WordPress. *Also future-proofs for a
   CDN — Cloudflare will honor these headers automatically.* Small WordPress change.

3. **Origin-side caching — a WordPress cache plugin.** A page/object/REST cache (e.g.
   WP Super Cache, or a REST cache plugin) stores rendered responses on the host so
   even a cache *miss* skips the expensive meta queries. *Protects the origin itself;
   the request still reaches the host but is cheap.* Plugin install.

4. **Edge caching — Cloudflare in front of the API (the big win).** Cloudflare's global
   edge serves the cached JSON to almost everyone, so WordPress sees a trickle of
   requests instead of a flood. *This is the one that makes bursty traffic a non-event.*
   Requires the Cloudflare migration (§5).

5. **Build-time static snapshot (maximum resilience).** Fetch all WordPress data once at
   **build/deploy time**, write it to static JSON deployed with the app, and have the
   frontend read that instead of calling WordPress live. *Visitors never touch WordPress
   at all — it could go down and the public site stays up.* Trade-off: content changes
   only appear after a rebuild (triggered by a webhook on save, a scheduled rebuild, or
   a manual button). Works with **any** host — doesn't need Cloudflare.

### Immutable archives — a free win regardless of approach

The archived Q&A posts (`Q&A 2019`–`2025` categories) **never change**. They need no
purge logic and can be cached essentially forever, or baked fully static. Whatever
strategy is chosen, give the archives the most aggressive caching — there's no downside.

---

## 4. Keeping the cache in sync after edits ("purge")

Once caching is on (layers 2–4), an edit in `/wp-admin` won't show publicly until the
cache updates. Three ways to handle it, from best to simplest:

- **Save-triggered purge (best UX) — implemented in the `vfa-cache` plugin.** On any
  content change (`save_post`, trash/delete, term edits) it busts the **entire**
  Cloudflare zone via the purge API, so the next visitor re-warms the cache within
  seconds. Organizers never think about caching — edits "just appear." Full-cache-bust
  is deliberate: simple and reliable, and saves are infrequent so the cost is nil.
  Credentials live in `wp-config.php` (`VFA_CLOUDFLARE_ZONE_ID` / `VFA_CLOUDFLARE_API_TOKEN`),
  never in the plugin. Inert until those are set; status + a manual purge button live at
  **Tools → VFA Cache**, and a failed purge raises an admin notice.
- **Short TTL.** Set a modest expiry (e.g. 5–15 min) so edits surface on their own
  shortly after saving. No hook needed; slight delay.
- **Manual purge button.** Organizers click "purge" after a big update. Simple, but
  relies on them remembering.

For content that changes rarely, a **long TTL + save-triggered purge** gives both low
origin load *and* near-instant updates.

---

## 5. Current state (interim) vs. after the Cloudflare migration

### Interim — before Cloudflare (today)

WordPress is **not** yet behind a CDN, so **edge caching (layer 4) isn't available yet.**
What you *can* do right now to reduce load, in order of effort:

- **Layer 1 — `staleTime`:** already partly in place; tune it up across the data hooks.
  Free, in-repo.
- **Layer 2 — `Cache-Control` headers:** add a small WordPress filter so the REST API
  advertises cache-friendly headers. Low risk, and it means Cloudflare will "just work"
  later with almost no extra config.
- **Layer 3 — WordPress cache plugin:** the biggest interim protection for the origin
  itself, since it makes each request cheap even without a CDN.
- **Layer 5 — static snapshot:** if bursty traffic is a near-term worry, this is the
  strongest interim move because it offloads WordPress completely and needs no Cloudflare.

### The transition to Cloudflare

This rides along with the go-live DNS cutover (see the go-live checklist). Steps:

1. Add the domain to Cloudflare; it auto-imports DNS records. **Verify MX records by
   hand before cutover** — festival email is on the same host and must not be
   interrupted. (Proxying an HTTP subdomain does **not** affect email/MX.)
2. **Proxy the `api` subdomain** (the orange cloud in Cloudflare DNS). HTTP traffic to
   `api.../wp-json/` now flows through Cloudflare; email is untouched.
3. Add a **Cache Rule**: match `api.victoriafestivalofauthors.ca/wp-json/*`, mark it
   eligible for cache, and set an Edge TTL (Cloudflare can override WordPress's default
   `no-cache` and cache anyway). If layer 2 headers are already in place, this is mostly
   confirmation.
4. Add the **save-triggered purge hook** so edits stay near-instant.

**What does *not* change:** the React app calls the exact same
`api.victoriafestivalofauthors.ca/wp-json/...` URLs throughout. It has no idea whether
those responses come from the browser cache, the origin cache, or Cloudflare's edge —
the API contract is identical. That's the whole point of the decoupled design, and it's
why the transition carries almost no risk.

**Reversible:** to undo edge caching, disable the Cache Rule or grey-cloud the subdomain
and traffic goes straight to the origin again.

---

## 6. Where things live in the code

- **Frontend data fetching:** `src/api/**` — one folder per content type, each with a
  TanStack Query hook (`useGet*`). `staleTime` is set here.
- **REST endpoints (WordPress):** `Wordpress/vfa-custom-fields/vfa-custom-fields.php` —
  registers the custom `vfa/v1` routes and REST fields.
- **Editor UI (WordPress):** `Wordpress/vfa-meta-boxes/vfa-meta-boxes.php` — the
  meta-box editing screens organizers use in `/wp-admin`.
- **Cache purge (WordPress):** `Wordpress/vfa-cache/vfa-cache.php` — busts the
  Cloudflare cache on content change; status/manual purge at Tools → VFA Cache.
- **REST cache headers (WordPress):** the `rest_post_dispatch` filter at the bottom of
  `vfa-custom-fields.php` sends `Cache-Control` on public GET reads.
- **Go-live / DNS / security headers:** tracked in the project go-live checklist
  (includes the MX-preservation warning and CSP recommendation).

---

## 7. TL;DR

- The React frontend is static and already scales for free; **WordPress's REST API is
  the only thing under load.**
- **Cache the `/wp-json/` reads; never the `/wp-admin` edits** — they're separate paths
  and never conflict.
- **Interim:** tune `staleTime`, add `Cache-Control` headers, add a WordPress cache
  plugin, and/or bake a static snapshot.
- **After Cloudflare:** proxy the `api` subdomain + a Cache Rule + a save-triggered
  purge hook. The React app doesn't change at all.
- **Archives never change** → cache them the hardest.
- **Email/MX is on the same host** → verify MX before any DNS change; proxying HTTP
  doesn't touch it.
