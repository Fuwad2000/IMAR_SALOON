import type { ContactFormPayload } from "@/lib/validation/contactForm";

type BuildContactEmailOptions = {
  payload: ContactFormPayload;
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

export function buildContactEmailSubject(): string {
  return "IMAR Saloon Alert";
}

export function buildContactEmailHtml({
  payload,
  siteUrl,
}: BuildContactEmailOptions): string {
  const logoUrl = `${siteUrl.replace(/\/$/, "")}/images/logo.jpeg`;
  const submittedAt = new Date().toLocaleString("en-CA", {
    timeZone: "America/Toronto",
    dateStyle: "full",
    timeStyle: "short",
  });

  const name = escapeHtml(payload.name);
  const phone = escapeHtml(payload.phone);
  const email = escapeHtml(payload.email);
  const message = escapeHtml(payload.message).replaceAll("\n", "<br />");

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>IMAR Saloon Alert</title>
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
                <h1 style="margin:0;font-size:28px;line-height:1.2;color:#d4af37;text-transform:uppercase;letter-spacing:0.08em;">IMAR Saloon Alert</h1>
                <p style="margin:12px 0 0;font-size:14px;color:#b8b8b8;">New contact form message from your website</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 32px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#151515;border:1px solid #2d2614;border-radius:12px;">
                  <tr>
                    <td style="padding:24px;">
                      <p style="margin:0 0 18px;font-size:13px;line-height:1.6;color:#cccccc;">
                        A client submitted a message through the IMAR Saloon contact page. Details are below.
                      </p>
                      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;font-size:12px;text-transform:uppercase;letter-spacing:0.14em;color:#d4af37;width:120px;">Name</td>
                          <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;font-size:15px;color:#ffffff;">${name}</td>
                        </tr>
                        <tr>
                          <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;font-size:12px;text-transform:uppercase;letter-spacing:0.14em;color:#d4af37;">Phone</td>
                          <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;font-size:15px;color:#ffffff;">${phone}</td>
                        </tr>
                        <tr>
                          <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;font-size:12px;text-transform:uppercase;letter-spacing:0.14em;color:#d4af37;">Email</td>
                          <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;font-size:15px;color:#ffffff;">
                            <a href="mailto:${email}" style="color:#f5d060;text-decoration:none;">${email}</a>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:16px 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:0.14em;color:#d4af37;vertical-align:top;">Message</td>
                          <td style="padding:16px 0 8px;font-size:15px;line-height:1.7;color:#ededed;">${message}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <p style="margin:20px 0 0;font-size:12px;line-height:1.6;color:#888888;text-align:center;">
                  Received on ${submittedAt} · Reply directly to the client using their email address above.
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

export function buildContactEmailText(payload: ContactFormPayload): string {
  return [
    "IMAR Saloon Alert",
    "",
    "New contact form message from your website.",
    "",
    `Name: ${payload.name}`,
    `Phone: ${payload.phone}`,
    `Email: ${payload.email}`,
    "",
    "Message:",
    payload.message,
  ].join("\n");
}
