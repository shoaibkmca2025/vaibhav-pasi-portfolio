# Vaibhav Pasi Portfolio

Premium React/Vite portfolio for Vaibhav Pasi, focused on digital strategy, social growth, case studies, and brand systems.

## Run Locally

**Prerequisite:** Node.js

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local` if you need local environment values.
3. Start the dev server: `npm run dev`
4. Build for production: `npm run build`

## Publishing Blog Posts

Blog posts are Markdown files in [`src/blog/posts/`](src/blog/posts/). Each file becomes an article on the site. All articles are listed on the blog page at `yoursite.com/#/blog`, and the newest ones are previewed in the Blog section on the home page.

1. Copy `src/blog/posts/_template.md` and rename it. The file name becomes the link: `my-new-post.md` → `yoursite.com/#/blog/my-new-post`.
2. Fill in the details at the top (between the `---` lines):

   | Field      | What it does                                                        |
   |------------|---------------------------------------------------------------------|
   | `title`    | Article headline                                                    |
   | `date`     | `YYYY-MM-DD`. Newest posts are shown first                          |
   | `category` | Groups posts under the filter buttons (e.g. Growth, AI & Tech)      |
   | `excerpt`  | One or two sentences shown on the blog card                         |
   | `cover`    | Cover image: an Unsplash link, or a file you put in `public/blog/` (use `/blog/filename.jpg`) |
   | `tags`     | Comma-separated, shown at the end of the article                    |
   | `featured` | `true` shows it as the large card at the top of the blog section    |
   | `draft`    | `true` hides the post from the site                                 |

3. Write the article below the second `---` in normal Markdown: `## headings`, **bold**, lists, `> quotes`, links and images.
4. Rebuild and deploy (`npm run build`). The post appears in the Blog section automatically.
