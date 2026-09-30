import { contactEmail, contactHref, socialLinks } from '../../contact';

export default function ContactEnd() {
  const year = new Date().getFullYear();

  return (
    <>
      <section id="contact" className="relative bg-ink text-paper overflow-hidden px-4 sm:px-6 md:px-10 pt-24 md:pt-36 pb-28">
        <div aria-hidden className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#f4efe6_1px,transparent_1px),linear-gradient(to_bottom,#f4efe6_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="relative max-w-7xl mx-auto">
          <h2 className="text-[24vw] md:text-[13rem] font-black tracking-[-0.07em] leading-[0.78] lowercase">
            contact
            <br />
            <span className="inline-block -rotate-3 bg-paper text-ink px-4 mt-2 brutal border-navy">me.</span>
          </h2>

          <div className="mt-14 grid gap-10 md:grid-cols-2 items-end">
            <div>
              <p className="text-xl md:text-2xl font-bold leading-snug max-w-md">
                Ready to make a move? Drop an email to talk growth, builds, workshops, or just to say hi.
              </p>
              <a
                href={contactHref}
                className="mt-8 inline-flex items-center gap-3 bg-paper text-navy brutal brutal-press px-6 py-4 text-lg md:text-2xl font-black tracking-tight break-all"
              >
                → {contactEmail}
              </a>
              <p className="mt-4 font-hand text-marker">say hi before overthinking it (opens your mail app, no forms, no friction)</p>
            </div>

            <ul className="flex flex-wrap gap-3 md:justify-end">
              {socialLinks.map((s, i) => (
                <li key={s.label} style={{ transform: `rotate(${[-2, 2, -1, 1.5][i % 4]}deg)` }}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer me"
                    aria-label={`Open Vaibhav Pasi on ${s.label}`}
                    className="block bg-navy text-paper brutal-sm border-paper shadow-[3px_3px_0_#f4efe6] px-5 py-3 font-extrabold uppercase tracking-[0.15em] text-xs hover:bg-marker hover:text-navy transition-colors"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className="bg-navy text-paper px-4 sm:px-6 md:px-10 pt-16 pb-[calc(96px+env(safe-area-inset-bottom))] md:pb-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-3xl md:text-5xl font-black tracking-tight leading-tight max-w-3xl">
            Bye, go build something great today.
            <span className="block font-hand font-normal text-lg md:text-2xl text-paper/60 mt-2">
              and maybe sleep before 4AM. I won't.
            </span>
          </p>
          <div className="mt-12 pt-6 border-t border-paper/15 flex flex-col sm:flex-row justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.25em] text-paper/50">
            <span>
              Vaibhav Pasi (VP) · © {year}
            </span>
            <span>4AM Global Media · India</span>
          </div>
        </div>
      </footer>
    </>
  );
}
