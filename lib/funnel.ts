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

type NotifyInput =
  | { type: "seo"; payload: SEORequest }
  | { type: "website"; payload: WebsiteRequest };

export async function sendInternalNotification(input: NotifyInput): Promise<void> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = process.env.NOTIFY_EMAIL || "hello@keelstack.uk";
  const port = Number(process.env.SMTP_PORT || 465);

  if (!host || !user || !pass) {
    console.warn("[notify] SMTP not configured (SMTP_HOST/USER/PASS missing) — skipping");
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

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
