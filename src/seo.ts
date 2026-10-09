import { posts, getPost } from './blog/posts';
import { getService } from './content/services';
import { faqs } from './components/FAQ';
import { featureHeadline, publications } from './components/Press';
import { parseRoute, sitePages, type PageKey } from './router';
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  PORTRAIT_URL,
  SHARE_IMAGE_URL,
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
const ORG_ID = `${SITE_URL}/#organization`;

// One consistent entity (same name, photo, profiles and company on every page) is what
// search engines need before they can show a knowledge panel for a person
const personSchema = {
  '@type': 'Person',
  '@id': PERSON_ID,
  name: person.name,
  givenName: person.givenName,
  familyName: person.familyName,
  url: SITE_URL,
  mainEntityOfPage: absoluteUrl('/about'),
  image: {
    '@type': 'ImageObject',
    '@id': `${SITE_URL}/#portrait`,
    url: PORTRAIT_URL,
    caption: person.name,
  },
  jobTitle: person.jobTitle,
  hasOccupation: person.jobTitle.split(/, | & /).map((name) => ({ '@type': 'Occupation', name })),
  description: DEFAULT_DESCRIPTION,
  email: `mailto:${person.email}`,
  nationality: { '@type': 'Country', name: person.country },
  homeLocation: { '@type': 'Country', name: person.country },
  worksFor: { '@id': ORG_ID },
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

// The company, linked both ways to the person (founder / worksFor)
const organizationSchema = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: person.organization.name,
  url: person.organization.url,
  founder: { '@id': PERSON_ID },
  employee: { '@id': PERSON_ID },
};

// `name` + `alternateName` tell Google which site name to show above the result (instead of the bare domain)
const websiteSchema = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  alternateName: ['Vaibhav Pasi Portfolio', 'vaibhavpasi.online'],
  description: DEFAULT_DESCRIPTION,
  publisher: { '@id': PERSON_ID },
  inLanguage: 'en',
};

