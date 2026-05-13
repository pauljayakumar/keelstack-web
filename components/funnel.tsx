"use client";

import Link from "next/link";

export function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <label className="block mt-5">
      <span className="block font-term text-xs uppercase tracking-widest opacity-70">
        {label}
        {required && <span className="text-acid"> *</span>}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        className="mt-1.5 w-full border-2 border-ink bg-paper px-3 py-3 font-mono text-sm focus:bg-bone"
      />
    </label>
  );
}

export function FieldArea({
  label,
  name,
  placeholder,
  rows = 3,
  required,
}: {
  label: string;
  name: string;
  placeholder?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <label className="block mt-5">
      <span className="block font-term text-xs uppercase tracking-widest opacity-70">
        {label}
        {required && <span className="text-acid"> *</span>}
      </span>
      <textarea
        name={name}
        rows={rows}
        placeholder={placeholder}
        required={required}
        className="mt-1.5 w-full border-2 border-ink bg-paper px-3 py-3 font-mono text-sm focus:bg-bone resize-none"
      />
    </label>
  );
}

export function FunnelHeader() {
  return (
    <header className="border-b-2 border-ink">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-3 flex items-center justify-between text-[11px] md:text-xs uppercase tracking-[0.18em]">
        <Link href="/" className="flex items-center gap-3 hover:text-acid">
          <span className="inline-block w-3 h-3 bg-acid" />
          <span className="font-bold">KEELSTACK</span>
        </Link>
        <Link href="/" className="hover:text-acid">← Back</Link>
      </div>
    </header>
  );
}

export function FunnelFooter() {
  return (
    <footer className="border-t-2 border-ink">
      <div className="mx-auto max-w-[1400px] px-5 md:px-8 py-5 flex justify-between font-term text-xs opacity-70">
        <span>KEELSTACK // proof first</span>
        <span>no card &middot; no signup</span>
      </div>
    </footer>
  );
}
