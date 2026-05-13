import { NextResponse } from "next/server";
import {
  generateSEOReport,
  isValidEmail,
  isValidUrl,
  paymentLinkFor,
  sendDeliveryEmail,
  type SEORequest,
} from "@/lib/funnel";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: Partial<SEORequest>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON body." }, { status: 400 });
  }

  const url = (body.url || "").trim();
  const email = (body.email || "").trim();
  const keywords = (body.keywords || "").trim() || undefined;
  const notes = (body.notes || "").trim() || undefined;

  if (!isValidUrl(url)) return NextResponse.json({ error: "Please provide a valid URL." }, { status: 400 });
  if (!isValidEmail(email)) return NextResponse.json({ error: "Please provide a valid email." }, { status: 400 });

  // Kick off generation + delivery. In production these would be queued, not
  // awaited inline — but the stub returns instantly so it's fine here.
  const request: SEORequest = { url, email, keywords, notes };
  const { artifactUrl } = await generateSEOReport(request);

  await sendDeliveryEmail({
    to: email,
    subject: `Your KEELSTACK SEO audit for ${new URL(url).hostname}`,
    artifactUrl,
    paymentUrl: paymentLinkFor("seo"),
  });

  return NextResponse.json({ ok: true });
}
