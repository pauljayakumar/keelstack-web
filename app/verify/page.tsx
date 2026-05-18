"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { FunnelFooter, FunnelHeader } from "@/components/funnel";

export default function VerifyPage() {
  return (
    <Suspense fallback={null}>
      <VerifyInner />
    </Suspense>
  );
}

function VerifyInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const valid = token.length > 0;

  async function onConfirm() {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Confirmation failed.");
      router.push(`/verified?type=${data.type || ""}`);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  return (
    <main className="min-h-screen">
      <FunnelHeader />
      <section className="mx-auto max-w-[900px] px-5 md:px-8 py-16 md:py-24">
        <div className="font-term text-acid text-sm uppercase tracking-[0.25em]">
          / confirm your request
        </div>
        <h1 className="font-display uppercase text-5xl md:text-7xl mt-3 leading-[0.9]">
          One click,
          <br />
          and we&rsquo;re <span className="acid-underline">on it.</span>
        </h1>
        <p className="mt-6 max-w-2xl leading-relaxed">
          You requested a free deliverable from KEELSTACK. Confirming below tells us this email
          address is yours, kicks off the work, and warms up your inbox so the report doesn&rsquo;t
          land in spam.
        </p>

        {!valid && (
          <div className="mt-8 border-2 border-acid bg-acid/10 p-4 font-term text-sm">
            ⚠ No confirmation token in this URL. Try the link from your email again.
          </div>
        )}

        {valid && (
          <div className="mt-10 border-2 border-ink bg-bone p-6 md:p-8 shadow-brutalLg">
            <button
              onClick={onConfirm}
              disabled={status === "loading"}
              className="brutal-btn brutal-btn-acid w-full border-2 border-ink bg-acid text-paper px-6 py-5 font-display uppercase tracking-wider text-xl md:text-2xl shadow-brutal disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-3"
            >
              {status === "loading" ? (
                <>Confirming<span className="animate-blink">_</span></>
              ) : (
                <>Yes, run my free job <span aria-hidden>→</span></>
              )}
            </button>

            {error && (
              <div className="mt-4 border-2 border-acid bg-acid/10 p-3 text-sm font-term">
                ⚠ {error}
              </div>
            )}

            <div className="mt-7 border-t-2 border-ink/30 pt-5 font-term text-sm leading-relaxed">
              <div className="text-acid uppercase tracking-widest text-xs mb-2">
                // while you&rsquo;re here
              </div>
              <p>
                Add <b>hello@keelstack.uk</b> to your contacts so the report doesn&rsquo;t end up
                in spam.
              </p>
              <ul className="mt-3 space-y-1 text-xs opacity-80">
                <li className="tick">Gmail: open this email → ⋮ → &ldquo;Add KEELSTACK to Contacts&rdquo;</li>
                <li className="tick">Outlook: right-click sender → &ldquo;Add to Safe Senders&rdquo;</li>
                <li className="tick">Apple Mail: tap sender → Add to VIPs / Contacts</li>
              </ul>
            </div>
          </div>
        )}

        <div className="mt-10">
          <Link href="/" className="font-term text-sm hover:text-acid">← back to home</Link>
        </div>
      </section>
      <FunnelFooter />
    </main>
  );
}
