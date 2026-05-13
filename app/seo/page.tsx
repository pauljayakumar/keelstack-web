"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field, FieldArea, FunnelFooter, FunnelHeader } from "@/components/funnel";

export default function SEOFunnel() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const res = await fetch("/api/seo-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something broke. Try again.");
      }
      router.push("/thanks?service=seo");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  return (
    <main className="min-h-screen">
      <FunnelHeader />
      <section className="mx-auto max-w-[1100px] px-5 md:px-8 py-14 md:py-20 grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-7">
          <div className="font-term text-acid text-sm uppercase tracking-[0.25em]">
            / 01 — SEO REPORT
          </div>
          <h1 className="font-display uppercase text-5xl md:text-7xl mt-3 leading-[0.9]">
            Show us your
            <br /> URL. We&rsquo;ll
            <br /> show you the
            <br /> <span className="acid-underline">weak spots.</span>
          </h1>
          <p className="mt-6 max-w-xl leading-relaxed">
            Full audit delivered to your inbox by end of day — quick wins, competitive
            gaps, schema/meta fixes, content rewrites. No card now. If the report earns its price,
            the next email has a payment link. If not, you delete it.
          </p>

          <ul className="mt-8 space-y-2 text-sm border-l-2 border-ink pl-5">
            <li className="tick">Same-day turnaround</li>
            <li className="tick">PDF + live page</li>
            <li className="tick">Payment link only after delivery</li>
          </ul>
        </div>

        <form
          onSubmit={onSubmit}
          className="col-span-12 lg:col-span-5 border-2 border-ink bg-bone p-6 md:p-7 shadow-brutalLg"
        >
          <div className="font-term text-xs uppercase tracking-widest text-acid">
            // request the audit
          </div>
          <Field
            label="Website URL"
            name="url"
            type="url"
            placeholder="https://yoursite.com"
            required
          />
          <Field
            label="Email"
            name="email"
            type="email"
            placeholder="you@yourdomain.com"
            required
          />
          <Field
            label="Target keywords (optional)"
            name="keywords"
            type="text"
            placeholder="e.g. lithium battery wholesale, b2b"
          />
          <FieldArea
            label="Anything we should know?"
            name="notes"
            placeholder="Audience, competitors, what you've already tried..."
          />

          {error && (
            <div className="mt-4 border-2 border-acid bg-acid/10 p-3 text-sm font-term">
              ⚠ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="brutal-btn brutal-btn-acid mt-6 w-full border-2 border-ink bg-acid text-paper px-5 py-4 font-display uppercase tracking-wider text-lg shadow-brutal disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-3"
          >
            {status === "loading" ? (
              <>Submitting<span className="animate-blink">_</span></>
            ) : (
              <>Run my free audit <span aria-hidden>→</span></>
            )}
          </button>

          <p className="mt-4 font-term text-[11px] opacity-70 leading-relaxed">
            ⌁ We never share your URL or email. The report is generated, sent, and not used to
            train anything. You can ask for deletion anytime.
          </p>
        </form>
      </section>
      <FunnelFooter />
    </main>
  );
}
