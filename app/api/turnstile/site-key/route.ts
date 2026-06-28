import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (!siteKey) {
    return NextResponse.json(
      { siteKey: null, error: "Turnstile site key is not configured." },
      { status: 503 },
    );
  }

  return NextResponse.json({ siteKey });
}
