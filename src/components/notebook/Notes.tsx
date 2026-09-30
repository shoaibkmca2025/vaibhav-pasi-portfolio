import { posts, formatDate } from '../../blog/posts';
import { faqs } from '../FAQ';
import { onLinkClick } from '../../router';

// Blog teaser as index cards, plus the FAQ as a handwritten Q&A page (it also feeds FAQPage structured data)
export default function Notes() {
  return (
    <section className="relative bg-paper-dark px-4 sm:px-6 md:px-10 py-24 md:py-32">
      <div className="max-w-7xl mx-auto grid gap-16 lg:grid-cols-12">
        <div id="blog" className="lg:col-span-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink border-b-2 border-ink pb-2 mb-8">
            Section 06 // Field notes
          </p>
          <h2 className="text-5xl md:text-7xl font-black tracking-[-0.06em] leading-[0.85] lowercase">
            things i<br />
            <span className="text-ink">wrote down.</span>
          </h2>
          <ul className="mt-10 space-y-5">
            {posts.slice(0, 3).map((p, i) => (
              <li key={p.slug} style={{ transform: `rotate(${[-1, 1, -0.5][i]}deg)` }}>
                <a
                  href={`/blog/${p.slug}`}
                  onClick={onLinkClick}
                  className="block bg-paper bg-ruled brutal-sm brutal-press p-4"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink">
                    {p.category} · {formatDate(p.date)} · {p.readingMinutes} min
                  </span>
                  <span className="block mt-1 text-lg font-black tracking-tight leading-tight">{p.title}</span>
                </a>
              </li>
            ))}
          </ul>
          <a href="/blog" onClick={onLinkClick} className="mt-8 inline-block font-hand text-lg text-ink underline underline-offset-4">
            read all the notes →
          </a>
        </div>

        <div id="faq" className="lg:col-span-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink border-b-2 border-ink pb-2 mb-8">
            Questions people actually ask
          </p>
          <div className="bg-paper bg-ruled brutal p-5 md:p-8">
            {faqs.map((f) => (
              <details key={f.question} className="group border-b border-dashed border-navy/25 last:border-0 py-4">
                <summary className="flex items-start justify-between gap-4 cursor-pointer list-none text-lg font-extrabold tracking-tight">
                  <span>
                    <span className="text-ink mr-2">Q.</span>
                    {f.question}
                  </span>
                  <span className="shrink-0 font-mono text-ink transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 pl-7 font-hand text-[15px] leading-relaxed text-navy/85">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
