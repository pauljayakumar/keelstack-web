import Link from "next/link";
import { FunnelFooter, FunnelHeader } from "@/components/funnel";

type SP = { type?: string };

export default function Verified({ searchParams }: { searchParams: SP }) {
  const isSEO = searchParams.type === "seo";
  const eta = isSEO ? "by end of day" : "within 48 hours";
  const what = isSEO ? "your full SEO audit" : "your live website preview";

  return (
    <main className="min-h-screen">
      <FunnelHeader />
      <section className="mx-auto max-w-[1000px] px-5 md:px-8 py-20 md:py-28 text-center">
        <div className="font-term text-acid text-sm uppercase tracking-[0.3em]">
          / confirmed
        </div>
        <h1 className="font-display uppercase text-6xl md:text-8xl mt-4 leading-[0.9]">
          Got it<span className="text-acid">.</span>
        </h1>
        <p className="mt-8 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
          We&rsquo;re on it. {eta[0].toUpperCase() + eta.slice(1)} you&rsquo;ll get an email with{" "}
          {what} — a real artifact, not a summary. Read it, click around, decide. If you want
          to pay, the email has a link. If you don&rsquo;t, you&rsquo;re done. No follow-up.
        </p>

        <div className="mt-12 inline-block border-2 border-ink bg-bone shadow-brutalLg p-6 md:p-8 font-term text-left text-sm leading-relaxed">
          <div className="text-acid">$ status</div>
          <div>→ verified&nbsp;[ <span className="text-acid">OK</span> ]</div>
          <div>→ queued&nbsp;&nbsp;&nbsp;[ <span className="text-acid">OK</span> ]</div>
          <div>→ generating[<span className="animate-blink">▮</span>]</div>
          <div className="opacity-50">→ deliver</div>
        </div>

        <div className="mt-12 mx-auto max-w-2xl border-2 border-ink bg-acid/10 p-5 md:p-6 text-left">
          <div className="font-term text-xs uppercase tracking-widest text-acid mb-2">
            // one last thing
          </div>
          <p className="text-sm md:text-base leading-relaxed">
            <b>Add hello@keelstack.uk to your contacts now.</b> Inbox providers learn fast — adding
            us before the audit lands is the single biggest thing you can do to make sure the
            report doesn&rsquo;t get filtered to spam.
          </p>
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
