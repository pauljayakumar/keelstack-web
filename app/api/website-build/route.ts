import { NextResponse } from "next/server";
import {
  generateWebsitePreview,
  isValidEmail,
  paymentLinkFor,
  sendDeliveryEmail,
  sendInternalNotification,
  type WebsiteRequest,
} from "@/lib/funnel";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: Partial<WebsiteRequest>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON body." }, { status: 400 });
  }

  const business = (body.business || "").trim();
  const description = (body.description || "").trim();
  const email = (body.email || "").trim();
  const references = (body.references || "").trim() || undefined;

  if (!business) return NextResponse.json({ error: "Business name is required." }, { status: 400 });
  if (description.length < 20) {
    return NextResponse.json({ error: "Tell us a little more — at least a sentence or two." }, { status: 400 });
  }
  if (!isValidEmail(email)) return NextResponse.json({ error: "Please provide a valid email." }, { status: 400 });

  const request: WebsiteRequest = { business, description, email, references };

  // Internal lead notification — fire-and-forget so it can't break the funnel.
  sendInternalNotification({ type: "website", payload: request }).catch((err) =>
    console.error("[notify-website] failed:", err)
  );

  const { artifactUrl } = await generateWebsitePreview(request);

  await sendDeliveryEmail({
    to: email,
    subject: `Your KEELSTACK preview for ${business}`,
    artifactUrl,
    paymentUrl: paymentLinkFor("website"),
  });

  return NextResponse.json({ ok: true });
}
