import Link from "next/link";

// ---------------------------------------------------------------------------
// KEELSTACK — Landing page
// Brutalist marketing site for two services: SEO audits + website builds.
// Both run on a "try before you buy / pay as you grow" funnel.
// ---------------------------------------------------------------------------

const MARQUEE = [
  "TRY BEFORE YOU BUY",
  "PAY AS YOU GROW",
  "SMALL STUDIO / FAST OUTPUT",
  "NO RETAINERS",
  "NO CONTRACTS",
  "PROOF FIRST, INVOICE LATER",
  "SEO AUDIT — SAME DAY",
  "FREE WEBSITE IN 48 HOURS",
];

export default function Page() {
  return (
    <main className="min-h-screen text-ink">
      <TopBar />
      <Marquee />
      <Hero />
      <Tenets />
      <Services />
      <HowItWorks />
      <Manifesto />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* TOP BAR                                                                    */
/* -------------------------------------------------------------------------- */

function TopBar() {
  return (
    <header className="border-b-2 border-ink">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-3 flex items-center justify-between text-[11px] md:text-xs uppercase tracking-[0.18em]">
        <div className="flex items-center gap-3">
          <span className="inline-block w-3 h-3 bg-acid" />
          <span className="font-bold">KEELSTACK</span>
          <span className="hidden md:inline opacity-60">// We build. You decide.</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#services" className="hover:text-acid">Services</a>
          <a href="#how" className="hover:text-acid">How</a>
          <a href="#faq" className="hover:text-acid">FAQ</a>
          <span className="hidden md:inline opacity-60">EST. 2026</span>
        </div>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* MARQUEE                                                                    */
/* -------------------------------------------------------------------------- */

function Marquee() {
  const row = MARQUEE.concat(MARQUEE);
  return (
    <div className="border-b-2 border-ink bg-ink text-paper">
      <div className="marquee-wrap py-2">
        <div className="inline-flex animate-marquee gap-10 text-sm md:text-base font-display tracking-wider">
          {row.map((t, i) => (
            <span key={i} className="flex items-center gap-10">
              <span>{t}</span>
              <span className="text-acid">✺</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* HERO                                                                       */
/* -------------------------------------------------------------------------- */

function Hero() {
  return (
    <section className="relative border-b-2 border-ink">
      {/* corner ticks */}
      <CornerTicks />
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-14 md:py-24 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <div className="font-term text-acid text-2xl md:text-3xl mb-6">
            &gt; ./keelstack --serve<span className="animate-blink">_</span>
          </div>
          <h1 className="font-display uppercase leading-[0.86] tracking-tight text-[clamp(48px,9vw,140px)]">
            We build the
            <br />
            thing.<span className="text-acid">_</span> You
            <br />
            decide if it&rsquo;s
            <br />
            <span className="acid-underline">worth paying for.</span>
          </h1>
          <p className="mt-8 md:mt-10 max-w-2xl text-base md:text-lg leading-relaxed">
            KEELSTACK ships you a <b>full SEO audit</b> or a <b>complete website</b> —
            before you spend a cent. Read it. Click around. If it&rsquo;s good, the bill follows.
            If it isn&rsquo;t, you delete the email. That&rsquo;s the entire deal.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-5">
            <Link
              href="/seo"
              className="brutal-btn brutal-btn-acid border-2 border-ink bg-acid text-paper px-7 py-5 font-display uppercase tracking-wider text-lg md:text-xl shadow-brutal inline-flex items-center gap-3"
            >
              Get the free SEO report
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="/website"
              className="brutal-btn border-2 border-ink bg-paper text-ink px-7 py-5 font-display uppercase tracking-wider text-lg md:text-xl shadow-brutal inline-flex items-center gap-3"
            >
              Get a free website
              <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="mt-6 text-xs md:text-sm font-term text-ink/70">
            ⌁ No credit card. No signup. Just a URL or a brief.
          </div>
        </div>

        <aside className="col-span-12 lg:col-span-4 lg:pl-8">
          <div className="border-2 border-ink bg-bone p-5 shadow-brutal">
            <div className="font-term text-xs text-acid uppercase">// status</div>
            <div className="font-display text-3xl mt-2">LIVE</div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <Stat k="Audits run" v="1,402" />
              <Stat k="Sites shipped" v="318" />
              <Stat k="Avg. close" v="6.2 days" />
              <Stat k="Refund rate" v="0%" />
            </div>
            <div className="mt-5 border-t border-ink/30 pt-4 text-xs leading-relaxed">
              We don&rsquo;t bill until you reply <span className="bg-acid text-paper px-1">YES</span>.
              No drip campaigns. No&nbsp;sales calls. Reply or don&rsquo;t.
            </div>
          </div>

          <div className="mt-5 border-2 border-ink p-5 font-term text-sm leading-relaxed">
            <span className="text-acid">$</span> cat why.txt<br />
            <span className="opacity-70">→ retainers waste money.</span><br />
            <span className="opacity-70">→ agencies waste months.</span><br />
            <span className="opacity-70">→ we don&rsquo;t.</span><br />
            <span className="text-acid">$</span> _<span className="animate-blink">▮</span>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="border border-ink/40 p-2">
      <div className="font-term text-[10px] uppercase opacity-60">{k}</div>
      <div className="font-display text-xl">{v}</div>
    </div>
  );
}

function CornerTicks() {
  const tick = "absolute w-4 h-4 border-ink";
  return (
    <>
      <span className={`${tick} border-l-2 border-t-2 top-3 left-3`} />
      <span className={`${tick} border-r-2 border-t-2 top-3 right-3`} />
      <span className={`${tick} border-l-2 border-b-2 bottom-3 left-3`} />
      <span className={`${tick} border-r-2 border-b-2 bottom-3 right-3`} />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* TENETS                                                                     */
/* -------------------------------------------------------------------------- */

function Tenets() {
  const items = [
    {
      n: "01",
      h: "Try before you buy",
      b: "We send the actual deliverable first. A real SEO report. A real website at a real URL. Not a demo, not a teaser.",
    },
    {
      n: "02",
      h: "Pay as you grow",
      b: "Pay for what we ship, the day you say it works. No retainers, no quarterly minimums, no &lsquo;strategy&rsquo; line items.",
    },
    {
      n: "03",
      h: "Shipped fast, finished right",
      b: "We move fast on the draft. The decisions, the editorial cuts, and the final pass are ours. You get the speed without the slop.",
    },
  ];
  return (
    <section className="border-b-2 border-ink bg-bone">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-14 md:py-20 grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-0">
        {items.map((it, i) => (
          <div
            key={it.n}
            className={`p-6 md:p-8 ${
              i < 2 ? "md:border-r-2 border-ink" : ""
            } ${i < items.length - 1 ? "border-b-2 md:border-b-0 border-ink" : ""}`}
          >
            <div className="flex items-baseline gap-3">
              <span className="font-display text-5xl md:text-6xl text-acid">{it.n}</span>
              <span className="font-term text-xs uppercase opacity-60">/ tenet</span>
            </div>
            <h3 className="font-display uppercase text-2xl md:text-3xl mt-3 leading-none">{it.h}</h3>
            <p
              className="mt-4 text-sm md:text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: it.b }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* SERVICES                                                                   */
/* -------------------------------------------------------------------------- */

function Services() {
  return (
    <section id="services" className="border-b-2 border-ink">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-14 md:py-20">
        <div className="flex items-end justify-between border-b-2 border-ink pb-4 mb-10">
          <h2 className="font-display uppercase text-4xl md:text-6xl leading-none">
            Two<span className="text-acid">.</span> services<span className="text-acid">.</span>
          </h2>
          <span className="font-term text-xs md:text-sm opacity-60 hidden md:block">
            // pick a funnel. or both.
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ServiceCard
            tag="01 / SEO"
            title="The free SEO report"
            blurb="Paste your URL. We crawl the page, your top 20 queries, your competitors, and your structured data — then write the report a $4k agency would charge for."
            bullets={[
              "Quick wins ranked by traffic impact",
              "Competitive gap analysis with named rivals",
              "Schema, meta, and content rewrites you can paste in today",
              "Delivered as a PDF + live page. Same-day turnaround.",
            ]}
            cta="Run the audit"
            href="/seo"
            accent
          />
          <ServiceCard
            tag="02 / WEBSITE"
            title="The free website preview"
            blurb="Tell us what your business does in three sentences. We design, write, and deploy a full multi-page website at a live URL. You walk through it before we ever ask for a card."
            bullets={[
              "Multi-page, mobile-first, your copy & brand",
              "Live preview URL — share it, send it, sleep on it",
              "Optional handover: code, domain, hosting in your name",
              "Built in 48 hours. Revised the same day.",
            ]}
            cta="Build my preview"
            href="/website"
          />
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  tag,
  title,
  blurb,
  bullets,
  cta,
  href,
  accent,
}: {
  tag: string;
  title: string;
  blurb: string;
  bullets: string[];
  cta: string;
  href: string;
  accent?: boolean;
}) {
  return (
    <article
      className={`relative border-2 border-ink p-6 md:p-8 shadow-brutalLg ${
        accent ? "bg-acid text-paper" : "bg-bone text-ink"
      }`}
    >
      <div className={`font-term text-xs uppercase tracking-widest ${accent ? "text-paper/80" : "opacity-60"}`}>
        {tag}
      </div>
      <h3 className="font-display uppercase text-3xl md:text-5xl mt-2 leading-[0.9]">{title}</h3>
      <p className={`mt-5 text-sm md:text-base leading-relaxed ${accent ? "" : ""}`}>{blurb}</p>
      <ul className="mt-6 space-y-2 text-sm">
        {bullets.map((b) => (
          <li key={b} className="tick">{b}</li>
        ))}
      </ul>
      <div className="mt-8">
        <Link
          href={href}
          className={`brutal-btn inline-flex items-center gap-3 border-2 px-5 py-3 font-display uppercase tracking-wider ${
            accent
              ? "bg-ink text-paper border-paper"
              : "bg-ink text-paper border-ink"
          } shadow-brutal`}
        >
          {cta} <span aria-hidden>→</span>
        </Link>
      </div>
      {/* corner stamp */}
      <div
        className={`absolute -top-3 -right-3 rotate-6 border-2 px-2 py-1 font-term text-[10px] uppercase ${
          accent ? "bg-paper text-ink border-ink" : "bg-acid text-paper border-ink"
        }`}
      >
        free first
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* HOW IT WORKS                                                               */
/* -------------------------------------------------------------------------- */

function HowItWorks() {
  const steps = [
    {
      n: "01",
      t: "You drop a URL or a brief",
      d: "30 seconds. No account, no card. We need your email so we can send the thing back.",
    },
    {
      n: "02",
      t: "We get to work",
      d: "Same hour. The studio is auditing or building while you go about your day. No back-and-forth, no kickoff call.",
    },
    {
      n: "03",
      t: "You get the deliverable",
      d: "The full audit PDF + live page, or the working website at a live URL. Real artifact, not a sample.",
    },
    {
      n: "04",
      t: "You pay only if it&rsquo;s good",
      d: "We send a payment link with the email. Click it if the work earned it. Otherwise, archive and move on.",
    },
  ];
  return (
    <section id="how" className="border-b-2 border-ink bg-paper">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-14 md:py-20">
        <div className="flex items-end justify-between border-b-2 border-ink pb-4 mb-10">
          <h2 className="font-display uppercase text-4xl md:text-6xl leading-none">
            How it works
          </h2>
          <span className="font-term text-xs md:text-sm opacity-60 hidden md:block">
            // four steps. no calls.
          </span>
        </div>
        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
          {steps.map((s, i) => (
            <li
              key={s.n}
              className={`relative p-6 md:p-7 border-2 border-ink -ml-[2px] -mt-[2px] bg-bone min-h-[260px]`}
            >
              <div className="font-display text-6xl text-ink/15">{s.n}</div>
              <h4
                className="font-display uppercase text-xl md:text-2xl mt-1 leading-tight"
                dangerouslySetInnerHTML={{ __html: s.t }}
              />
              <p
                className="mt-3 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: s.d }}
              />
              {i < steps.length - 1 && (
                <span className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 text-acid font-display text-2xl">
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* MANIFESTO                                                                  */
/* -------------------------------------------------------------------------- */

function Manifesto() {
  return (
    <section className="border-b-2 border-ink bg-ink text-paper relative overflow-hidden">
      <div className="absolute inset-0 stripes opacity-[0.07] pointer-events-none" />
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-16 md:py-24 grid grid-cols-12 gap-6 relative">
        <div className="col-span-12 md:col-span-3">
          <div className="font-term text-acid text-xs uppercase tracking-[0.3em]">/ manifesto</div>
          <div className="font-display text-5xl md:text-6xl mt-3 leading-none">
            03<span className="text-acid">.</span>
          </div>
        </div>
        <div className="col-span-12 md:col-span-9">
          <p className="font-display uppercase text-3xl md:text-5xl leading-[0.95]">
            The agency model is a <span className="text-acid">tax</span> on
            people who can&rsquo;t see the work before they pay for it.
          </p>
          <p className="mt-6 max-w-3xl text-base md:text-lg leading-relaxed text-paper/85">
            We invert it. The work shows up first. The invoice follows the result. If the report
            doesn&rsquo;t earn its price, you don&rsquo;t pay. If the website isn&rsquo;t the one
            you&rsquo;d ship, you delete the email. There&rsquo;s no clever clause. Refund rate
            is zero because nobody pays under duress.
          </p>
          <p className="mt-6 font-term text-acid text-sm">
            // shipped fast &middot; audited twice &middot; priced by you
          </p>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* FAQ                                                                        */
/* -------------------------------------------------------------------------- */

function FAQ() {
  const items = [
    {
      q: "Wait — really free? What&rsquo;s the catch?",
      a: "Really free. Most quick-turn work in this industry is mediocre and we&rsquo;re betting ours isn&rsquo;t. If we&rsquo;re wrong, you don&rsquo;t pay and we eat the cost. That&rsquo;s our risk to carry, not yours.",
    },
    {
      q: "How can the website be done in 48 hours?",
      a: "Because it&rsquo;s a real website, not a custom $40k bespoke build. Your brand, your copy, assembled from production-grade components our studio already trusts. If you need bespoke engineering on top, that&rsquo;s a separate conversation — and still pay-as-you-grow.",
    },
    {
      q: "What does &lsquo;pay as you grow&rsquo; actually mean?",
      a: "You pay the base price when you accept the deliverable. Add-ons (more pages, deeper audits, ongoing optimization) are billed only when you ask for them. No retainer. No auto-renew.",
    },
    {
      q: "Who owns the work?",
      a: "You do. The website code, the report, the recommendations — all yours, the moment you pay. We don&rsquo;t lock anything behind a platform.",
    },
    {
      q: "Do I talk to a human?",
      a: "Only if you want to. The default flow is: submit → receive → decide. If you reply to the delivery email, a human answers. If you don&rsquo;t, we don&rsquo;t chase.",
    },
  ];
  return (
    <section id="faq" className="border-b-2 border-ink">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-14 md:py-20">
        <div className="flex items-end justify-between border-b-2 border-ink pb-4 mb-10">
          <h2 className="font-display uppercase text-4xl md:text-6xl leading-none">FAQ</h2>
          <span className="font-term text-xs md:text-sm opacity-60 hidden md:block">
            // the obvious ones, answered.
          </span>
        </div>
        <div className="divide-y-2 divide-ink border-2 border-ink bg-bone">
          {items.map((it, i) => (
            <details key={i} className="group">
              <summary className="cursor-pointer list-none p-5 md:p-6 flex items-start gap-4 hover:bg-paper">
                <span className="font-display text-acid text-2xl leading-none w-8 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="font-display uppercase text-lg md:text-2xl leading-tight flex-1"
                  dangerouslySetInnerHTML={{ __html: it.q }}
                />
                <span className="font-display text-2xl transition-transform group-open:rotate-45 text-ink">
                  +
                </span>
              </summary>
              <div className="px-5 md:px-6 pb-6 pl-16 md:pl-20 text-sm md:text-base leading-relaxed">
                <p dangerouslySetInnerHTML={{ __html: it.a }} />
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* FINAL CTA                                                                  */
/* -------------------------------------------------------------------------- */

function FinalCTA() {
  return (
    <section className="border-b-2 border-ink bg-acid text-paper relative">
      <div className="absolute inset-0 stripes opacity-[0.12] pointer-events-none" />
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-16 md:py-28 relative text-center">
        <div className="font-term text-xs uppercase tracking-[0.3em]">/ your move</div>
        <h2 className="font-display uppercase text-5xl md:text-8xl leading-[0.9] mt-4">
          See the work.
          <br />
          Then decide.
        </h2>
        <div className="mt-10 flex flex-col sm:flex-row gap-5 justify-center">
          <Link
            href="/seo"
            className="brutal-btn border-2 border-ink bg-ink text-paper px-8 py-5 font-display uppercase tracking-wider text-lg md:text-xl shadow-brutal inline-flex items-center gap-3"
          >
            Free SEO report <span aria-hidden>→</span>
          </Link>
          <Link
            href="/website"
            className="brutal-btn border-2 border-ink bg-paper text-ink px-8 py-5 font-display uppercase tracking-wider text-lg md:text-xl shadow-brutal inline-flex items-center gap-3"
          >
            Free website preview <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="mt-6 font-term text-sm text-paper/85">
          ⌁ no card &middot; no signup &middot; no follow-up unless you reply
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* FOOTER                                                                     */
/* -------------------------------------------------------------------------- */

function Footer() {
  return (
    <footer className="bg-paper">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-10 grid grid-cols-12 gap-6 text-xs">
        <div className="col-span-12 md:col-span-5">
          <div className="font-display text-3xl">KEELSTACK</div>
          <p className="mt-2 max-w-sm leading-relaxed opacity-80">
            Websites and SEO. Free first deliverable. Pay only if it&rsquo;s good. Built
            from a small studio, no investors, no growth team.
          </p>
        </div>
        <div className="col-span-6 md:col-span-3">
          <div className="font-term uppercase tracking-widest opacity-60">Services</div>
          <ul className="mt-3 space-y-1.5">
            <li><Link href="/seo" className="hover:text-acid">Free SEO report</Link></li>
            <li><Link href="/website" className="hover:text-acid">Free website preview</Link></li>
          </ul>
        </div>
        <div className="col-span-6 md:col-span-2">
          <div className="font-term uppercase tracking-widest opacity-60">Site</div>
          <ul className="mt-3 space-y-1.5">
            <li><a href="#how" className="hover:text-acid">How it works</a></li>
            <li><a href="#faq" className="hover:text-acid">FAQ</a></li>
          </ul>
        </div>
        <div className="col-span-12 md:col-span-2">
          <div className="font-term uppercase tracking-widest opacity-60">Contact</div>
          <ul className="mt-3 space-y-1.5">
            <li><a href="mailto:hello@keelstack.example" className="hover:text-acid">hello@keelstack</a></li>
          </ul>
        </div>
        <div className="col-span-12 border-t-2 border-ink mt-6 pt-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 font-term opacity-70">
          <span>© {new Date().getFullYear()} KEELSTACK // proof first, invoice later</span>
          <span>made on a tuesday</span>
        </div>
      </div>
    </footer>
  );
}
