import Constants from 'expo-constants';

const extra = (Constants.expoConfig?.extra ?? {}) as { siteUrl?: string; eas?: { projectId?: string } };

// The website is the backend: articles come from its static feed, publishing goes through its API.
// For local testing against `npm run dev`, set EXPO_PUBLIC_SITE_URL=http://<your-computer-ip>:3000
export const SITE_URL = (process.env.EXPO_PUBLIC_SITE_URL || extra.siteUrl || 'https://www.vaibhavpasi.online').replace(/\/$/, '');

export const EAS_PROJECT_ID = extra.eas?.projectId || Constants.easConfig?.projectId || '';

export const BRAND = {
  name: 'Vaibhav Pasi',
  tagline: 'Tech x Marketing',
};

export const articleUrl = (slug: string) => `${SITE_URL}/blog/${slug}`;
export const absoluteUrl = (path: string) => (path.startsWith('/') ? `${SITE_URL}${path}` : path);
