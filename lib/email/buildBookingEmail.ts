import { formatBookingDate, formatBookingTime } from "@/lib/booking/availability";
import type { SanitizedBookingInsert } from "@/lib/validation/bookingRequest";

type BuildBookingEmailOptions = {
  booking: SanitizedBookingInsert;
  siteUrl: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatBookingSummary(booking: SanitizedBookingInsert) {
  return {
    service: booking.service_name,
    date: formatBookingDate(booking.appointment_date),
    time: formatBookingTime(booking.appointment_time),
    duration: `${booking.duration_minutes} minutes`,
    name: booking.customer_name,
    phone: booking.customer_phone,
    email: booking.customer_email,
    notes: booking.notes ?? "",
  };
}

export function buildBookingAlertSubject(): string {
  return "IMAR Saloon Booking Alert";
}

export function buildBookingConfirmationSubject(): string {
  return "Your IMAR Saloon booking request";
}

export function buildBookingAlertHtml({
  booking,
  siteUrl,
}: BuildBookingEmailOptions): string {
  const logoUrl = `${siteUrl.replace(/\/$/, "")}/images/logo.jpeg`;
  const submittedAt = new Date().toLocaleString("en-CA", {
    timeZone: "America/Toronto",
    dateStyle: "full",
    timeStyle: "short",
  });
  const summary = formatBookingSummary(booking);

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>IMAR Saloon Booking Alert</title>
  </head>
  <body style="margin:0;padding:0;background-color:#0a0a0a;font-family:Arial,Helvetica,sans-serif;color:#ededed;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0a0a0a;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background-color:#111111;border:1px solid #3a3018;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="height:4px;background:linear-gradient(to right,#a8862a,#d4af37,#f5d060,#d4af37,#a8862a);"></td>
            </tr>
            <tr>
              <td style="padding:32px 32px 24px;text-align:center;background-color:#0a0a0a;">
                <img src="${logoUrl}" alt="IMAR Young Legend Barber Shop" width="88" height="88" style="display:block;margin:0 auto 16px;border-radius:999px;border:2px solid #d4af37;" />
                <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.28em;text-transform:uppercase;color:#f5d060;">Young Legend</p>
                <h1 style="margin:0;font-size:28px;line-height:1.2;color:#d4af37;text-transform:uppercase;letter-spacing:0.08em;">IMAR Saloon Booking Alert</h1>
                <p style="margin:12px 0 0;font-size:14px;color:#b8b8b8;">New appointment request from your website</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 32px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#151515;border:1px solid #2d2614;border-radius:12px;">
                  <tr>
                    <td style="padding:24px;">
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;font-size:12px;text-transform:uppercase;letter-spacing:0.14em;color:#d4af37;width:120px;">Service</td>
                          <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;font-size:15px;color:#ffffff;">${escapeHtml(summary.service)}</td>
                        </tr>
                        <tr>
                          <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;font-size:12px;text-transform:uppercase;letter-spacing:0.14em;color:#d4af37;">Date</td>
                          <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;font-size:15px;color:#ffffff;">${escapeHtml(summary.date)}</td>
                        </tr>
                        <tr>
                          <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;font-size:12px;text-transform:uppercase;letter-spacing:0.14em;color:#d4af37;">Time</td>
                          <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;font-size:15px;color:#ffffff;">${escapeHtml(summary.time)}</td>
                        </tr>
                        <tr>
                          <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;font-size:12px;text-transform:uppercase;letter-spacing:0.14em;color:#d4af37;">Duration</td>
                          <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;font-size:15px;color:#ffffff;">${escapeHtml(summary.duration)}</td>
                        </tr>
                        <tr>
                          <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;font-size:12px;text-transform:uppercase;letter-spacing:0.14em;color:#d4af37;">Name</td>
                          <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;font-size:15px;color:#ffffff;">${escapeHtml(summary.name)}</td>
                        </tr>
                        <tr>
                          <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;font-size:12px;text-transform:uppercase;letter-spacing:0.14em;color:#d4af37;">Phone</td>
                          <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;font-size:15px;color:#ffffff;">${escapeHtml(summary.phone)}</td>
                        </tr>
                        <tr>
                          <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;font-size:12px;text-transform:uppercase;letter-spacing:0.14em;color:#d4af37;">Email</td>
                          <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;font-size:15px;color:#ffffff;">
                            <a href="mailto:${escapeHtml(summary.email)}" style="color:#f5d060;text-decoration:none;">${escapeHtml(summary.email)}</a>
                          </td>
                        </tr>
                        ${
                          summary.notes
                            ? `<tr>
                          <td style="padding:16px 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:0.14em;color:#d4af37;vertical-align:top;">Notes</td>
                          <td style="padding:16px 0 8px;font-size:15px;line-height:1.7;color:#ededed;">${escapeHtml(summary.notes).replaceAll("\n", "<br />")}</td>
                        </tr>`
                            : ""
                        }
                      </table>
                    </td>
                  </tr>
                </table>
                <p style="margin:20px 0 0;font-size:12px;line-height:1.6;color:#888888;text-align:center;">
                  Received on ${submittedAt} · Status: pending confirmation
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();
}

export function buildBookingAlertText(booking: SanitizedBookingInsert): string {
  const summary = formatBookingSummary(booking);

  return [
    "IMAR Saloon Booking Alert",
    "",
    "New appointment request from your website.",
    "",
    `Service: ${summary.service}`,
    `Date: ${summary.date}`,
    `Time: ${summary.time}`,
    `Duration: ${summary.duration}`,
    `Name: ${summary.name}`,
    `Phone: ${summary.phone}`,
    `Email: ${summary.email}`,
    summary.notes ? "" : undefined,
    summary.notes ? `Notes: ${summary.notes}` : undefined,
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildBookingConfirmationHtml({
  booking,
  siteUrl,
}: BuildBookingEmailOptions): string {
  const logoUrl = `${siteUrl.replace(/\/$/, "")}/images/logo.jpeg`;
  const summary = formatBookingSummary(booking);

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your IMAR Saloon booking request</title>
  </head>
  <body style="margin:0;padding:0;background-color:#0a0a0a;font-family:Arial,Helvetica,sans-serif;color:#ededed;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0a0a0a;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background-color:#111111;border:1px solid #3a3018;border-radius:16px;overflow:hidden;">
            <tr>
              <td style="height:4px;background:linear-gradient(to right,#a8862a,#d4af37,#f5d060,#d4af37,#a8862a);"></td>
            </tr>
            <tr>
              <td style="padding:32px 32px 24px;text-align:center;background-color:#0a0a0a;">
                <img src="${logoUrl}" alt="IMAR Young Legend Barber Shop" width="88" height="88" style="display:block;margin:0 auto 16px;border-radius:999px;border:2px solid #d4af37;" />
                <h1 style="margin:0;font-size:28px;line-height:1.2;color:#d4af37;">Booking Request Received</h1>
                <p style="margin:12px 0 0;font-size:14px;color:#b8b8b8;">Thanks ${escapeHtml(summary.name)}, your request is in.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 32px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#151515;border:1px solid #2d2614;border-radius:12px;">
                  <tr>
                    <td style="padding:24px;font-size:15px;line-height:1.7;color:#ededed;">
                      <p style="margin:0 0 16px;">We received your appointment request and Imar will confirm your booking shortly.</p>
                      <p style="margin:0 0 8px;"><strong style="color:#d4af37;">Service:</strong> ${escapeHtml(summary.service)}</p>
                      <p style="margin:0 0 8px;"><strong style="color:#d4af37;">Date:</strong> ${escapeHtml(summary.date)}</p>
                      <p style="margin:0 0 8px;"><strong style="color:#d4af37;">Time:</strong> ${escapeHtml(summary.time)}</p>
                      <p style="margin:0;"><strong style="color:#d4af37;">Duration:</strong> ${escapeHtml(summary.duration)}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();
}

export function buildBookingConfirmationText(booking: SanitizedBookingInsert): string {
  const summary = formatBookingSummary(booking);

  return [
    "Your IMAR Saloon booking request",
    "",
    `Hi ${summary.name},`,
    "",
    "We received your appointment request and Imar will confirm your booking shortly.",
    "",
    `Service: ${summary.service}`,
    `Date: ${summary.date}`,
    `Time: ${summary.time}`,
    `Duration: ${summary.duration}`,
  ].join("\n");
}
