# Vaibhav Pasi Portfolio

Premium React/Vite portfolio for Vaibhav Pasi, focused on digital strategy, social growth, case studies, and brand systems.

## Run Locally

**Prerequisite:** Node.js

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` if you need local environment values.
3. Start the dev server: `npm run dev`
4. Build for production: `npm run build`

## Publishing Blog Posts

### The easy way: the admin at `/admin`

Go to **https://www.vaibhavpasi.online/admin**, sign in with GitHub, and use **New Blog post**: write in a normal editor,
upload a cover image, and click **Publish**. The post is saved to this repository and Vercel puts it live in about a minute.
You can also edit, unpublish (tick **Draft**) or delete existing posts there.

**Who can sign in:** only GitHub accounts with write access to this repository can publish. Set `ADMIN_GITHUB_USERS`
in Vercel to limit it further to specific usernames.

**One-time setup for "Sign in with GitHub"** (until this is done, use **Sign in with token** on the admin page with a
GitHub personal access token that has *Contents: Read and write* on this repo):

1. GitHub → Settings → Developer settings → **OAuth Apps → New OAuth App**
   - Homepage URL: `https://www.vaibhavpasi.online`
   - Authorization callback URL: `https://www.vaibhavpasi.online/api/callback`
2. Copy the **Client ID**, click **Generate a new client secret**, and copy it.
3. Vercel → Project → Settings → Environment Variables: add `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET`
   and (recommended) `ADMIN_GITHUB_USERS`, then redeploy.

Admin settings (fields, categories, image folder) live in [`public/admin/config.yml`](public/admin/config.yml).

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

## SEO

`npm run build` prerenders every page (home, `/blog`, each article) to static HTML with its own title,
description, social preview tags and structured data, so search engines, AI assistants and link previews
see the full content. It also generates `sitemap.xml`, `robots.txt` and `llms.txt`.

- Site address, name and default title/description: [`src/site.ts`](src/site.ts). Update `SITE_URL` if you move to a custom domain.
- Per-page tags and structured data: [`src/seo.ts`](src/seo.ts)
- FAQ questions (also used for Google's FAQ markup): [`src/components/FAQ.tsx`](src/components/FAQ.tsx)
