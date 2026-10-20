// Decorative band of large words that slide sideways as the page scrolls (two lines, opposite
// directions). Pure CSS scroll-driven animation (.scroll-band in index.css): no JS listeners, it
// stays still where the browser doesn't support it or Reduce Motion is on. aria-hidden: the words
// repeat what the services section already says.
const LINE_ONE = ['Websites', 'Digital Marketing', 'SEO & AEO', 'LinkedIn Growth', 'Personal Branding'];
const LINE_TWO = ['AI Automation', 'Custom Software', 'CRM & Dashboards', 'AI Workshops', 'Strategy'];

// `outline`: the quieter second row, in dimmed gold (a stroked outline shows the font's overlapping
// letter shapes as stray lines)
function Line({ words, outline = false, reverse = false }: { words: string[]; outline?: boolean; reverse?: boolean }) {
  // Repeated so the line still fills the width at either end of its travel
  const items = [...words, ...words, ...words];
  return (
    <div className={`scroll-band-line flex w-max gap-8 md:gap-12 whitespace-nowrap ${reverse ? 'scroll-band-reverse' : ''}`}>
      {items.map((w, i) => (
        <span key={i} className="flex items-center gap-8 md:gap-12">
          <span
            className={`text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-none ${
              outline ? 'text-accent/25' : 'text-white/90'
            }`}
          >
            {w}
          </span>
          <span className="text-accent text-3xl md:text-5xl leading-none">✦</span>
        </span>
      ))}
    </div>
  );
}

export default function ScrollMarquee() {
  return (
    <div aria-hidden className="scroll-band overflow-clip bg-brand-black py-14 md:py-20 border-y border-white/5 select-none">
      <div className="space-y-4 md:space-y-6">
        <Line words={LINE_ONE} />
        <Line words={LINE_TWO} outline reverse />
      </div>
    </div>
  );
}
