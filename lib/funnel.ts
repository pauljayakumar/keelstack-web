// ---------------------------------------------------------------------------
// Funnel integration stubs.
//
// These three functions are the seams where real integrations plug in. Each
// one logs and returns a stub success today; flip the TODO blocks to live
// implementations when API keys are ready.
//
//   1. generateSEOReport      → Anthropic (writes the audit + uploads PDF)
//   2. generateWebsitePreview → Anthropic + deployer (renders + ships URL)
//   3. sendDeliveryEmail      → Resend (sends artifact + Stripe payment link)
//
// Nothing here calls a third-party today, so the funnel runs end-to-end in
// dev without keys. Look for `// TODO[wire]` markers.
// ---------------------------------------------------------------------------

export type SEORequest = {
  url: string;
  email: string;
  keywords?: string;
  notes?: string;
};

export type WebsiteRequest = {
  business: string;
  description: string;
  email: string;
  references?: string;
};

export type Delivery = {
  to: string;
  subject: string;
  artifactUrl: string;
  paymentUrl: string;
};

// ---------------------------------------------------------------------------
// INTERNAL LEAD NOTIFICATION
// Emails the studio inbox whenever a form is submitted.
// Uses cPanel SMTP. Fire-and-forget: failures log but don't block the funnel.
// ---------------------------------------------------------------------------

import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { SignJWT, jwtVerify } from "jose";

type NotifyInput =
  | { type: "seo"; payload: SEORequest }
  | { type: "website"; payload: WebsiteRequest };

// Strip ANY whitespace/control chars from front and back of env vars.
// cPanel + Amplify forms sometimes introduce trailing newlines or zero-width
// chars that break SMTP auth with "535 Incorrect authentication data".
function cleanEnv(v: string | undefined): string {
  if (!v) return "";
  return v.replace(/^[\s​-‍﻿ ]+|[\s​-‍﻿ ]+$/g, "");
}

function smtpTransport(): Transporter | null {
  const host = cleanEnv(process.env.SMTP_HOST);
  const user = cleanEnv(process.env.SMTP_USER);
  const pass = cleanEnv(process.env.SMTP_PASS);
  const port = Number(cleanEnv(process.env.SMTP_PORT) || 465);
  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    // Force LOGIN — some cPanel Exim setups reject AUTH PLAIN even with
    // correct credentials, but accept the same creds via AUTH LOGIN.
    authMethod: "LOGIN",
  });
}

export async function sendInternalNotification(input: NotifyInput): Promise<void> {
  const transporter = smtpTransport();
  const user = cleanEnv(process.env.SMTP_USER);
  const to = cleanEnv(process.env.NOTIFY_EMAIL) || "hello@keelstack.uk";

  if (!transporter) {
    console.warn("[notify] SMTP not configured (SMTP_HOST/USER/PASS missing) — skipping");
    return;
  }

  const nowIso = new Date().toISOString();
  const nowHuman = new Date().toLocaleString("en-GB", {
    timeZone: "Europe/London",
    dateStyle: "full",
    timeStyle: "long",
  });

  let subject: string;
  let leadHeader: string;
  let fields: Array<[string, string | undefined]>;
  let prospectEmail: string;

  if (input.type === "seo") {
    const p = input.payload;
    prospectEmail = p.email;
    let host = "unknown";
    try { host = new URL(p.url).hostname; } catch {}
    subject = `[KEELSTACK / SEO] New audit request — ${host}`;
    leadHeader = "New SEO audit request";
    fields = [
      ["URL", p.url],
      ["Email", p.email],
      ["Target keywords", p.keywords],
      ["Notes", p.notes],
    ];
  } else {
    const p = input.payload;
    prospectEmail = p.email;
    subject = `[KEELSTACK / WEBSITE] New build request — ${p.business}`;
    leadHeader = "New website preview request";
    fields = [
      ["Business", p.business],
      ["Description", p.description],
      ["Email", p.email],
      ["References", p.references],
    ];
  }

  const lines = fields
    .filter(([, v]) => v && String(v).trim().length > 0)
    .map(([k, v]) => `${k}:\n  ${String(v).replace(/\n/g, "\n  ")}`)
    .join("\n\n");

  const body = [
    leadHeader,
    "",
    `Submitted: ${nowHuman}`,
    `ISO:       ${nowIso}`,
    "",
    "----------------------------------------",
    "",
    lines,
    "",
    "----------------------------------------",
    "",
    "Reply directly to this email to respond to the prospect.",
  ].join("\n");

  await transporter.sendMail({
    from: `"KEELSTACK Leads" <${user}>`,
    to,
    replyTo: prospectEmail,
    subject,
    text: body,
  });
}

// ---------------------------------------------------------------------------
// DOUBLE OPT-IN VERIFICATION
// JWT-signed token carries the full form payload — no DB needed.
// Prospect clicks the link in the verification email, lands on /verify, then
// confirms; only then do we fire generation + studio notification + delivery.
// ---------------------------------------------------------------------------

const VERIFY_TOKEN_TTL = 60 * 60 * 24; // 24 hours

type VerifyPayload =
  | { type: "seo"; payload: SEORequest }
  | { type: "website"; payload: WebsiteRequest };

function verifySecret(): Uint8Array {
  const secret = process.env.VERIFY_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("VERIFY_SECRET is missing or too short (need ≥16 chars).");
  }
  return new TextEncoder().encode(secret);
}

