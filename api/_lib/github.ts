// Minimal GitHub Contents API client: the blog's "database" is the Markdown files in the repo.
// Saving a post commits it, and Vercel redeploys the site automatically.
// Needs GITHUB_TOKEN: a fine-grained personal access token with "Contents: Read and write"
// on this repository only. It stays on the server and is never sent to the browser.
import { env } from './http.js';

const repo = () => env('GITHUB_REPO') || 'shoaibkmca2025/vaibhav-pasi-portfolio';
const branch = () => env('GITHUB_BRANCH') || 'main';
// Override only for GitHub Enterprise or local testing
const apiBase = () => env('GITHUB_API_URL') || 'https://api.github.com';

export class GitHubError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function gh<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = env('GITHUB_TOKEN');
  if (!token) throw new GitHubError(503, 'Publishing is not set up yet: add GITHUB_TOKEN in Vercel.');

  const res = await fetch(`${apiBase()}/repos/${repo()}/${path}`, {
    ...init,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'vaibhavpasi-dashboard',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
    },
  });

  if (!res.ok) {
    const detail = ((await res.json().catch(() => ({}))) as { message?: string }).message ?? res.statusText;
    if (res.status === 401) throw new GitHubError(503, 'GITHUB_TOKEN is invalid or expired. Create a new one.');
    if (res.status === 403) throw new GitHubError(503, `GitHub refused the request: ${detail}`);
    throw new GitHubError(res.status, detail);
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}

const encodePath = (path: string) => path.split('/').map(encodeURIComponent).join('/');

interface ContentFile {
  name: string;
  path: string;
  sha: string;
  type: 'file' | 'dir';
  content?: string;
}

export async function listDir(dir: string) {
  try {
    return await gh<ContentFile[]>(`contents/${encodePath(dir)}?ref=${branch()}`);
  } catch (e) {
    if (e instanceof GitHubError && e.status === 404) return [];
    throw e;
  }
}

// Returns null when the file doesn't exist
export async function readFile(path: string): Promise<{ sha: string; text: string } | null> {
  try {
    const file = await gh<ContentFile>(`contents/${encodePath(path)}?ref=${branch()}`);
    return { sha: file.sha, text: Buffer.from(file.content ?? '', 'base64').toString('utf8') };
  } catch (e) {
    if (e instanceof GitHubError && e.status === 404) return null;
    throw e;
  }
}

// Creates or updates a file. Pass the current `sha` when updating: GitHub rejects the write
// (409) if someone else changed the file in the meantime, so edits are never silently lost.
export async function writeFile(path: string, base64: string, message: string, sha?: string) {
  const result = await gh<{ content: { sha: string }; commit: { sha: string } }>(`contents/${encodePath(path)}`, {
    method: 'PUT',
    body: JSON.stringify({ message, content: base64, branch: branch(), ...(sha ? { sha } : {}) }),
  });
  return { sha: result.content.sha, commit: result.commit.sha };
}

export async function deleteFile(path: string, sha: string, message: string) {
  await gh(`contents/${encodePath(path)}`, {
    method: 'DELETE',
    body: JSON.stringify({ message, sha, branch: branch() }),
  });
}