const coverUrl = (cover: string) => {
  if (!cover) return SHARE_IMAGE_URL;
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

// Title, description and schema type for each standalone page
export const pageSeo: Record<PageKey, { name: string; title: string; description: string; type: string }> = {
  about: {
    name: 'About',
    title: 'About Vaibhav Pasi | Marketer, Developer & Co-Founder of 4AM Global Media',
    description:
      'The story of Vaibhav Pasi: from digital marketing in 2019 to co-founding 4AM Global Media. Background, skills, experience and the approach behind 100+ brands scaled.',
    type: 'ProfilePage',
  },
  services: {
    name: 'Services',
    title: 'Services: Growth Marketing, Ads, Websites & AI Automation | Vaibhav Pasi',
    description:
      'Digital marketing strategy, paid ads, content, SEO, websites, AI automation and quick-commerce onboarding, planned and run as one growth system.',
    type: 'WebPage',
  },
  work: {
    name: 'Work',
    title: 'Work & Case Studies | Vaibhav Pasi',
    description:
      'Selected projects and in-depth case studies from Vaibhav Pasi: brand growth, viral campaigns, e-commerce rebuilds and influencer strategy, with goals, plans and results.',
    type: 'CollectionPage',
  },
  'client-wins': {
    name: 'Client Wins',
    title: 'Client Wins: Real Results & Screenshots | Vaibhav Pasi',
    description:
      'Real client results: +67,471% impressions, a best reel of 3.1M views, 74 to 17.6K followers and more, each backed by the original analytics screenshot.',
    type: 'WebPage',
  },
  contact: {
    name: 'Contact',
    title: 'Contact Vaibhav Pasi | Start a Project',
    description: `Get in touch with Vaibhav Pasi about growth marketing, websites, AI automation or marketplace onboarding. Email ${person.email}.`,
    type: 'ContactPage',
  },
};

export function getSeo(pathname: string): Seo {
  const route = parseRoute(pathname);

  if (route.page in pageSeo) {
    const key = route.page as PageKey;
    const meta = pageSeo[key];
    const path = sitePages.find((p) => p.key === key)!.path;
    return {
      title: meta.title,
      description: meta.description,
      path,
      image: SHARE_IMAGE_URL,
      type: key === 'about' ? 'profile' : 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          websiteSchema,
          personSchema,
          organizationSchema,
          {
            '@type': meta.type,
            '@id': `${absoluteUrl(path)}#page`,
            url: absoluteUrl(path),
            name: meta.title,
            description: meta.description,
            isPartOf: { '@id': WEBSITE_ID },
            about: { '@id': PERSON_ID },
            ...(meta.type === 'ProfilePage' ? { mainEntity: { '@id': PERSON_ID } } : {}),
            inLanguage: 'en',
          },
          ...(key === 'contact'
            ? [
                {
                  '@type': 'FAQPage',
                  '@id': `${absoluteUrl(path)}#faq`,
                  mainEntity: faqs.map((f) => ({
                    '@type': 'Question',
                    name: f.question,
                    acceptedAnswer: { '@type': 'Answer', text: f.answer },
                  })),
                },
              ]
            : []),
          breadcrumbs([
            { name: 'Home', path: '/' },
            { name: meta.name, path },
          ]),
        ],
      },
    };
  }

  if (route.page === 'service') {
    const service = getService(route.slug);
    if (service) {
      const path = service.href;
      const url = absoluteUrl(path);
      const priceMatch = service.price.replace(/,/g, '').match(/\d+/);
      return {
        title: service.seo.title,
        description: service.seo.description || service.short,
        path,
        image: SHARE_IMAGE_URL,
        type: 'website',
        jsonLd: {
          '@context': 'https://schema.org',
          '@graph': [
            websiteSchema,
            personSchema,
            organizationSchema,
            {
              '@type': 'Service',
              '@id': `${url}#service`,
              name: service.title,
              serviceType: service.navTitle,
              description: service.intro,
              url,
              provider: { '@id': PERSON_ID },
              areaServed: { '@type': 'Country', name: 'India' },
              ...(service.seo.keywords ? { keywords: service.seo.keywords.join(', ') } : {}),
              ...(service.packages?.length
                ? {
                    // Package tiers as a price range, with each package listed
                    offers: {
                      '@type': 'AggregateOffer',
                      priceCurrency: 'INR',
                      lowPrice: Math.min(...service.packages.map((p) => Number(p.price.replace(/\D/g, '')))),
                      highPrice: Math.max(...service.packages.map((p) => Number(p.price.replace(/\D/g, '')))),
                      offerCount: service.packages.length,
                      offers: service.packages.map((p) => ({
                        '@type': 'Offer',
                        name: `${p.name} package`,
                        description: p.description,
                        price: p.price.replace(/\D/g, ''),
                        priceCurrency: 'INR',
                        priceSpecification: {
                          '@type': 'UnitPriceSpecification',
                          price: p.price.replace(/\D/g, ''),
                          priceCurrency: 'INR',
                          unitText: 'MONTH',
                        },
                        url: `${url}#pricing`,
                      })),
                    },
                  }
                : priceMatch
                ? {
                    offers: {
                      '@type': 'Offer',
                      priceCurrency: 'INR',
                      price: priceMatch[0],
                      description: service.priceNote,
                      url,
                    },
                  }
                : {}),
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: `${service.navTitle}: what's included`,
                itemListElement: service.deliverables.map((d) => ({
                  '@type': 'Offer',
                  itemOffered: { '@type': 'Service', name: d },
                })),
              },
            },
            ...(service.faqs.length
              ? [
                  {
                    '@type': 'FAQPage',
                    '@id': `${url}#faq`,
                    mainEntity: service.faqs.map((f) => ({
                      '@type': 'Question',
                      name: f.question,
                      acceptedAnswer: { '@type': 'Answer', text: f.answer },
                    })),
                  },
                ]
              : []),
            breadcrumbs([
              { name: 'Home', path: '/' },
              { name: 'Services', path: '/services' },
              { name: service.navTitle, path },
            ]),
          ],
        },
      };
    }
  }

  if (route.page === 'blog') {
    return {
      title: 'Blog: Growth Marketing, AI & E-commerce Insights | Vaibhav Pasi',
      description:
        'Playbooks and lessons from Vaibhav Pasi on growth marketing, viral content, AI automation, quick commerce and building brands that scale.',
      path: '/blog',
      image: SHARE_IMAGE_URL,
      type: 'website',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          websiteSchema,
          personSchema,
          organizationSchema,
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
            organizationSchema,
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
    image: SHARE_IMAGE_URL,
    type: 'profile',
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        websiteSchema,
        personSchema,
        organizationSchema,
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
