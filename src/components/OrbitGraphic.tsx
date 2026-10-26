import type { CSSProperties } from 'react';

// Decorative motion graphic for the dawn-sky look: concentric orbits with glowing "planets"
// travelling round them, a sunrise core and twinkling stars. Pure SVG + CSS keyframes
// (.orbit-* in index.css): transform/opacity only, no JS, frozen for Reduce Motion. aria-hidden.

// Fixed star positions (deterministic, so the prerendered HTML matches the client render)
const STARS = [
  [8, 12, 1.2, 0], [22, 6, 0.8, 1.4], [35, 18, 1, 2.6], [48, 4, 0.7, 0.8], [62, 14, 1.3, 3.1], [78, 8, 0.9, 1.9],
  [90, 20, 1.1, 0.4], [94, 42, 0.8, 2.2], [86, 64, 1.2, 1.1], [92, 84, 0.9, 3.4], [74, 94, 1, 0.6], [56, 88, 0.7, 2.8],
  [38, 96, 1.2, 1.6], [20, 90, 0.8, 0.2], [6, 76, 1, 2.4], [4, 54, 0.9, 1.2], [12, 34, 0.7, 3], [28, 70, 0.8, 0.9],
  [70, 30, 0.7, 2], [30, 30, 0.6, 3.6], [66, 72, 0.6, 1.3],
] as const;

// radius (in the 0–100 viewBox), seconds per lap, dot colour, dot size, start angle, direction
const ORBITS = [
  { r: 18, dur: 14, color: 'var(--color-accent)', size: 1.6, start: 20, rev: false },
  { r: 28, dur: 22, color: 'var(--color-coral)', size: 1.4, start: 200, rev: true },
  { r: 38, dur: 34, color: 'var(--color-dawn)', size: 2, start: 110, rev: false },
  { r: 47, dur: 48, color: 'var(--color-accent)', size: 1.1, start: 300, rev: true },
];

export default function OrbitGraphic({ className = '', stars = true }: { className?: string; stars?: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" className={`orbit-graphic pointer-events-none ${className}`} fill="none">
      <defs>
        <radialGradient id="orbit-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.55" />
          <stop offset="45%" stopColor="var(--color-coral)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--color-coral)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {stars &&
        STARS.map(([x, y, r, delay], i) => (
          <circle
            key={i}
            className="orbit-star"
            cx={x}
            cy={y}
            r={r * 0.35}
            fill="currentColor"
            style={{ animationDelay: `${delay}s` } as CSSProperties}
          />
        ))}

      {/* Sunrise core: breathes slowly */}
      <circle className="orbit-core" cx="50" cy="50" r="14" fill="url(#orbit-core)" />

      {ORBITS.map((o, i) => (
        <g key={i}>
          <circle cx="50" cy="50" r={o.r} stroke="currentColor" strokeOpacity={0.12 - i * 0.015} strokeWidth="0.25" strokeDasharray={i % 2 ? '0.8 1.6' : undefined} />
          {/* The whole group rotates around the centre, carrying its planet along the ring */}
          <g
            className={`orbit-spin ${o.rev ? 'orbit-reverse' : ''}`}
            style={{ animationDuration: `${o.dur}s`, transform: `rotate(${o.start}deg)` } as CSSProperties}
          >
            <circle cx={50 + o.r} cy="50" r={o.size * 2.4} fill={o.color} opacity="0.18" />
            <circle cx={50 + o.r} cy="50" r={o.size} fill={o.color} />
          </g>
        </g>
      ))}
    </svg>
  );
}
