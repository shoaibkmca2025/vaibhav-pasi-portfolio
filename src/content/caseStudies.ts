// Case studies built only from verified client results (screenshots in /public/wins).
// Client names are kept private. Add new case studies here; every field is shown on /case-studies.

export interface CaseStudy {
  slug: string;
  client: string;
  category: string;
  headline: string;
  challenge: string;
  approach: string[];
  built: string[];
  stack: string[];
  outcome: { value: string; label: string }[];
  // Before → after series for the view-count board (optional)
  board?: { before: number[]; after: string[]; bestBefore: number; bestAfter: number; icon: 'eye' | 'play' };
  screenshots: { src: string; alt: string }[];
  cta: { label: string; service: string };
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'creator-reach-3m',
    client: 'Creator B (personal brand)',
    category: 'Short-form video growth',
    headline: 'From ~1K views per reel to a 3.1M-view reel',
    challenge: 'Reels were consistently landing between roughly 640 and 1,075 views, with no clear pattern for what worked.',
    approach: [
      'Reviewed recent content to find hooks and formats worth repeating',
      'Refined the core message and on-camera delivery',
      'Committed to a consistent posting rhythm and iterated on each result',
    ],
    built: ['Content direction and hook structure', 'Posting rhythm', 'Review loop on performance'],
    stack: ['Instagram', 'TikTok', 'Short-form video'],
    outcome: [
      { value: '3.1M', label: 'Best reel views' },
      { value: '999.8K', label: 'Second-best reel' },
      { value: '1,075', label: 'Previous best reel' },
    ],
    board: { before: [643, 1075, 991, 722], after: ['3.1M', '999.8K', '174.6K', '127.9K'], bestBefore: 1075, bestAfter: 3_100_000, icon: 'play' },
    screenshots: [{ src: '/wins/reels-creator-b.jpg', alt: 'Reel view counts before (643 to 1,075) and after (127.9K to 3.1M)' }],
    cta: { label: 'Start a Similar Project', service: 'Digital Marketing' },
  },
  {
    slug: 'creator-reach-28k',
    client: 'Creator A (personal brand)',
    category: 'Short-form video growth',
    headline: 'Best reel grew from 661 to 28K views',
    challenge: 'Reels were stuck in the 400–700 view range, reaching mostly existing followers.',
    approach: ['Sharpened hooks and first seconds of each reel', 'Tightened the content focus around one audience', 'Consistent publishing with review after each post'],
    built: ['Hook and format playbook', 'Content focus', 'Publishing rhythm'],
    stack: ['Instagram', 'Short-form video'],
    outcome: [
      { value: '28K', label: 'Best reel views' },
      { value: '4,055', label: 'Second-best reel' },
      { value: '661', label: 'Previous best reel' },
    ],
    board: { before: [433, 513, 461, 661], after: ['28K', '4,055', '3,038', '2,931'], bestBefore: 661, bestAfter: 28_000, icon: 'eye' },
    screenshots: [{ src: '/wins/reels-creator-a.jpg', alt: 'Reel view counts before (433 to 661) and after (2,931 to 28K)' }],
    cta: { label: 'Start a Similar Project', service: 'Digital Marketing' },
  },
  {
    slug: 'personal-brand-profile-growth',
    client: 'Personal-brand creator',
    category: 'Personal brand growth',
    headline: 'Instagram from 74 to 17.6K followers; TikTok from 1,010 to 56.6K',
    challenge: 'A new personal brand with a small audience on both Instagram and TikTok.',
    approach: ['Clear positioning of who the content is for', 'Value-first content mixed with personal content', 'Consistent cross-posting on Instagram and TikTok'],
    built: ['Positioning and bio', 'Content pillars', 'Cross-platform publishing routine'],
    stack: ['Instagram', 'TikTok'],
    outcome: [
      { value: '17.6K', label: 'Instagram followers (from 74)' },
      { value: '56.6K', label: 'TikTok followers (from 1,010)' },
      { value: '514.8K', label: 'TikTok likes (from 8,771)' },
    ],
    screenshots: [{ src: '/wins/profile-growth.jpg', alt: 'Instagram and TikTok profile stats before and after' }],
    cta: { label: 'Grow My Personal Brand', service: 'Digital Marketing' },
  },
  {
    slug: 'account-analytics-lift',
    client: 'Client account',
    category: 'Content & distribution',
    headline: 'Impressions up 67,471% over 90 days',
    challenge: 'An account with very low baseline reach and views in the previous 90 days.',
    approach: ['Regular publishing of search- and share-friendly content', 'Doubling down on formats that produced spikes', 'Monitoring 28- and 90-day analytics to steer the plan'],
    built: ['Content plan', 'Publishing cadence', 'Analytics review routine'],
    stack: ['Platform analytics'],
    outcome: [
      { value: '127,710', label: 'Impressions in 90 days (+67,471%)' },
      { value: '8,740', label: 'Views in 90 days (+14,968%)' },
      { value: '613 hrs', label: 'Watch time in 28 days (+300%)' },
    ],
    screenshots: [
      { src: '/wins/analytics-90d.jpg', alt: 'Analytics: 127,710 impressions and 8,740 views over 90 days' },
      { src: '/wins/analytics-likes-views.jpg', alt: 'Analytics: 463 likes and 14.5K views over 28 days' },
      { src: '/wins/analytics-watch-time.jpg', alt: 'Analytics: 23.6K views and 613 hours watch time over 28 days' },
    ],
    cta: { label: 'Grow My Reach', service: 'Digital Marketing' },
  },
];
