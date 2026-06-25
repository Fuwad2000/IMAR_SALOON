import {
  buildContactEmailHtml,
  buildContactEmailSubject,
  buildContactEmailText,
} from "@/lib/email/buildContactEmail";
import {
  sanitizeContactForm,
  validateContactForm,
  type ContactFormPayload,
} from "@/lib/validation/contactForm";
import { NextResponse } from "next/server";
import { Resend } from "resend";

function getSiteUrl(request: Request): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  const origin = request.headers.get("origin");
  if (origin) return origin;

  const host = request.headers.get("host");
  if (host) return `https://${host}`;

  return "http://localhost:3000";
}

export async function POST(request: Request) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Email service is not configured yet." },
        { status: 503 },
      );
    }

    const body = (await request.json()) as ContactFormPayload;
    const errors = validateContactForm(body);

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const payload = sanitizeContactForm(body);
    const to = process.env.CONTACT_EMAIL_TO ?? "oladegafuwad7@gmail.com";
    const from =
      process.env.CONTACT_EMAIL_FROM ??
      "IMAR Saloon <onboarding@resend.dev>";
    const siteUrl = getSiteUrl(request);
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: payload.email,
      subject: buildContactEmailSubject(),
      html: buildContactEmailHtml({ payload, siteUrl }),
      text: buildContactEmailText(payload),
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Unable to send your message right now. Please try again shortly." },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
