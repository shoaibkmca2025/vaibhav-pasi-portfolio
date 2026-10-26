import type { CSSProperties, ReactNode } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronRight } from 'lucide-react';
import { onLinkClick } from '../router';
import TeamPortrait from '../components/TeamPortrait';
import { COMPANY_URL, team, type TeamMember } from '../content/team';
import NotFoundPage from './NotFoundPage';

const firstName = (m: TeamMember) => m.name.split(' ')[0];
const roleOnly = (m: TeamMember) => m.designation.replace(/\s+—\s+4AM Global Media$/, '');

// Two-column editorial section: label column (sticky on desktop) beside the reading column
function ProfileSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-t border-white/5 px-5 py-14 sm:px-6 md:px-12 md:py-20 lg:px-24">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-12 lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start" data-reveal="up">
          <span className="mb-4 block h-px w-full max-w-[12rem] bg-white/10" aria-hidden>
            <span className="gold-line block h-px w-12 bg-accent" />
          </span>
          <h2 id={id} className="text-2xl font-black tracking-tight md:text-3xl">
            {title}
          </h2>
        </div>
        <div className="lg:col-span-8" data-reveal="up" style={{ '--i': 1 } as CSSProperties}>
          {children}
        </div>
      </div>
    </section>
  );
}

// Each team member's own page: /team/<id>. All content comes from src/content/team.ts;
// sections without real content are not shown.
export default function TeamMemberPage({ slug }: { slug: string }) {
  const index = team.findIndex((m) => m.id === slug);
  if (index < 0) return <NotFoundPage />;

  const m = team[index];
  const prev = team[(index - 1 + team.length) % team.length];
  const next = team[(index + 1) % team.length];
  const others = team.filter((t) => t.id !== m.id);
  const confirmed = m.profileDetailsConfirmed;
  const links = [
    ...(m.portfolioUrl ? [{ label: 'Portfolio', href: m.portfolioUrl }] : []),
    ...(m.socialLinks ?? []).filter((l) => l.href),
  ];
  const facts = [
    { label: 'Role', value: roleOnly(m) },
    { label: 'Team', value: '4AM Global Media' },
    ...(m.experienceLabel ? [{ label: 'Experience', value: m.experienceLabel.replace(/ of experience$/, '') }] : []),
    ...(m.expertise.length ? [{ label: 'Focus', value: m.expertise.slice(0, 2).join(' · ') }] : []),
  ];

  return (
    <main id="main" tabIndex={-1} className="team-motion outline-none">
      {/* ── Hero ── */}
      <header className="relative overflow-clip px-5 pb-14 pt-28 sm:px-6 md:px-12 md:pb-20 md:pt-36 lg:px-24">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(226,169,59,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(226,169,59,0.3) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
          <div className="absolute -left-24 top-20 h-[320px] w-[320px] rounded-full bg-brand-yellow/5 blur-[90px] md:h-[520px] md:w-[520px] md:blur-[140px]" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <nav aria-label="Breadcrumb" className="mb-8 md:mb-12">
            <ol className="flex flex-wrap items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-500">
              <li>
                <a href="/" onClick={onLinkClick} className="transition-colors hover:text-accent">
                  Home
                </a>
              </li>
              <ChevronRight className="h-3 w-3" aria-hidden />
              <li>
                <a href="/team" onClick={onLinkClick} className="transition-colors hover:text-accent">
                  4AM Team
                </a>
              </li>
              <ChevronRight className="h-3 w-3" aria-hidden />
              <li aria-current="page" className="text-accent">
                {m.name}
              </li>
            </ol>
          </nav>

          <div className="grid items-center gap-10 md:grid-cols-12 lg:gap-16">
            <div className="hero-parallax md:col-span-5">
              <div className="reveal relative mx-auto aspect-[4/5] min-h-0 max-w-sm overflow-clip rounded-[2rem] border border-white/10 bg-brand-muted shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)] md:max-w-none">
                <TeamPortrait member={m} eager />
              </div>
            </div>

            <div className="md:col-span-7">
              <span className="eyebrow reveal mb-6" style={{ '--d': '80ms' } as CSSProperties}>
                4AM Global Media
              </span>
              <h1 className="text-5xl font-black leading-[0.92] tracking-tighter sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
                <span className="hero-line">
                  <span style={{ '--l': 0 } as CSSProperties}>{m.name}</span>
                </span>
              </h1>
              <p className="reveal mt-4 text-lg font-semibold leading-snug text-accent md:text-xl" style={{ '--d': '260ms' } as CSSProperties}>
                {roleOnly(m)}
              </p>
              <div className="rule-draw mt-6 h-[3px] w-14 rounded-full bg-gradient-to-r from-accent to-coral" style={{ '--d': '320ms' } as CSSProperties} aria-hidden />
              <p className="reveal mt-6 max-w-2xl text-lg leading-relaxed text-gray-300 md:text-xl" style={{ '--d': '380ms' } as CSSProperties}>
                {m.shortDescription}
              </p>

              <dl className="reveal mt-8 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-6 sm:grid-cols-4" style={{ '--d': '460ms' } as CSSProperties}>
                {facts.map((f) => (
                  <div key={f.label}>
                    <dt className="text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-gray-500">{f.label}</dt>
                    <dd className="mt-1 text-sm font-semibold leading-snug">{f.value}</dd>
                  </div>
                ))}
              </dl>

              {links.length > 0 && (
                <ul className="reveal mt-8 flex flex-wrap gap-3" style={{ '--d': '540ms' } as CSSProperties}>
                  {links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white/15 px-5 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
                      >
                        {l.label}
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                        <span className="sr-only">: {m.name} (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </header>

      {confirmed ? (
        <>
          {/* ── About ── */}
          {m.biography.length > 0 && (
            <ProfileSection id="profile-about" title={`About ${firstName(m)}`}>
              <div className="max-w-3xl space-y-5 text-base leading-[1.8] text-gray-300 md:text-lg">
                {m.biography.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>
            </ProfileSection>
          )}

          {/* ── Role ── */}
          {m.roleAt4AM && (
            <ProfileSection id="profile-role" title="Role at 4AM Global Media">
              <p className="max-w-3xl text-base leading-[1.8] text-gray-300 md:text-lg">{m.roleAt4AM}</p>
            </ProfileSection>
          )}

          {/* ── Expertise ── */}
          {m.expertise.length > 0 && (
            <ProfileSection id="profile-expertise" title="Areas of Expertise">
              <ol className="grid gap-x-8 sm:grid-cols-2" data-reveal-stagger style={{ '--reveal-dist': '8px' } as CSSProperties}>
                {m.expertise.map((tag, i) => (
                  <li key={tag} className="flex items-baseline gap-4 border-b border-white/10 py-4">
                    <span className="w-7 shrink-0 text-xs font-bold tabular-nums text-accent">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-base font-semibold md:text-lg">{tag}</span>
                  </li>
                ))}
              </ol>
            </ProfileSection>
          )}

          {/* ── Quote ── */}
          {m.quote && (
            <section aria-label={`${firstName(m)}'s philosophy`} className="border-t border-white/5 px-5 py-16 sm:px-6 md:px-12 md:py-24 lg:px-24">
              <figure className="mx-auto max-w-4xl text-center" data-reveal-stagger>
                <span className="block font-serif text-6xl leading-none text-accent md:text-7xl" aria-hidden>
                  “
                </span>
                <blockquote className="mt-2 text-3xl font-black leading-tight tracking-tight md:text-5xl">{m.quote}</blockquote>
                <figcaption className="mt-6 text-sm font-semibold text-gray-400">
                  {m.name} <span className="text-gray-600">·</span> {roleOnly(m)}
                </figcaption>
              </figure>
            </section>
          )}
        </>
      ) : (
        <ProfileSection id="profile-about" title={`About ${firstName(m)}`}>
          <p className="max-w-2xl rounded-2xl border border-dashed border-white/15 px-5 py-4 text-gray-400">
            {firstName(m)} is part of the 4AM Global Media team. A detailed profile will be added soon.
          </p>
        </ProfileSection>
      )}

      {/* ── Previous / next ── */}
      <nav aria-label="Team profiles" className="border-t border-white/5 px-5 py-10 sm:px-6 md:px-12 lg:px-24">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2" data-reveal-stagger>
          {[
            { dir: 'Previous', person: prev, Icon: ArrowLeft },
            { dir: 'Next', person: next, Icon: ArrowRight },
          ].map(({ dir, person, Icon }) => (
            <a
              key={dir}
              href={`/team/${person.id}`}
              onClick={onLinkClick}
              className={`group flex items-center gap-4 rounded-2xl border border-white/10 p-4 transition-colors hover:border-accent/40 ${dir === 'Next' ? 'sm:flex-row-reverse sm:text-right' : ''}`}
            >
              <span className="h-16 w-14 shrink-0 overflow-clip rounded-xl border border-white/10">
                <TeamPortrait member={person} />
              </span>
              <span className="min-w-0 flex-1">
                <span className={`flex items-center gap-1.5 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-gray-500 ${dir === 'Next' ? 'sm:justify-end' : ''}`}>
                  {dir === 'Previous' && <Icon className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden />}
                  {dir}
                  {dir === 'Next' && <Icon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />}
                </span>
                <span className="mt-1 block truncate text-lg font-black tracking-tight transition-colors group-hover:text-accent">{person.name}</span>
                <span className="block truncate text-sm text-gray-400">{roleOnly(person)}</span>
              </span>
            </a>
          ))}
        </div>
      </nav>

      {/* ── The rest of the team ── */}
      <section aria-labelledby="profile-others" className="border-t border-white/5 px-5 py-14 sm:px-6 md:px-12 md:py-20 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 id="profile-others" className="text-3xl font-black tracking-tight md:text-4xl">
              Meet the Rest of the Team
            </h2>
            <a href="/team" onClick={onLinkClick} className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent link-underline">
              All team members <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
          <ul className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4" data-reveal-stagger>
            {others.map((o) => (
              <li key={o.id}>
                <a href={`/team/${o.id}`} onClick={onLinkClick} className="group block">
                  <span className="block aspect-[4/5] min-h-0 overflow-clip rounded-2xl border border-white/10 transition-colors group-hover:border-accent/40">
                    <span className="block h-full w-full transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]">
                      <TeamPortrait member={o} drift />
                    </span>
                  </span>
                  <h3 className="mt-3 text-base font-black tracking-tight transition-colors group-hover:text-accent md:text-lg">{o.name}</h3>
                  <span className="mt-0.5 block text-xs leading-snug text-gray-400 md:text-sm">{roleOnly(o)}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-5 pb-16 sm:px-6 md:px-12 md:pb-24 lg:px-24" aria-labelledby="profile-cta">
        <div
          className="relative mx-auto max-w-7xl overflow-clip rounded-[2rem] border border-accent/25 bg-gradient-to-br from-brand-dark-gray via-brand-black to-brand-dark-gray px-6 py-12 text-center sm:px-12 md:py-16"
          data-reveal="up"
          data-reveal-stagger
        >
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-brand-yellow/10 blur-[100px]" aria-hidden />
          <h2 id="profile-cta" className="relative text-3xl font-black leading-[0.95] tracking-tighter md:text-5xl">
            Have an Idea Worth Building?
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-base leading-relaxed text-gray-400 md:text-lg">
            Let&apos;s bring strategy, creativity and technology together to build something meaningful.
          </p>
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <a href="/contact" onClick={onLinkClick} className="btn-primary group" data-track="profile_work_with_vaibhav">
              Work With Vaibhav <ArrowRight className="arrow-nudge h-4 w-4" aria-hidden />
            </a>
            <a href={COMPANY_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary group hover:border-accent" data-track="profile_explore_4am">
              Explore 4AM Global Media <ArrowUpRight className="arrow-nudge arrow-nudge-out h-4 w-4" aria-hidden />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
