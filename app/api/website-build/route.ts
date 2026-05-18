import { NextResponse } from "next/server";
import {
  isValidEmail,
  sendVerificationEmail,
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

  // Send the confirmation email. We do NOT trigger generation or studio
  // notification here — that happens after the prospect clicks the link.
  try {
    await sendVerificationEmail({ type: "website", payload: request });
  } catch (err) {
    console.error("[website-verify-email] failed:", err);
    return NextResponse.json({ error: "Couldn't send the confirmation email. Try again, or check the address." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
