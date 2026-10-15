import { useId, useState, type CSSProperties } from 'react';
import { ArrowRight, ArrowUpRight, ChevronDown, ChevronRight, Compass, Cpu, Lightbulb, Quote, Users } from 'lucide-react';
import { onLinkClick } from '../router';
import { COMPANY_URL, team, teamShowcase, teamValues, type TeamMember } from '../content/team';

/* ─────────────── helpers ─────────────── */
const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

const valueIcons = [Lightbulb, Compass, Cpu, Users];

// Portrait, or an initials monogram until a real photo is supplied in src/content/team.ts
function Portrait({ member, className = '', eager = false }: { member: TeamMember; className?: string; eager?: boolean }) {
  if (member.portrait) {
    return (
      <img
        src={member.portrait}
        alt={`Portrait of ${member.name}`}
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
      <span className="text-5xl md:text-6xl font-black tracking-tighter text-accent/80 select-none" aria-hidden>
        {initials(member.name)}
      </span>
    </div>
  );
}

/* ─────────────── profile card ─────────────── */
interface CardProps {
  member: TeamMember;
  index: number;
  open: boolean;
  onToggle: () => void;
}

function TeamMemberCard({ member, index, open, onToggle }: CardProps) {
  const panelId = useId();
  const confirmed = member.profileDetailsConfirmed;
  const preview = member.expertise.slice(0, 4);
  const hasMoreTags = member.expertise.length > preview.length;
  const links = [
    ...(member.portfolioUrl ? [{ label: 'Portfolio', href: member.portfolioUrl }] : []),
    ...(member.socialLinks ?? []).filter((l) => l.href),
  ];

  return (
    <article
      aria-labelledby={`${member.id}-name`}
      className="group flex w-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-brand-dark-gray/40 transition-colors duration-300 hover:border-accent/40 focus-within:border-accent/50"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-brand-muted">
        <div className="h-full w-full transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]">
          <Portrait member={member} />
        </div>
        <span className="absolute left-4 top-4 rounded-full bg-brand-black/70 px-3 py-1 text-[0.6875rem] font-bold tracking-[0.2em] text-gray-300 backdrop-blur-sm">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6 md:p-7">
        <h3 id={`${member.id}-name`} className="text-2xl md:text-[1.7rem] font-black tracking-tight leading-tight">
          {member.name}
        </h3>
        {member.designation && <p className="mt-2 text-sm font-semibold leading-snug text-accent">{member.designation}</p>}
        {member.experienceLabel && (
          <p className="mt-2 inline-flex w-fit rounded-full border border-white/10 px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-widest text-gray-400">
            {member.experienceLabel}
          </p>
        )}
        <p className="mt-4 text-[0.95rem] leading-relaxed text-gray-400">{member.shortDescription}</p>

        {confirmed ? (
          <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${member.name}: key expertise`}>
            {preview.map((tag) => (
              <li key={tag} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-gray-300">
                {tag}
              </li>
            ))}
            {hasMoreTags && !open && (
              <li className="px-1 py-1.5 text-xs font-medium text-gray-500" aria-hidden>
                +{member.expertise.length - preview.length} more
              </li>
            )}
          </ul>
        ) : (
          <p className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-dashed border-white/15 px-3 py-1.5 text-xs font-medium text-gray-500">
            Profile details coming soon
          </p>
        )}

        {/* Full profile: always in the HTML (crawlable, findable), collapsed visually and taken
            out of the tab order with `inert` until opened */}
        <div
          id={panelId}
          inert={!open}
          className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
        >
          <div className="overflow-hidden">
            <div className="mt-6 space-y-4 border-t border-white/10 pt-6 text-[0.95rem] leading-relaxed text-gray-300">
              {member.biography.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
              {member.roleAt4AM && (
                <div>
                  <h4 className="mb-2 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-gray-500">Role at 4AM Global Media</h4>
                  <p>{member.roleAt4AM}</p>
                </div>
              )}
              {member.expertise.length > 0 && (
                <div>
                  <h4 className="mb-2 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-gray-500">Areas of expertise</h4>
                  <ul className="flex flex-wrap gap-2">
                    {member.expertise.map((tag) => (
                      <li key={tag} className="rounded-full border border-accent/25 bg-accent/[0.06] px-3 py-1.5 text-xs font-medium text-gray-200">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {member.quote && (
                <blockquote className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 italic text-gray-200">
                  <Quote className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                  <p>“{member.quote}”</p>
                </blockquote>
              )}
              {links.length > 0 && (
                <ul className="flex flex-wrap gap-4 pt-1">
                  {links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent link-underline"
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

        <div className="mt-auto pt-6">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={onToggle}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {open ? 'Show Less' : 'Read Full Profile'}
            <span className="sr-only">: {member.name}</span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} aria-hidden />
          </button>
        </div>
      </div>
    </article>
  );
}

/* ─────────────── page ─────────────── */
export default function TeamPage() {
  const [openIds, setOpenIds] = useState<string[]>([]);
  const toggle = (id: string) => setOpenIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));
  const anyOpen = openIds.length > 0;

  return (
    <main id="main" tabIndex={-1} className="outline-none">
      {/* 1. Hero */}
      <header className="relative overflow-hidden border-b border-white/5 px-5 pb-14 pt-32 sm:px-6 md:px-12 md:pb-20 md:pt-40 lg:px-24">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(214,182,117,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(214,182,117,0.3) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
          <div className="absolute -right-20 -top-20 h-[320px] w-[320px] rounded-full bg-brand-yellow/5 blur-[80px] md:h-[560px] md:w-[560px] md:blur-[150px]" />
        </div>

        <div className="relative mx-auto max-w-7xl">
          <nav aria-label="Breadcrumb" className="mb-10 md:mb-12">
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

          <div className="grid items-end gap-12 lg:grid-cols-12">
            <div className="reveal lg:col-span-8">
              <span className="eyebrow mb-6">Meet the people behind the vision</span>
              <h1 className="text-5xl font-black leading-[0.9] tracking-tighter sm:text-6xl md:text-7xl lg:text-[6.5rem]">
                The Faces Behind <span className="text-gradient">4AM Global Media.</span>
              </h1>
              <p className="mt-8 max-w-2xl text-base leading-relaxed text-gray-400 md:text-xl">
                Behind every bold idea is a team that believes in making it happen. Meet the people combining strategy, technology,
                creativity, and execution to build meaningful digital experiences and help brands grow.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <a href="#team" className="btn-primary">
                  Meet Our Team <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
                <a href={COMPANY_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  Explore 4AM Global Media <ArrowUpRight className="h-4 w-4" aria-hidden />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </div>
            </div>

            {/* Team at a glance: real portrait where supplied, initials otherwise */}
            <div className="reveal lg:col-span-4" style={{ '--d': '150ms' } as CSSProperties}>
              <ul className="grid grid-cols-5 gap-2 sm:gap-3 lg:grid-cols-3" aria-label="Team members">
                {team.map((m, i) => (
                  <li
                    key={m.id}
                    className={`overflow-hidden rounded-2xl border border-white/10 aspect-square ${i === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}
                  >
                    <a href={`#${m.id}`} className="block h-full w-full" aria-label={`Jump to ${m.name}`}>
                      <Portrait member={m} eager={i === 0} className="[&>span]:text-xl sm:[&>span]:text-2xl" />
                    </a>
                  </li>
                ))}
                {/* Fills the last cell of the 3-column desktop collage */}
                <li className="hidden aspect-square flex-col items-center justify-center rounded-2xl border border-accent/25 bg-accent/[0.06] text-center lg:flex" aria-hidden>
                  <span className="text-3xl font-black tracking-tighter text-accent">{team.length}</span>
                  <span className="mt-1 text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-gray-400">People · 1 vision</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Introduction */}
      <section className="section-padding border-b border-white/5" aria-labelledby="team-intro">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7" data-reveal="up">
            <h2 id="team-intro" className="text-4xl font-black leading-[0.95] tracking-tighter md:text-6xl">
              Different Talents. <span className="text-accent">One Shared Vision.</span>
            </h2>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-gray-400 md:text-lg">
              <p>
                4AM Global Media brings together people with different strengths, perspectives, and creative abilities. From digital
                marketing strategy and technology development to 3D animation and visual storytelling, every contribution plays a role in
                turning ideas into meaningful digital experiences.
              </p>
              <p>
                We believe that great work happens when creativity meets strategy and technology meets execution. Together, we focus on
                helping businesses build their digital presence, communicate effectively, and pursue sustainable growth.
              </p>
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-3 md:gap-4 lg:col-span-5" data-reveal-stagger aria-label="Disciplines in the team">
            {[
              ['Strategy', 'Digital growth & planning'],
              ['Technology', 'Software & applications'],
              ['Marketing', 'Social, brand & campaigns'],
              ['3D & Motion', 'Animation & visual stories'],
            ].map(([title, text]) => (
              <li key={title} className="rounded-2xl border border-white/10 bg-brand-dark-gray/40 p-5 md:p-6">
                <span className="block text-lg font-black tracking-tight md:text-xl">{title}</span>
                <span className="mt-1 block text-sm text-gray-400">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Meet the team */}
      <section id="team" className="section-padding" aria-labelledby="team-heading">
        <div className="mx-auto max-w-7xl">
          <div className="section-head mb-12 flex md:mb-16">
            <div className="max-w-2xl">
              <span className="eyebrow mb-5">The team</span>
              <h2 id="team-heading" className="text-4xl font-black leading-[0.95] tracking-tighter md:text-6xl">
                Meet the People Behind the Work
              </h2>
              <p className="mt-6 text-base leading-relaxed text-gray-400 md:text-lg">
                Get to know the people contributing their skills, ideas, and creativity to the 4AM Global Media journey.
              </p>
            </div>
          </div>

          {/* 3 + 2 on desktop (second row centred), 2 columns on tablet, 1 on mobile.
              Cards share a row height while collapsed; once a profile is open, each card takes its
              natural height so neighbours don't stretch into empty space. */}
          <ul className={`flex flex-wrap justify-center gap-6 lg:gap-8 ${anyOpen ? 'items-start' : ''}`}>
            {team.map((member, i) => (
              <li
                key={member.id}
                id={member.id}
                className="flex w-full scroll-mt-28 md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4rem)/3)]"
                data-reveal="up"
                style={{ '--i': i % 3 } as CSSProperties}
              >
                <TeamMemberCard member={member} index={i} open={openIds.includes(member.id)} onToggle={() => toggle(member.id)} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Optional creative showcase: rendered only when real work is listed in team.ts */}
      {teamShowcase.length > 0 && (
        <section className="section-padding border-t border-white/5" aria-labelledby="team-showcase">
          <div className="mx-auto max-w-7xl">
            <div className="section-head mb-12 flex">
              <div className="max-w-2xl">
                <h2 id="team-showcase" className="text-4xl font-black leading-[0.95] tracking-tighter md:text-6xl">
                  Creativity in Motion. Ideas in Action.
                </h2>
                <p className="mt-6 text-base leading-relaxed text-gray-400 md:text-lg">
                  Great digital experiences are built through the combination of strategy, design, technology, and storytelling.
                </p>
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

      {/* 5. Values */}
      <section className="section-padding border-t border-white/5 bg-brand-dark-gray/20" aria-labelledby="team-values">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5" data-reveal="up">
            <h2 id="team-values" className="text-4xl font-black leading-[0.95] tracking-tighter md:text-5xl">
              One Team. One Vision. <span className="text-accent">Continuous Growth.</span>
            </h2>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-gray-400">
              <p>At 4AM Global Media, we believe meaningful digital growth happens when different skills and perspectives come together.</p>
              <p>
                From strategy and marketing to software development and visual storytelling, our team brings a collaborative mindset to every
                project. We value creativity, thoughtful execution, continuous learning, and the drive to turn ambitious ideas into practical
                outcomes.
              </p>
              <p>
                Our goal is to build digital experiences and marketing solutions that help businesses communicate better, connect with their
                audiences, and continue evolving.
              </p>
            </div>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-7" data-reveal-stagger>
            {teamValues.map((v, i) => {
              const Icon = valueIcons[i % valueIcons.length];
              return (
                <li key={v.title} className="rounded-2xl border border-white/10 bg-brand-black/40 p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-xl font-black tracking-tight">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">{v.text}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 6. Closing CTA */}
      <section className="px-5 py-16 sm:px-6 md:px-12 md:py-24 lg:px-24" aria-labelledby="team-cta">
        <div
          className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-accent/25 bg-gradient-to-br from-brand-dark-gray via-brand-black to-brand-dark-gray p-8 text-center sm:p-12 md:p-20"
          data-reveal="up"
        >
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] max-w-full -translate-x-1/2 rounded-full bg-brand-yellow/10 blur-[100px]" aria-hidden />
          <h2 id="team-cta" className="relative text-4xl font-black leading-[0.95] tracking-tighter md:text-6xl">
            Have an Idea Worth Building?
          </h2>
          <p className="relative mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-400 md:text-lg">
            Let&apos;s bring strategy, creativity, and technology together to create something meaningful.
          </p>
          <div className="relative mt-10 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
            <a href={COMPANY_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Explore 4AM Global Media <ArrowUpRight className="h-4 w-4" aria-hidden />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <a href="/contact" onClick={onLinkClick} className="btn-secondary">
              Connect With Vaibhav <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
