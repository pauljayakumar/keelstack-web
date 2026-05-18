import { NextResponse } from "next/server";
import {
  generateSEOReport,
  generateWebsitePreview,
  paymentLinkFor,
  parseVerifyToken,
  sendDeliveryEmail,
  sendInternalNotification,
} from "@/lib/funnel";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { token?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON body." }, { status: 400 });
  }

  const token = (body.token || "").trim();
  if (!token) return NextResponse.json({ error: "Missing token." }, { status: 400 });

  let parsed;
  try {
    parsed = await parseVerifyToken(token);
  } catch (err) {
    console.warn("[verify] token rejected:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "This confirmation link is invalid or has expired (links are valid for 24 hours)." }, { status: 400 });
  }

  // Studio notification — now that this is a real, confirmed lead.
  sendInternalNotification(parsed).catch((err) =>
    console.error("[verify] notify failed:", err)
  );

  // Fire the actual generation + delivery pipeline. Fire-and-forget — we
  // return success to the user immediately and let the rest run.
  if (parsed.type === "seo") {
    (async () => {
      const { artifactUrl } = await generateSEOReport(parsed.payload);
      await sendDeliveryEmail({
        to: parsed.payload.email,
        subject: `Your KEELSTACK SEO audit for ${new URL(parsed.payload.url).hostname}`,
        artifactUrl,
        paymentUrl: paymentLinkFor("seo"),
      });
    })().catch((err) => console.error("[verify-seo-delivery] failed:", err));
  } else {
    (async () => {
      const { artifactUrl } = await generateWebsitePreview(parsed.payload);
      await sendDeliveryEmail({
        to: parsed.payload.email,
        subject: `Your KEELSTACK preview for ${parsed.payload.business}`,
        artifactUrl,
        paymentUrl: paymentLinkFor("website"),
      });
    })().catch((err) => console.error("[verify-website-delivery] failed:", err));
  }

  return NextResponse.json({ ok: true, type: parsed.type });
}
