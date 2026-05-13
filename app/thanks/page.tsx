import Link from "next/link";
import { FunnelFooter, FunnelHeader } from "@/components/funnel";

type SP = { service?: string };

export default function Thanks({ searchParams }: { searchParams: SP }) {
  const isSEO = searchParams.service === "seo";
  const eta = isSEO ? "by end of day" : "within 48 hours";
  const what = isSEO ? "your full SEO audit" : "your live website preview";
  const label = isSEO ? "SEO REPORT" : "WEBSITE PREVIEW";

  return (
    <main className="min-h-screen">
      <FunnelHeader />
      <section className="mx-auto max-w-[1000px] px-5 md:px-8 py-20 md:py-32 text-center">
        <div className="font-term text-acid text-sm uppercase tracking-[0.3em]">
          / received — {label}
        </div>
        <h1 className="font-display uppercase text-6xl md:text-8xl mt-4 leading-[0.9]">
          We&rsquo;re on it<span className="text-acid">.</span>
        </h1>
        <p className="mt-8 max-w-2xl mx-auto text-base md:text-lg leading-relaxed">
          We&rsquo;re on it. {eta[0].toUpperCase() + eta.slice(1)} you&rsquo;ll get an email with {what} — a real artifact,
          not a summary. Read it, click around, decide. If you want to pay, the email has a link.
          If you don&rsquo;t, you&rsquo;re done. No follow-up.
        </p>

        <div className="mt-12 inline-block border-2 border-ink bg-bone shadow-brutalLg p-6 md:p-8 font-term text-left text-sm leading-relaxed">
          <div className="text-acid">$ status</div>
          <div>→ queued&nbsp;&nbsp;[ <span className="text-acid">OK</span> ]</div>
          <div>→ generating&nbsp;[<span className="animate-blink">▮</span>]</div>
          <div className="opacity-50">→ deliver</div>
          <div className="opacity-50">→ wait for your reply</div>
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
