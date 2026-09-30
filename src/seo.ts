import { posts, getPost } from './blog/posts';
import { faqs } from './components/FAQ';
import { featureHeadline, publications } from './components/Press';
import { parseRoute } from './router';
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  PORTRAIT_URL,
  person,
  absoluteUrl,
} from './site';
import { unsplashAt } from './image';

export interface Seo {
  title: string;
  description: string;
  path: string;
  image: string;
  type: 'website' | 'article' | 'profile';
  publishedTime?: string;
  jsonLd: object;
}

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const personSchema = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: person.name,
  url: SITE_URL,
  image: PORTRAIT_URL,
  jobTitle: person.jobTitle,
  description: DEFAULT_DESCRIPTION,
  email: `mailto:${person.email}`,
  nationality: { '@type': 'Country', name: person.country },
  worksFor: { '@type': 'Organization', name: person.organization.name, url: person.organization.url },
  knowsAbout: person.knowsAbout,
  sameAs: person.sameAs,
  // Press coverage is a strong trust signal for search and AI engines
  subjectOf: publications.map((pub) => ({
    '@type': 'NewsArticle',
    headline: featureHeadline,
    url: pub.href,
    datePublished: '2026-05-19',
    publisher: { '@type': 'Organization', name: pub.name },
  })),
};

const websiteSchema = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  publisher: { '@id': PERSON_ID },
  inLanguage: 'en',
};

const coverUrl = (cover: string) => {
  if (!cover) return PORTRAIT_URL;
  if (cover.includes('images.unsplash.com')) return unsplashAt(cover, 1200);
  return cover.startsWith('http') ? cover : absoluteUrl(cover);
};

const breadcrumbs = (items: { name: string; path: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

export function getSeo(pathname: string): Seo {
  const route = parseRoute(pathname);

  if (route.page === 'blog') {
    return {
      title: 'Blog: Growth Marketing, AI & E-commerce Insights | Vaibhav Pasi',
      description:
        'Playbooks and lessons from Vaibhav Pasi on growth marketing, viral content, AI automation, quick commerce and building brands that scale.',
      path: '/blog',
      image: PORTRAIT_URL,
      type: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          websiteSchema,
          personSchema,
          {
            '@type': 'Blog',
            '@id': `${SITE_URL}/blog#blog`,
            url: absoluteUrl('/blog'),
            name: 'The Journal by Vaibhav Pasi',
            author: { '@id': PERSON_ID },
            blogPost: posts.map((p) => ({
              '@type': 'BlogPosting',
              headline: p.title,
              url: absoluteUrl(`/blog/${p.slug}`),
              datePublished: p.date,
            })),
          },
          breadcrumbs([
            { name: 'Home', path: '/' },
            { name: 'Blog', path: '/blog' },
          ]),
        ],
      },
    };
  }

  if (route.page === 'post') {
    const post = getPost(route.slug);
    if (post) {
      const url = absoluteUrl(`/blog/${post.slug}`);
      return {
        title: `${post.title} | Vaibhav Pasi`,
        description: post.excerpt || DEFAULT_DESCRIPTION,
        path: `/blog/${post.slug}`,
        image: coverUrl(post.cover),
        type: 'article',
        publishedTime: post.date,
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            websiteSchema,
            personSchema,
            {
              '@type': 'BlogPosting',
              '@id': `${url}#article`,
              mainEntityOfPage: url,
              url,
              headline: post.title,
              description: post.excerpt,
              image: coverUrl(post.cover),
              datePublished: post.date,
              dateModified: post.date,
              articleSection: post.category,
              keywords: post.tags.join(', '),
              wordCount: post.wordCount,
              author: { '@id': PERSON_ID },
              publisher: { '@id': PERSON_ID },
              isPartOf: { '@id': `${SITE_URL}/blog#blog` },
              inLanguage: 'en',
            },
            breadcrumbs([
              { name: 'Home', path: '/' },
              { name: 'Blog', path: '/blog' },
              { name: post.title, path: `/blog/${post.slug}` },
            ]),
          ],
        },
      };
    }
  }

  return {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    path: '/',
    image: PORTRAIT_URL,
    type: 'profile',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        websiteSchema,
        personSchema,
        {
          '@type': 'ProfilePage',
          '@id': `${SITE_URL}/#profile`,
          url: SITE_URL,
          name: DEFAULT_TITLE,
          mainEntity: { '@id': PERSON_ID },
          isPartOf: { '@id': WEBSITE_ID },
        },
        {
          '@type': 'FAQPage',
          '@id': `${SITE_URL}/#faq`,
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        },
      ],
    },
  };
}

const escapeAttr = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Head tags written into each prerendered HTML file at build time
export function renderHead(seo: Seo) {
  const url = absoluteUrl(seo.path);
  const tags = [
    `<title>${escapeAttr(seo.title)}</title>`,
    `<meta name="description" content="${escapeAttr(seo.description)}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />`,
    `<meta name="author" content="${person.name}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:type" content="${seo.type}" />`,
    `<meta property="og:title" content="${escapeAttr(seo.title)}" />`,
    `<meta property="og:description" content="${escapeAttr(seo.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${escapeAttr(seo.image)}" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeAttr(seo.title)}" />`,
    `<meta name="twitter:description" content="${escapeAttr(seo.description)}" />`,
    `<meta name="twitter:image" content="${escapeAttr(seo.image)}" />`,
  ];
  if (seo.publishedTime) {
    tags.push(`<meta property="article:published_time" content="${seo.publishedTime}" />`);
    tags.push(`<meta property="article:author" content="${person.name}" />`);
  }
  tags.push(
    `<script type="application/ld+json">${JSON.stringify(seo.jsonLd).replace(/</g, '\\u003c')}</script>`,
  );
  return tags.join('\n    ');
}

// Keeps the tab title, description and canonical in sync when navigating inside the app
export function applySeo(seo: Seo) {
  document.title = seo.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', seo.description);
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', absoluteUrl(seo.path));
}
