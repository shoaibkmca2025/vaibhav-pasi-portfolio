// Publishing automation, run by GitHub Actions (.github/workflows/blog-*.yml):
//
//   npx tsx scripts/blog-automation.ts release
//       Scheduled posts whose publishAt has passed: drop publishAt, set date to the release day.
//       Prints the released slugs (one per line). The workflow commits, which rebuilds the site.
//   npx tsx scripts/blog-automation.ts detect <beforeSha> <afterSha>
//       Prints slugs that became published between two commits (new posts, drafts made live).
//   npx tsx scripts/blog-automation.ts notify <slug...>
//       Waits until each article is live on the website, then sends a push to every app reader.
//
// notify needs SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (GitHub → Settings → Secrets → Actions).
// Without them it does nothing, like every other optional integration.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { POSTS_DIR, parsePostFile, postStatus, serializePost } from '../shared/blog';

const SITE_URL = (process.env.SITE_URL || 'https://www.vaibhavpasi.online').replace(/\/$/, '');
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function release(now = Date.now()) {
  const released: string[] = [];
  for (const name of fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'))) {
    const file = path.join(POSTS_DIR, name);
    const { meta, body } = parsePostFile(fs.readFileSync(file, 'utf8'));
    if (meta.draft || !meta.publishAt || new Date(meta.publishAt).getTime() > now) continue;
    const releaseDay = meta.publishAt.slice(0, 10);
    fs.writeFileSync(file, serializePost({ ...meta, publishAt: undefined, date: releaseDay }, body));
    released.push(name.replace(/\.md$/, ''));
  }
  return released;
}

function fileAt(sha: string, file: string) {
  try {
    return execFileSync('git', ['show', `${sha}:${file}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return null; // didn't exist at that commit
  }
}

function detect(before: string, after: string) {
  // A brand-new branch or force push reports an all-zero "before": nothing reliable to compare
  if (!before || /^0+$/.test(before)) return [];
  const changed = execFileSync('git', ['diff', '--name-only', '--diff-filter=AM', before, after, '--', POSTS_DIR], { encoding: 'utf8' })
    .split('\n')
    .filter((f) => f.endsWith('.md'));
  return changed.filter((file) => {
    const now = fileAt(after, file);
    if (!now || postStatus(parsePostFile(now).meta) !== 'published') return false;
    const old = fileAt(before, file);
    return !old || postStatus(parsePostFile(old).meta) !== 'published';
  }).map((f) => path.basename(f, '.md'));
}

// The site needs ~1 minute to rebuild. Pushing earlier would open an article that isn't there yet.
async function waitUntilLive(slug: string, timeoutMs = 12 * 60_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const r = await fetch(`${SITE_URL}/feed/posts/${slug}.json?t=${Date.now()}`, { cache: 'no-store' }).catch(() => null);
    if (r?.ok) return (await r.json()) as { title: string; excerpt: string; slug: string };
    await sleep(20_000);
  }
  return null;
}

async function notify(slugs: string[]) {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return console.log('Supabase is not configured: skipping push notifications.');
  const headers = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };

  const tokensRes = await fetch(`${url}/rest/v1/push_tokens?select=token`, { headers });
  if (!tokensRes.ok) throw new Error(`Could not read push_tokens: ${tokensRes.status}`);
  const tokens = ((await tokensRes.json()) as { token: string }[]).map((t) => t.token);
  if (!tokens.length) return console.log('No app readers have enabled notifications yet.');

  for (const slug of slugs) {
    const post = await waitUntilLive(slug);
    if (!post) {
      console.error(`${slug} did not go live within 12 minutes: no push sent.`);
      process.exitCode = 1;
      continue;
    }
    const stale: string[] = [];
    // Expo accepts up to 100 messages per request
    for (let i = 0; i < tokens.length; i += 100) {
      const batch = tokens.slice(i, i + 100);
      const r = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(
          batch.map((to) => ({
            to,
            title: post.title,
            body: post.excerpt || 'New article from Vaibhav Pasi',
            data: { slug: post.slug },
            sound: 'default',
            channelId: 'articles',
          })),
        ),
      });
      const result = (await r.json().catch(() => ({}))) as { data?: { status: string; details?: { error?: string } }[] };
      result.data?.forEach((ticket, j) => {
        if (ticket.details?.error === 'DeviceNotRegistered') stale.push(batch[j]);
      });
    }
    console.log(`Pushed "${post.title}" to ${tokens.length} device(s).`);
    // Uninstalled apps: remove their tokens so they aren't messaged again
    for (const token of stale) {
      await fetch(`${url}/rest/v1/push_tokens?token=eq.${encodeURIComponent(token)}`, { method: 'DELETE', headers });
    }
  }
}

const [command, ...args] = process.argv.slice(2);
if (command === 'release') console.log(release().join('\n'));
else if (command === 'detect') console.log(detect(args[0], args[1]).join('\n'));
else if (command === 'notify') await notify(args.filter(Boolean));
else {
  console.error('Usage: blog-automation.ts release | detect <before> <after> | notify <slug...>');
  process.exit(2);
}
