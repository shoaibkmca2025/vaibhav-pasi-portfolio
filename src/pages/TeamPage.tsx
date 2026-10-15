import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, ChevronRight, Compass, Cpu, Megaphone, Quote, Sparkles, X } from 'lucide-react';
import { onLinkClick } from '../router';
import { COMPANY_URL, team, teamPillars, teamShowcase, type TeamMember } from '../content/team';

/* ─────────────── helpers ─────────────── */
const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const pillarIcons = [Compass, Cpu, Megaphone, Sparkles];
const MAX_TAGS = 4;

// Portrait, or an initials monogram until a real photo is supplied in src/content/team.ts
function Portrait({ member, eager = false, className = '' }: { member: TeamMember; eager?: boolean; className?: string }) {
  if (member.portrait) {
    return (
      <img
        src={member.portrait}
        alt={`Portrait of ${member.name}, ${member.designation}`}
        width={800}
        height={1000}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={`h-full w-full object-cover object-top ${className}`}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={`${member.name}: photo coming soon`}
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-muted via-brand-dark-gray to-brand-black ${className}`}
    >
      <span className="select-none text-5xl font-black tracking-tighter text-accent/80" aria-hidden>
        {initials(member.name)}
      </span>
    </div>
  );
}

/* ─────────────── profile sheet ───────────────
   Native <dialog> opened with showModal(): the browser makes the page behind it inert, keeps
   focus inside, and closes it on Escape. It also closes from the X button or a click on the
   backdrop, and focus returns to the "View Profile" button that opened it.
   Centred panel on desktop, bottom sheet on phones (styles: .profile-sheet in index.css).
   Every profile is in the page HTML, so search engines can read it. */
function ProfileSheet({ member, open, onClose }: { member: TeamMember; open: boolean; onClose: () => void; key?: string }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const titleId = `profile-${member.id}-title`;
  const links = [
    ...(member.portfolioUrl ? [{ label: 'Portfolio', href: member.portfolioUrl }] : []),
    ...(member.socialLinks ?? []).filter((l) => l.href),
  ];

  return (
    <dialog
      ref={ref}
      id={`profile-${member.id}`}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose(); // click on the backdrop
      }}
      className="profile-sheet"
    >
      <div className="flex max-h-[inherit] flex-col md:flex-row">
        {/* Portrait: banner on phones, side panel on desktop */}
        <div className="relative h-56 shrink-0 overflow-hidden bg-brand-muted sm:h-72 md:h-auto md:w-[42%]">
          <Portrait member={member} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-brand-dark-gray to-transparent md:hidden" aria-hidden />
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <header className="flex items-start justify-between gap-4 border-b border-white/10 px-6 pb-5 pt-6 md:px-8 md:pt-8">
            <div>
              <h2 id={titleId} className="text-3xl font-black leading-tight tracking-tight md:text-4xl">
                {member.name}
              </h2>
              <p className="mt-1.5 text-sm font-semibold leading-snug text-accent">{member.designation}</p>
              {member.experienceLabel && <p className="mt-1 text-xs font-bold uppercase tracking-widest text-gray-500">{member.experienceLabel}</p>}
            </div>
            <button
              type="button"
              autoFocus
              onClick={onClose}
              aria-label={`Close ${member.name}'s profile`}
              className="-mr-2 -mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-gray-300 transition-colors hover:border-accent hover:text-accent"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </header>

          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain px-6 py-6 text-[0.95rem] leading-relaxed text-gray-300 md:px-8 md:py-7">
            <p className="text-base text-white md:text-lg">{member.shortDescription}</p>

            {member.profileDetailsConfirmed ? (
              <>
                {member.biography.length > 0 && (
                  <section className="space-y-3">
                    {member.biography.map((p) => (
                      <p key={p.slice(0, 40)}>{p}</p>
                    ))}
                  </section>
                )}
                {member.roleAt4AM && (
                  <section>
                    <h3 className="mb-2 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-gray-500">Role at 4AM Global Media</h3>
                    <p>{member.roleAt4AM}</p>
                  </section>
                )}
                {member.expertise.length > 0 && (
                  <section>
                    <h3 className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-gray-500">Areas of expertise</h3>
                    <ul className="flex flex-wrap gap-2">
                      {member.expertise.map((tag) => (
                        <li key={tag} className="rounded-full border border-accent/25 bg-accent/[0.06] px-3 py-1.5 text-xs font-medium text-gray-200">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
                {member.quote && (
                  <blockquote className="flex gap-3 border-l-2 border-accent pl-4 italic text-gray-200">
                    <Quote className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden />
                    <p>“{member.quote}”</p>
                  </blockquote>
                )}
              </>
            ) : (
              <p className="rounded-2xl border border-dashed border-white/15 px-4 py-3 text-sm text-gray-400">
                A detailed profile for {member.name.split(' ')[0]} will be added soon.
              </p>
            )}

            {links.length > 0 && (
              <ul className="flex flex-wrap gap-3 border-t border-white/10 pt-5">
                {links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white/15 px-4 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
                    >
                      {l.label}
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                      <span className="sr-only">: {member.name} (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}

/* ─────────────── card ─────────────── */
function TeamCard({ member, onOpen }: { member: TeamMember; onOpen: (trigger: HTMLButtonElement) => void }) {
  const tags = member.expertise.slice(0, MAX_TAGS);
  return (
    <article
      aria-labelledby={`${member.id}-name`}
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-brand-dark-gray/40 transition-[border-color,transform,box-shadow] duration-300 ease-out hover:border-accent/40 hover:shadow-[0_24px_48px_-24px_rgba(0,0,0,0.6)] focus-within:border-accent/60 motion-safe:hover:-translate-y-1"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-brand-muted">
        <div className="h-full w-full transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.03]">
          <Portrait member={member} />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 to-transparent" aria-hidden />
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-7">
        <h3 id={`${member.id}-name`} className="text-2xl font-black leading-tight tracking-tight">
          {member.name}
        </h3>
        <p className="mt-1.5 text-sm font-semibold leading-snug text-accent">{member.designation}</p>
        <p className="mt-4 line-clamp-2 text-[0.95rem] leading-relaxed text-gray-400">{member.shortDescription}</p>

        {tags.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${member.name}: key expertise`}>
            {tags.map((tag) => (
              <li key={tag} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-gray-300">
                {tag}
              </li>
            ))}
          </ul>
        )}

        {/* The button's ::after covers the card, so the whole card opens the profile
            while there is still exactly one focusable control per card */}
        <div className="mt-auto pt-6">
          <button
            type="button"
            onClick={(e) => onOpen(e.currentTarget)}
            aria-haspopup="dialog"
            aria-controls={`profile-${member.id}`}
            data-track="team_view_profile"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white transition-colors after:absolute after:inset-0 after:rounded-[1.75rem] after:content-[''] group-hover:text-accent focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-accent"
          >
            View Profile
            <span className="sr-only">: {member.name}</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </button>
        </div>
      </div>
    </article>
  );
}

/* ─────────────── page ─────────────── */
export default function TeamPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const openProfile = (id: string, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setOpenId(id);
  };
  const closeProfile = () => {
    setOpenId(null);
    // Return focus to the card that opened the sheet
    requestAnimationFrame(() => triggerRef.current?.focus({ preventScroll: true }));
  };

  return (
    <main id="main" tabIndex={-1} className="outline-none">
      {/* ── 1. Hero ── */}
      <header className="relative overflow-hidden border-b border-white/5 px-5 pb-14 pt-28 sm:px-6 md:px-12 md:pb-20 md:pt-36 lg:px-24">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(214,182,117,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(214,182,117,0.3) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
          <div className="absolute -right-24 -top-24 h-[320px] w-[320px] rounded-full bg-brand-yellow/5 blur-[80px] md:h-[520px] md:w-[520px] md:blur-[140px]" />
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
                <a href="/about" onClick={onLinkClick} className="transition-colors hover:text-accent">
                  About
                </a>
              </li>
              <ChevronRight className="h-3 w-3" aria-hidden />
              <li aria-current="page" className="text-accent">
                4AM Team
              </li>
            </ol>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="reveal lg:col-span-6 xl:col-span-7">
              <span className="eyebrow mb-6">Meet the team</span>
              <h1 className="text-5xl font-black leading-[0.92] tracking-tighter sm:text-6xl md:text-7xl xl:text-[5.5rem]">
                Meet the People Behind <span className="text-gradient">4AM</span>
              </h1>
              <div className="mt-6 h-[3px] w-14 rounded-full bg-gradient-to-r from-accent to-coral" aria-hidden />
              <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-400 md:text-lg">
                A multidisciplinary team bringing together digital strategy, software engineering, marketing and visual storytelling to
                build meaningful digital experiences.
              </p>
              <a href="#team" className="btn-primary mt-9" data-track="team_explore">
                Explore the Team <ArrowDown className="h-4 w-4" aria-hidden />
              </a>
            </div>

            {/* Portrait arrangement: middle column offset for an editorial rhythm */}
            <ul className="reveal grid grid-cols-3 gap-3 pb-6 sm:gap-4 sm:pb-8 lg:col-span-6 xl:col-span-5" style={{ '--d': '150ms' } as CSSProperties} aria-label="Team members">
              {team.map((m, i) => (
                <li key={m.id} className={i % 3 === 1 ? 'translate-y-6 sm:translate-y-8' : ''}>
                  <a
                    href={`#${m.id}`}
                    className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 transition-colors hover:border-accent/50"
                  >
                    <div className="h-full w-full transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]">
                      <Portrait member={m} eager />
                    </div>
                    <span className="theme-dark absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-2.5 pb-2 pt-6 text-[0.6875rem] font-semibold leading-tight text-white sm:px-3 sm:text-xs">
                      {m.name}
                    </span>
                  </a>
                </li>
              ))}
              <li className="translate-y-6 sm:translate-y-8" aria-hidden>
                <div className="flex aspect-[4/5] flex-col items-center justify-center rounded-2xl border border-accent/25 bg-accent/[0.06] text-center">
                  <span className="text-3xl font-black tracking-tighter text-accent sm:text-4xl">{team.length}</span>
                  <span className="mt-1 px-2 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-gray-400 sm:text-[0.6875rem]">
                    People · One vision
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* ── 2. Team grid ── */}
      <section id="team" className="section-padding" aria-labelledby="team-heading">
        <div className="mx-auto max-w-7xl">
          <div className="section-head mb-12 flex md:mb-16">
            <div className="max-w-2xl">
              <span className="eyebrow mb-5">The team</span>
              <h2 id="team-heading" className="text-4xl font-black leading-[0.95] tracking-tighter md:text-6xl">
                Get to Know the Team
              </h2>
              <p className="mt-6 text-base leading-relaxed text-gray-400 md:text-lg">
                The people contributing their skills, ideas and creativity to the 4AM Global Media journey.
              </p>
            </div>
          </div>

          {/* 3 + 2 on desktop (second row centred), 2 columns on tablet, 1 on phones */}
          <ul className="flex flex-wrap justify-center gap-6 lg:gap-8">
            {team.map((member, i) => (
              <li
                key={member.id}
                id={member.id}
                className="flex w-full scroll-mt-28 sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4rem)/3)]"
                data-reveal="up"
                style={{ '--i': i % 3 } as CSSProperties}
              >
                <TeamCard member={member} onOpen={(trigger) => openProfile(member.id, trigger)} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Profile sheets (one per person; only one is ever open) */}
      {team.map((member) => (
        <ProfileSheet key={member.id} member={member} open={openId === member.id} onClose={closeProfile} />
      ))}

      {/* Optional creative showcase: rendered only when real work is listed in team.ts */}
      {teamShowcase.length > 0 && (
        <section className="section-padding border-t border-white/5" aria-labelledby="team-showcase">
          <div className="mx-auto max-w-7xl">
            <div className="section-head mb-12 flex">
              <div className="max-w-2xl">
                <h2 id="team-showcase" className="text-4xl font-black leading-[0.95] tracking-tighter md:text-6xl">
                  Creativity in Motion. Ideas in Action.
                </h2>
              </div>
            </div>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" data-reveal-stagger>
              {teamShowcase.map((item) => (
                <li key={item.src}>
                  <figure className="overflow-hidden rounded-2xl border border-white/10">
                    <img src={item.src} alt={item.alt} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
                    {item.credit && <figcaption className="px-4 py-3 text-xs text-gray-500">{item.credit}</figcaption>}
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── 3. Culture ── */}
      <section className="section-padding border-t border-white/5" aria-labelledby="team-culture">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5" data-reveal="up">
              <h2 id="team-culture" className="text-4xl font-black leading-[0.95] tracking-tighter md:text-5xl">
                Different Talents. <span className="text-accent">One Shared Vision.</span>
              </h2>
            </div>
            <p className="text-base leading-relaxed text-gray-400 md:text-lg lg:col-span-7" data-reveal="up">
              4AM Global Media brings together people with different strengths and perspectives. Great work happens when creativity meets
              strategy and technology meets execution, and every discipline in the team plays a part in turning ideas into meaningful
              digital experiences.
            </p>
          </div>

          <ul className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4" data-reveal-stagger>
            {teamPillars.map((p, i) => {
              const Icon = pillarIcons[i % pillarIcons.length];
              return (
                <li key={p.title} className="border-t border-white/10 pt-6">
                  <Icon className="h-5 w-5 text-accent" aria-hidden />
                  <h3 className="mt-4 text-xl font-black tracking-tight">{p.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-400">{p.text}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── 4. Closing CTA ── */}
      <section className="px-5 pb-16 pt-4 sm:px-6 md:px-12 md:pb-24 lg:px-24" aria-labelledby="team-cta">
        <div
          className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-accent/25 bg-gradient-to-br from-brand-dark-gray via-brand-black to-brand-dark-gray px-6 py-12 text-center sm:px-12 md:py-20"
          data-reveal="up"
        >
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-brand-yellow/10 blur-[100px]" aria-hidden />
          <h2 id="team-cta" className="relative text-4xl font-black leading-[0.95] tracking-tighter md:text-6xl">
            Have an Idea Worth Building?
          </h2>
          <p className="relative mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-400 md:text-lg">
            Let&apos;s bring strategy, creativity and technology together to build something meaningful.
          </p>
          <div className="relative mt-10 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <a href="/contact" onClick={onLinkClick} className="btn-primary" data-track="team_work_with_vaibhav">
              Work With Vaibhav <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
            <a href={COMPANY_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary" data-track="team_explore_4am">
              Explore 4AM Global Media <ArrowUpRight className="h-4 w-4" aria-hidden />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