export async function createVerifyToken(p: VerifyPayload): Promise<string> {
  return await new SignJWT({ ...p })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${VERIFY_TOKEN_TTL}s`)
    .sign(verifySecret());
}

export async function parseVerifyToken(token: string): Promise<VerifyPayload> {
  const { payload } = await jwtVerify(token, verifySecret());
  const t = payload as unknown as VerifyPayload;
  if (t.type !== "seo" && t.type !== "website") {
    throw new Error("Invalid token type");
  }
  return t;
}

function appBaseUrl(): string {
  return (process.env.APP_URL || "https://www.keelstack.uk").replace(/\/$/, "");
}

const WHITELIST_TIP_TEXT = `
Tip — so the report doesn't end up in your spam folder:
  • Gmail: open this email, click ⋮ → "Add KEELSTACK to Contacts"
  • Outlook: right-click sender → "Add to Safe Senders"
  • Apple Mail: tap sender → Add to VIPs / Contacts
Or simply reply with anything — your provider will learn we're safe.
`.trim();

export async function sendVerificationEmail(input: VerifyPayload): Promise<void> {
  const transporter = smtpTransport();
  const user = cleanEnv(process.env.SMTP_USER);

  // Diagnostic — log lengths only (never the values).
  const rawHost = process.env.SMTP_HOST || "";
  const rawUser = process.env.SMTP_USER || "";
  const rawPass = process.env.SMTP_PASS || "";
  console.log(`[verify-email] env lens: host=${rawHost.length}/${cleanEnv(rawHost).length} user=${rawUser.length}/${cleanEnv(rawUser).length} pass=${rawPass.length}/${cleanEnv(rawPass).length}`);

  if (!transporter) {
    console.warn("[verify-email] SMTP not configured — skipping (token still issued)");
    return;
  }

  const token = await createVerifyToken(input);
  const link = `${appBaseUrl()}/verify?token=${encodeURIComponent(token)}`;

  let to: string;
  let subject: string;
  let intro: string;
  let what: string;

  if (input.type === "seo") {
    to = input.payload.email;
    let host = "your site";
    try { host = new URL(input.payload.url).hostname; } catch {}
    subject = `Confirm your free SEO audit for ${host}`;
    intro = `Someone (hopefully you) just requested a free SEO audit for ${input.payload.url}.`;
    what = "Click below to confirm and we'll run the audit. The full report lands in this inbox within a few hours.";
  } else {
    to = input.payload.email;
    subject = `Confirm your free website preview for ${input.payload.business}`;
    intro = `Someone (hopefully you) just requested a free website preview for ${input.payload.business}.`;
    what = "Click below to confirm and we'll build your preview. A live URL lands in this inbox within 48 hours.";
  }

  const body = [
    intro,
    "",
    what,
    "",
    `   ${link}`,
    "",
    "If you didn't request this, just ignore this email. Nothing happens without the click above.",
    "",
    "----",
    "",
    WHITELIST_TIP_TEXT,
    "",
    "— KEELSTACK",
    "https://www.keelstack.uk",
  ].join("\n");

  await transporter.sendMail({
    from: `"KEELSTACK" <${user}>`,
    to,
    subject,
    text: body,
  });
}

// ---------------------------------------------------------------------------
// SEO REPORT
// ---------------------------------------------------------------------------

export async function generateSEOReport(req: SEORequest): Promise<{ artifactUrl: string }> {
  console.log("[seo-report] generating for", req.url, "→", req.email);

  // TODO[wire]: replace this stub with an Anthropic call that:
  //   1. Fetches the page + competitor data
  //   2. Asks Claude to produce a structured audit
  //   3. Renders the audit to a PDF and uploads it
  //
  // import Anthropic from "@anthropic-ai/sdk";
  // const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  // const result = await client.messages.create({ model: "claude-opus-4-7", ... });

  return {
    artifactUrl: `${process.env.PREVIEW_BASE_URL || "https://preview.keelstack.example"}/seo/${slug(req.url)}.pdf`,
  };
}

// ---------------------------------------------------------------------------
// WEBSITE PREVIEW
// ---------------------------------------------------------------------------

export async function generateWebsitePreview(req: WebsiteRequest): Promise<{ artifactUrl: string }> {
  console.log("[website-build] generating for", req.business, "→", req.email);

  // TODO[wire]: replace this stub with:
  //   1. An Anthropic call that drafts copy + chooses a template
  //   2. A deployer that pushes the rendered site to PREVIEW_BASE_URL
  //
  // The artifact URL here is what the prospect clicks in the email.

  return {
    artifactUrl: `${process.env.PREVIEW_BASE_URL || "https://preview.keelstack.example"}/site/${slug(req.business)}`,
  };
}

// ---------------------------------------------------------------------------
// DELIVERY EMAIL (with Stripe payment link)
// ---------------------------------------------------------------------------

export async function sendDeliveryEmail(d: Delivery): Promise<void> {
  console.log("[email] would send to", d.to, "→", d.artifactUrl, "+", d.paymentUrl);

  // TODO[wire]: replace this stub with Resend (or any transactional provider):
  //
  // import { Resend } from "resend";
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: process.env.FROM_EMAIL!,
  //   to: d.to,
  //   subject: d.subject,
  //   html: deliveryTemplate(d),
  // });
}

// ---------------------------------------------------------------------------
// STRIPE PAYMENT LINK
// ---------------------------------------------------------------------------

export function paymentLinkFor(service: "seo" | "website"): string {
  // Static payment links are simplest. If a tiered "pay as you grow" model
  // requires dynamic links, replace this with a Stripe SDK call.
  if (service === "seo") {
    return process.env.STRIPE_PAYMENT_LINK_SEO || "https://buy.stripe.com/test_seo_placeholder";
  }
  return process.env.STRIPE_PAYMENT_LINK_WEBSITE || "https://buy.stripe.com/test_website_placeholder";
}

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

export function isValidEmail(e: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

export function isValidUrl(u: string): boolean {
  try {
    const parsed = new URL(u);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
