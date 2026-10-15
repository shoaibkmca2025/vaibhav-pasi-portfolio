import type { TeamMember } from '../content/team';

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

// A team member's portrait, or an initials monogram until a real photo is set in src/content/team.ts.
// Shared by the team page and each profile page.
export default function TeamPortrait({
  member,
  eager = false,
  className = '',
}: {
  member: TeamMember;
  eager?: boolean;
  className?: string;
}) {
  if (member.portrait) {
    return (
      <img
        src={member.portrait}
        alt={`Portrait of ${member.name}, ${member.designation}`}
        width={800}
        height={1000}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
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
