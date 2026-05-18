import Link from "next/link";
import { FunnelFooter, FunnelHeader } from "@/components/funnel";

type SP = { service?: string };

export default function Thanks({ searchParams }: { searchParams: SP }) {
  const isSEO = searchParams.service === "seo";
  const label = isSEO ? "SEO REPORT" : "WEBSITE PREVIEW";

  return (
    <main className="min-h-screen">
      <FunnelHeader />
      <section className="mx-auto max-w-[1000px] px-5 md:px-8 py-20 md:py-28 text-center">
        <div className="font-term text-acid text-sm uppercase tracking-[0.3em]">
          / received — {label}
        </div>
        <h1 className="font-display uppercase text-5xl md:text-7xl mt-4 leading-[0.9]">
          Check your inbox<span className="text-acid">.</span>
        </h1>
        <p className="mt-8 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
          We just emailed you a one-click confirmation link from{" "}
          <b>hello@keelstack.uk</b>. Open it and hit the button — that&rsquo;s when we start
          the work. Until you confirm, nothing else happens. No spam, no follow-up emails.
        </p>

        <div className="mt-12 inline-block border-2 border-ink bg-bone shadow-brutalLg p-6 md:p-8 font-term text-left text-sm leading-relaxed">
          <div className="text-acid">$ status</div>
          <div>→ confirmation sent&nbsp;[ <span className="text-acid">OK</span> ]</div>
          <div>→ waiting for click&nbsp;[<span className="animate-blink">▮</span>]</div>
          <div className="opacity-50">→ queue</div>
          <div className="opacity-50">→ generate</div>
          <div className="opacity-50">→ deliver</div>
        </div>

        <div className="mt-12 mx-auto max-w-2xl border-2 border-ink bg-acid/10 p-5 md:p-6 text-left">
          <div className="font-term text-xs uppercase tracking-widest text-acid mb-2">
            // can&rsquo;t find the email?
          </div>
          <ul className="text-sm md:text-base leading-relaxed space-y-1">
            <li className="tick">Check your spam / junk folder</li>
            <li className="tick">Search your inbox for <b>hello@keelstack.uk</b></li>
            <li className="tick">It can take up to a minute to arrive</li>
            <li className="tick">If it&rsquo;s nowhere, your email address may have a typo — try the form again</li>
          </ul>
        </div>

        <div className="mt-12">
          <Link
            href="/"
            className="brutal-btn inline-flex items-center gap-3 border-2 border-ink bg-paper px-6 py-4 font-display uppercase tracking-wider shadow-brutal"
          >
            ← Back to home
          </Link>
        </div>
      </section>
      <FunnelFooter />
    </main>
  );
}
