"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field, FieldArea, FunnelFooter, FunnelHeader } from "@/components/funnel";

export default function WebsiteFunnel() {
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
      const res = await fetch("/api/website-build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something broke. Try again.");
      }
      router.push("/thanks?service=website");
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
            / 02 — WEBSITE PREVIEW
          </div>
          <h1 className="font-display uppercase text-5xl md:text-7xl mt-3 leading-[0.9]">
            Tell us what
            <br /> you do. We&rsquo;ll
            <br /> ship a website
            <br /> <span className="acid-underline">at a real URL.</span>
          </h1>
          <p className="mt-6 max-w-xl leading-relaxed">
            Multi-page, mobile-first, your brand and your copy. We build, deploy, and email you a
            preview link within 48 hours. If you like it, the next email has a payment link
            and we hand over the code, the domain, and the hosting in your name.
          </p>

          <ul className="mt-8 space-y-2 text-sm border-l-2 border-ink pl-5">
            <li className="tick">48-hour turnaround</li>
            <li className="tick">Live preview URL</li>
            <li className="tick">Pay only after you walk through it</li>
          </ul>
        </div>

        <form
          onSubmit={onSubmit}
          className="col-span-12 lg:col-span-5 border-2 border-ink bg-bone p-6 md:p-7 shadow-brutalLg"
        >
          <div className="font-term text-xs uppercase tracking-widest text-acid">
            // request the build
          </div>
          <Field
            label="Business / project name"
            name="business"
            placeholder="Greybar Welding Co."
            required
          />
          <FieldArea
            label="What do you do? (3 sentences)"
            name="description"
            rows={4}
            placeholder="Who you serve, what you sell, and what makes you different."
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
            label="Existing site or references (optional)"
            name="references"
            placeholder="https://current-site.com, or a brand you like"
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
              <>Build my free preview <span aria-hidden>→</span></>
            )}
          </button>

          <p className="mt-4 font-term text-[11px] opacity-70 leading-relaxed">
            ⌁ The preview lives on our subdomain until you pay. After payment, the code, the
            domain, and the hosting all transfer to you.
          </p>
        </form>
      </section>
      <FunnelFooter />
    </main>
  );
}
