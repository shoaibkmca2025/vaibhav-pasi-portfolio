import type { ReactNode } from 'react';
import { contactEmail, contactHref } from '../contact';
import { PageHero } from './PageParts';

// Plain-language policies describing what this site actually does with data.
// Update them whenever an integration is added or removed (see api/_lib/integrations.ts and src/lib/analytics.ts).
const UPDATED = '9 October 2026';

function LegalBody({ children }: { children: ReactNode }) {
  return (
    <section className="section-padding">
      <div className="max-w-3xl mx-auto text-gray-300 leading-relaxed space-y-5 [&_h2]:mt-12 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-white [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_a]:text-accent [&_a]:underline">
        <p className="text-sm text-gray-500">Last updated: {UPDATED}</p>
        {children}
      </div>
    </section>
  );
}

export function PrivacyPage() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHero page="privacy" title="Privacy Policy" intro="What information this website collects, why, and what you can ask me to do with it." />
      <LegalBody>
        <p>
          This website (vaibhavpasi.online) is run by Vaibhav Pasi, Co-Founder of 4AM Global Media, based in India. For any
          privacy question or request, email <a href={contactHref}>{contactEmail}</a>.
        </p>

        <h2>What I collect</h2>
        <ul>
          <li>
            <strong>Enquiry form:</strong> the details you type in (name, email and/or phone number, company or project,
            service, budget, timeline and your message), plus the page you sent it from.
          </li>
          <li>
            <strong>Emails, calls and WhatsApp messages</strong> you send me directly.
          </li>
          <li>
            <strong>Analytics (only if enabled):</strong> Google Analytics 4 may record pages visited, device and browser type,
            approximate location, and clicks on buttons such as WhatsApp or booking links. IP anonymisation is requested.
          </li>
          <li>
            <strong>Your browser:</strong> your light or dark theme choice and whether you have seen the intro animation are
            saved in your own browser's storage. They are not sent to me.
          </li>
        </ul>

        <h2>Why</h2>
        <p>
          To reply to your enquiry, prepare a proposal, deliver agreed work, and understand which parts of the site are useful.
          I do not sell your data or use it for unrelated advertising.
        </p>

        <h2>Who processes it</h2>
        <p>Depending on how the site is configured, enquiries may be handled by these services on my behalf:</p>
        <ul>
          <li>Vercel (website hosting and form processing)</li>
          <li>Supabase (storing enquiries)</li>
          <li>Resend (sending notification and confirmation emails)</li>
          <li>An automation workflow (for example n8n) that adds enquiries to my CRM or spreadsheet</li>
          <li>Google Analytics (site analytics, if enabled)</li>
        </ul>
        <p>
          Links to WhatsApp, Instagram, LinkedIn and other platforms take you to those services, whose own privacy policies
          apply. Instagram images on this site are copied from my public profile.
        </p>

        <h2>How long I keep it</h2>
        <p>
          Enquiries are kept for as long as needed to respond and, if we work together, for the length of the engagement and any
          record-keeping required by law. You can ask me to delete your enquiry at any time.
        </p>

        <h2>Your choices</h2>
        <p>
          You can ask to see, correct or delete the information I hold about you by emailing{' '}
          <a href={contactHref}>{contactEmail}</a>. You can block analytics with your browser's privacy settings or an
          ad blocker without affecting how the site works.
        </p>

        <h2>Changes</h2>
        <p>If this policy changes, the updated version will be posted here with a new date.</p>
      </LegalBody>
    </main>
  );
}

export function TermsPage() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <PageHero page="terms" title="Terms of Service" intro="The basic terms for using this website and for the information on it." />
      <LegalBody>
        <p>
          By using vaibhavpasi.online you agree to these terms. Questions: <a href={contactHref}>{contactEmail}</a>.
        </p>

        <h2>Information on this site</h2>
        <p>
          Articles, guides and service descriptions are general information, not professional advice for your specific
          situation. Prices shown are starting points; the final scope and price for any project are agreed in writing before
          work begins.
        </p>

        <h2>Results</h2>
        <p>
          Case studies and client results describe past work. Every business is different, and no particular ranking, reach,
          lead volume or revenue outcome is guaranteed.
        </p>

        <h2>Engagements</h2>
        <p>
          Paid work is covered by a separate proposal or agreement, which sets out deliverables, timelines, payment terms and
          ownership. If that agreement conflicts with these terms, the agreement applies.
        </p>

        <h2>Content and trademarks</h2>
        <p>
          The text, design and images on this site belong to Vaibhav Pasi or are used with permission. Publication names and
          logos in the press section belong to their owners and are shown only to identify where coverage appeared.
        </p>

        <h2>Third-party links</h2>
        <p>Links to other websites are provided for convenience. I am not responsible for their content or policies.</p>

        <h2>Liability</h2>
        <p>
          The site is provided as it is. To the extent the law allows, I am not liable for losses arising from use of the site
          or reliance on its general information.
        </p>

        <h2>Governing law</h2>
        <p>These terms are governed by the laws of India.</p>
      </LegalBody>
    </main>
  );
}
