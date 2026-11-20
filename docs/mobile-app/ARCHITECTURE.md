# Vaibhav Pasi App: Audit & Architecture

Write once, publish everywhere: one article store, rendered by the website and by the Android/iOS app.

## 1. Website audit (what exists today)

| Area | Finding |
|---|---|
| Frontend | React 19 + Vite 6 + Tailwind 4 SPA (`src/`), custom router (`src/router.tsx`). |
| Rendering | `npm run build` prerenders every route to static HTML (`src/entry-server.tsx`, `scripts/prerender.mjs`), plus sitemaps, `robots.txt`, `llms.txt`. |
| Hosting | Vercel. `cleanUrls: true`. Serverless functions in `api/*.ts` (10 functions). |
| **Article store** | **No database.** Each article is `src/blog/posts/<slug>.md` with a YAML header (`shared/blog.ts`). Images live in `public/blog/`. |
| Publishing | `/admin` dashboard (`src/admin/`) → `api/admin-posts.ts` → GitHub Contents API commit → Vercel rebuild (~1 min) → live with full SEO. |
| Auth | Single `ADMIN_PASSWORD`; HMAC-signed HttpOnly cookie (`api/_lib/admin.ts`), rate-limited login, same-origin check on writes. |
| Uploads | `api/admin-upload.ts`: JPG/PNG/WebP/GIF/AVIF, 3 MB cap, committed to `public/blog/`. |
| Supabase | Used only for leads (`api/_lib/integrations.ts`), via REST + service-role key on the server. |
| Article URLs | `/blog/<slug>` (shown as "Insights" in the nav). 5 published articles. |
| Brand | Outfit typeface; navy `#07131F` / `#0B2338`, gold `#E2A93B` / `#F2BD5A`; light theme swaps to `#F4F8FC` with blue accent `#1D5FA8`. |

### Consequences

- The "database" is Git. It is versioned, free, and drives SEO prerendering. Moving articles to Postgres would mean rewriting the website's build, the admin and the SEO pipeline, and risks URLs and rankings. **We keep Git as the article store.**
- The mobile app talks to the same `api/admin-*` endpoints as `/admin`, so an article from either one appears on the website and in the app.
- Supabase is used only for what has to change at runtime: article views and shares, and push-notification tokens. Like every other integration on the site, it is optional.

### Breaking-change risks (and how they're handled)

| Risk | Mitigation |
|---|---|
| Cookie auth doesn't suit native apps | Add **bearer tokens** signed with the same key. Cookie flow is unchanged. |
| App-written HTML would change the Markdown format | The server converts editor HTML to Markdown (`turndown`). Files stay Markdown, and the web editor can still edit them. |
| Image URLs are relative (`/blog/x.jpg`) | The feed and the editor make them absolute. Saves turn them back into relative paths. |
| Vercel Hobby caps functions at 12 | Only **one** new function (`api/app.ts`), for a total of 11. |
| Scheduled posts need a rebuild at the scheduled time | A GitHub Action (cron) releases due posts with a commit, which triggers the normal rebuild. |
| Root `tsc` would type-check the app | Root `tsconfig.json` excludes `mobile/`, and `.vercelignore` skips it. |

## 2. Data model (mapped to the requested schema)

| Requested entity | Where it lives |
|---|---|
| Articles | `src/blog/posts/<slug>.md`. id = slug (the URL never changes once published). |
| `status` | Derived: `draft: true` → draft; `publishAt` set (in the future) → scheduled; otherwise published. |
| `seo_title`, `meta_description` | Front matter `seoTitle`, `metaDescription` (falls back to `excerpt`). |
| `published_at` / `created_at` / `updated_at` | `date` (+ `publishAt` for scheduled), Git history for created and updated. |
| Categories | `CATEGORIES` in `shared/blog.ts` (new list added; old ones kept so existing posts stay valid). |
| Tags / Article Tags | `tags:` list in front matter. |
| Users | One admin (password). The app stores a signed 30-day token in the device keychain. |
| Bookmarks | On the reader's device (readers are anonymous; no account needed). |
| Article Analytics | Supabase `article_events` (`slug`, `event`, `created_at`). See `docs/mobile-app/supabase.sql`. |
| Push subscribers | Supabase `push_tokens`. |

## 3. API

Existing endpoints, extended:

| Endpoint | Change |
|---|---|
| `POST /api/admin-session` | `{ password, client: "app" }` also returns `{ token, expiresAt }`. |
| all `api/admin-*` | Accept `Authorization: Bearer <token>` as well as the cookie. |
| `GET /api/admin-posts?slug=` | Also returns `html` (rendered body) for the app editor. |
| `GET /api/admin-posts?stats=1` | Views and shares per slug from Supabase (empty if not configured). |
| `POST /api/admin-posts` | Accepts `html` instead of `body` (converted to Markdown on the server), plus `seoTitle`, `metaDescription`, `publishAt`. |

New:

| Endpoint | Purpose |
|---|---|
| `GET /feed/posts.json` | Static, built with the site: published articles (no body) for lists and search. |
| `GET /feed/posts/<slug>.json` | Static: one article with rendered HTML. |
| `POST /api/app` `{ action: "track", slug, event }` | Public, rate-limited view/share counter. |
| `POST /api/app` `{ action: "register-push" \| "unregister-push", token }` | Public, subscribes or unsubscribes this device's Expo push token. |

The feed is static, so the app shows exactly what the website shows, from the CDN, with no function calls.

## 4. Publishing flows

```
App editor ──HTML──▶ /api/admin-posts ──turndown──▶ Markdown commit ──▶ Vercel build ──▶ website + /feed/*.json ──▶ app reader
                                                        │
                                                        └─▶ GitHub Action "blog-notify": waits until the article is live, then sends push to readers
Scheduled:  GitHub Action cron (every 15 min) ──▶ removes publishAt from due posts (commit) ──▶ build ──▶ push
```

Admin-side notifications are local to the device: "Published" after a successful save, a reminder at the scheduled time, and a draft reminder 24 h after the last edit.

## 5. Mobile app

- **Stack:** Expo (SDK 58), Expo Router, TypeScript, TanStack Query, `@10play/tentap-editor` (TipTap/ProseMirror rich text in a WebView), `expo-secure-store`, `expo-image-picker` + `expo-image-manipulator`, `expo-notifications`.
- **Location:** `mobile/` in this repo, so it shares `shared/` concepts and versioning with the site.
- **Navigation:** tabs Home, Explore, Search, Saved, Profile (About + Settings + Admin entry). Article screen as a stack route. The admin area (`/admin/*`) is shown only when signed in and has a floating "Write" button.
- **Editor:** WYSIWYG H1–H3, bold, italic, underline, bullet/numbered lists, quotes, links, inline images with alt text and caption, cover upload, autosave to the device every few seconds, word count, reading time, preview, and publish now / schedule / save draft.
- **Security:** no secrets in the app. The GitHub token and Supabase service key stay on Vercel. The app holds only the admin bearer token, in the iOS Keychain / Android Keystore.

See `docs/mobile-app/DEPLOYMENT.md` for setup, builds and release.
