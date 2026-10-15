# Vaibhav Pasi Portfolio

Premium React/Vite portfolio for Vaibhav Pasi, focused on digital strategy, social growth, case studies, and brand systems.

## Run Locally

**Prerequisite:** Node.js

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` if you need local environment values.
3. Start the dev server: `npm run dev`
4. Build for production: `npm run build`

## Publishing Blog Posts

### The easy way: your dashboard at `/admin`

Go to **https://www.vaibhavpasi.online/admin** and sign in with your admin password. From there you can:

- **Write** a new article in the editor (toolbar for headings, bold, links, lists, quotes and images; Write/Preview tabs)
- **Upload** a cover image and images inside the article (photos are resized automatically before upload)
- Set the **date, category, excerpt, tags**, and mark it **Featured**
- **Save as draft** (hidden from the site) or **Publish**; edit, **Unpublish** or **Delete** later
- See a **Google preview** of how the article will appear in search results

**How publishing works:** the dashboard saves the article as a Markdown file in [`src/blog/posts/`](src/blog/posts/) through
the GitHub API (`api/admin-posts.ts`). That's a normal Git commit, so Vercel rebuilds the site and the article is live, with
full SEO, in about a minute. The dashboard tells you when it's live. Every change is in Git history, so nothing is lost.

**One-time setup** (Vercel → Project → Settings → Environment Variables, then redeploy):

| Variable | What it is |
|---|---|
| `ADMIN_PASSWORD` | The password for `/admin`. Use a long, unique one (8+ characters required; 16+ recommended). |
| `GITHUB_TOKEN` | Lets the server save posts to this repo. GitHub → Settings → Developer settings → **Fine-grained tokens** → Generate new token: *Repository access* = only `vaibhav-pasi-portfolio`; *Permissions* → **Contents: Read and write**. Set an expiry and renew it when it runs out. |

Optional: `ADMIN_SESSION_SECRET` (signs the login cookie; otherwise derived from the password), and `GITHUB_REPO` /
`GITHUB_BRANCH` (default `shoaibkmca2025/vaibhav-pasi-portfolio` / `main`).

**Security:** the password is checked on the server with a constant-time comparison and sign-in attempts are rate-limited.
The session is an HttpOnly, Secure, SameSite=Strict cookie that expires after 7 days, and changing `ADMIN_PASSWORD` signs
everyone out. The GitHub token never leaves the server, and `/admin` is excluded from search engines.

**Code:** dashboard UI in [`src/admin/`](src/admin/) (a separate bundle that site visitors never download), API in
`api/admin-*.ts`, and the post format shared by both in [`shared/blog.ts`](shared/blog.ts).

### By hand

Blog posts are Markdown files in [`src/blog/posts/`](src/blog/posts/). Each file becomes an article on the site. All articles are listed on the blog page at `yoursite.com/blog`, and the newest ones are previewed in the Blog section on the home page.

1. Copy `src/blog/_template.md` into `src/blog/posts/` and rename it. The file name becomes the link: `my-new-post.md` → `yoursite.com/blog/my-new-post`.
2. Fill in the details at the top (between the `---` lines):

   | Field      | What it does                                                        |
   |------------|---------------------------------------------------------------------|
   | `title`    | Article headline                                                    |
   | `date`     | `YYYY-MM-DD`. Newest posts are shown first                          |
   | `category` | Groups posts under the filter buttons (e.g. Growth, AI & Tech)      |
   | `excerpt`  | One or two sentences shown on the blog card                         |
   | `cover`    | Cover image: an Unsplash link, or a file you put in `public/blog/` (use `/blog/filename.jpg`) |
   | `tags`     | Comma-separated (or a YAML list), shown at the end of the article   |
   | `featured` | `true` shows it as the large card at the top of the blog section    |
   | `draft`    | `true` hides the post from the site                                 |

3. Write the article below the second `---` in normal Markdown: `## headings`, **bold**, lists, `> quotes`, links and images.
4. Rebuild and deploy (`npm run build`). The post appears in the Blog section automatically.

## Instagram Gallery

The "Behind the Scenes" section on the home page shows up to 8 photos from two sources:

1. **Photos you upload** in the dashboard: **/admin → Gallery**. Add photos (several at once), write a caption, paste the
   Instagram post link (Instagram → ⋯ → Copy link), and **Pin** favourites to keep them first. Click **Save gallery**; the
   site updates in about a minute. These are stored in [`src/content/gallery.json`](src/content/gallery.json) and `public/gallery/`.
2. **Your latest Instagram posts, automatically**, once `INSTAGRAM_ACCESS_TOKEN` is set (below).

Order: pinned uploads first, then everything else newest-first. If an upload links to a post that's also in the live feed,
your upload replaces it, so nothing appears twice. Tapping a photo opens it full-screen with a **View on Instagram** button.
The section stays hidden until there's at least one photo.

### Connecting Instagram (optional, for auto-sync)

Instagram only allows this for **Professional** accounts and through Meta's official API. One-time setup (Meta's menus
change occasionally, so names may differ slightly):

1. In the Instagram app: **Settings → Account type and tools → Switch to professional account → Creator** (free, reversible).
2. Go to **developers.facebook.com → My Apps → Create app**, choose the use case for the **Instagram API**, and create it.
3. In the app, open **Instagram → API setup with Instagram login → Generate access tokens**, add `@vaibhavpasi_`, sign in,
   and copy the generated token (it lasts 60 days).
4. In Vercel → Settings → Environment Variables, add `INSTAGRAM_ACCESS_TOKEN` with that token, then redeploy.

The dashboard's Gallery tab shows **Connected** when it works. The site asks Instagram to extend the token about once a day
while people visit. If it ever expires, the Gallery tab says so and the website simply shows your uploaded photos until you
paste a new token. The live feed is cached for an hour (`api/instagram.ts`), so visitors never wait on Instagram.

## SEO

`npm run build` prerenders every page (home, `/blog`, each article) to static HTML with its own title,
description, social preview tags and structured data, so search engines, AI assistants and link previews
see the full content. It also generates `sitemap.xml`, `robots.txt` and `llms.txt`.

- Site address, name and default title/description: [`src/site.ts`](src/site.ts). Update `SITE_URL` if you move to a custom domain.
- Per-page tags and structured data: [`src/seo.ts`](src/seo.ts)
- FAQ questions (also used for Google's FAQ markup): [`src/components/FAQ.tsx`](src/components/FAQ.tsx)
