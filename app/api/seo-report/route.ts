import { NextResponse } from "next/server";
import {
  isValidEmail,
  isValidUrl,
  sendVerificationEmail,
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

  const request: SEORequest = { url, email, keywords, notes };

  // Send the confirmation email. We do NOT trigger generation or studio
  // notification here — that happens after the prospect clicks the link.
  try {
    await sendVerificationEmail({ type: "seo", payload: request });
  } catch (err) {
    console.error("[seo-verify-email] failed:", err);
    return NextResponse.json({ error: "Couldn't send the confirmation email. Try again, or check the address." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
