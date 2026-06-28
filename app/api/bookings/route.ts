import {
  buildBookingAlertHtml,
  buildBookingAlertSubject,
  buildBookingAlertText,
  buildBookingConfirmationHtml,
  buildBookingConfirmationSubject,
  buildBookingConfirmationText,
} from "@/lib/email/buildBookingEmail";
import {
  hasBookingOverlap,
  timeToMinutes,
  toDatabaseTime,
  type ExistingBookingSlot,
} from "@/lib/booking/overlap";
import { getExistingBookingsForDate } from "@/lib/booking/getExistingBookings";
import { getSupabaseClient } from "@/lib/supabase";
import { verifyTurnstileToken } from "@/lib/turnstile/verifyTurnstile";
import {
  sanitizeBookingRequest,
  validateBookingRequest,
  type BookingApiRequest,
} from "@/lib/validation/bookingRequest";
import { NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

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

function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? null;
  }

  return request.headers.get("x-real-ip");
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as BookingApiRequest;

    if (body.companyWebsite?.trim()) {
      return NextResponse.json({ success: true });
    }

    const { errors, service } = validateBookingRequest(body);

    if (Object.keys(errors).length > 0 || !service) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    if (!body.turnstileToken?.trim()) {
      return NextResponse.json(
        { error: "Security verification is required. Please try again." },
        { status: 400 },
      );
    }

    const turnstileValid = await verifyTurnstileToken(
      body.turnstileToken.trim(),
      getClientIp(request),
    );

    if (!turnstileValid) {
      return NextResponse.json(
        { error: "Security verification failed. Please refresh and try again." },
        { status: 400 },
      );
    }

    let supabase;

    try {
      supabase = getSupabaseClient();
    } catch {
      return NextResponse.json(
        { error: "Booking service is not configured yet." },
        { status: 503 },
      );
    }

    const booking = sanitizeBookingRequest(body, service);

    let existingBookings: ExistingBookingSlot[];

    try {
      existingBookings = await getExistingBookingsForDate(booking.appointment_date);
    } catch (fetchError) {
      console.error("Supabase fetch error:", fetchError);
      return NextResponse.json(
        { error: "Unable to check availability right now. Please try again shortly." },
        { status: 502 },
      );
    }

    const candidateStart = timeToMinutes(booking.appointment_time);
    const overlaps = hasBookingOverlap(
      candidateStart,
      booking.duration_minutes,
      existingBookings,
    );

    if (overlaps) {
      return NextResponse.json(
        {
          error:
            "That time slot is no longer available. Please choose another date or time.",
        },
        { status: 409 },
      );
    }

    const { error: insertError } = await supabase.from("bookings").insert({
      ...booking,
      appointment_time: toDatabaseTime(booking.appointment_time),
    });

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json(
        { error: "Unable to save your booking right now. Please try again shortly." },
        { status: 502 },
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured.");
      return NextResponse.json({ success: true, emailSent: false });
    }

    const to = process.env.CONTACT_EMAIL_TO ?? "oladegafuwad7@gmail.com";
    const from =
      process.env.CONTACT_EMAIL_FROM ??
      "IMAR Saloon <onboarding@resend.dev>";
    const siteUrl = getSiteUrl(request);
    const resend = new Resend(process.env.RESEND_API_KEY);

    const [alertResult, confirmationResult] = await Promise.all([
      resend.emails.send({
        from,
        to: [to],
        replyTo: booking.customer_email,
        subject: buildBookingAlertSubject(),
        html: buildBookingAlertHtml({ booking, siteUrl }),
        text: buildBookingAlertText(booking),
      }),
      resend.emails.send({
        from,
        to: [booking.customer_email],
        subject: buildBookingConfirmationSubject(),
        html: buildBookingConfirmationHtml({ booking, siteUrl }),
        text: buildBookingConfirmationText(booking),
      }),
    ]);

    if (alertResult.error || confirmationResult.error) {
      console.error("Resend booking email error:", {
        alert: alertResult.error,
        confirmation: confirmationResult.error,
      });
      return NextResponse.json(
        {
          error:
            "Your booking was saved, but confirmation emails could not be sent. Please contact us directly.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Booking API error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
