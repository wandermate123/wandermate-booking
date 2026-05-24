import type { Booking } from "@prisma/client";
import { format } from "date-fns";
import { Resend } from "resend";
import { ADD_ONS, getPackage, getVariant } from "./catalog";
import { formatINR } from "./pricing";

function addOnLabel(id: string): string {
  return ADD_ONS.find((a) => a.id === id)?.name ?? id;
}

export function buildInvoiceHtml(booking: Booking, paymentId?: string): string {
  const pkg = getPackage(booking.family);
  const variant = getVariant(booking.family, booking.variant);
  const packageName = pkg?.name ?? booking.family;
  const variantLabel = variant?.label ?? booking.variant;
  const addOnLines =
    booking.addOns.length > 0
      ? booking.addOns.map((id) => `<li>${addOnLabel(id)}</li>`).join("")
      : "<li>None</li>";

  const packageAmount = booking.adultTotal + booking.childTotal;
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_BOOKING_NUMBER ?? "";

  return `<!DOCTYPE html>
<html>
<body style="font-family:Georgia,serif;background:#f9f9f9;margin:0;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #eee;">
    <div style="background:#0f2744;color:#fff;padding:24px;">
      <p style="margin:0 0 4px;font-size:12px;color:#e86228;letter-spacing:2px;text-transform:uppercase;">WanderMate</p>
      <h1 style="margin:0;font-size:22px;">Booking Confirmed</h1>
      <p style="margin:8px 0 0;color:#ccc;font-size:14px;">Namaste, ${booking.name}.</p>
    </div>
    <div style="padding:24px;">
      <p style="margin:0 0 16px;color:#555;font-size:14px;line-height:1.6;">
        Thank you for booking with WanderMate. Our host will call you within 2 hours to confirm itinerary details.
        Please keep this email as your invoice.
      </p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px;">
        <tr><td colspan="2" style="padding:8px 0;font-weight:bold;color:#0f2744;border-bottom:2px solid #0f2744;">Trip Details</td></tr>
        <tr><td style="padding:6px 0;color:#888;width:140px;">Booking ID</td><td style="padding:6px 0;font-family:monospace;">${booking.id}</td></tr>
        <tr><td style="padding:6px 0;color:#888;">Package</td><td style="padding:6px 0;">${packageName}</td></tr>
        <tr><td style="padding:6px 0;color:#888;">Duration</td><td style="padding:6px 0;">${variantLabel}</td></tr>
        <tr><td style="padding:6px 0;color:#888;">Travel dates</td><td style="padding:6px 0;">${format(booking.startDate, "d MMM yyyy")} → ${format(booking.endDate, "d MMM yyyy")}</td></tr>
        <tr><td style="padding:6px 0;color:#888;">Guests</td><td style="padding:6px 0;">${booking.adults} adult${booking.adults === 1 ? "" : "s"}${booking.children > 0 ? `, ${booking.children} child${booking.children === 1 ? "" : "ren"}` : ""}</td></tr>
        <tr><td style="padding:6px 0;color:#888;">Add-ons</td><td style="padding:6px 0;"><ul style="margin:0;padding-left:18px;">${addOnLines}</ul></td></tr>
      </table>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px;">
        <tr><td colspan="2" style="padding:8px 0;font-weight:bold;color:#0f2744;border-bottom:2px solid #0f2744;">Invoice</td></tr>
        <tr><td style="padding:8px 0;color:#555;">${packageName} — ${variantLabel}</td><td style="padding:8px 0;text-align:right;">${formatINR(packageAmount)}</td></tr>
        ${booking.addOnTotal > 0 ? `<tr><td style="padding:8px 0;color:#555;">Add-ons</td><td style="padding:8px 0;text-align:right;">${formatINR(booking.addOnTotal)}</td></tr>` : ""}
        ${booking.taxAmount > 0 ? `<tr><td style="padding:8px 0;color:#555;">Tax / service charges</td><td style="padding:8px 0;text-align:right;">${formatINR(booking.taxAmount)}</td></tr>` : ""}
        <tr><td style="padding:12px 0;font-weight:bold;color:#0f2744;border-top:2px solid #eee;">Total Paid</td><td style="padding:12px 0;text-align:right;font-weight:bold;font-size:18px;color:#e86228;border-top:2px solid #eee;">${formatINR(booking.totalAmount)}</td></tr>
      </table>
      ${paymentId ? `<p style="margin:0 0 16px;font-size:13px;color:#888;">Payment reference: <span style="font-family:monospace;color:#0f2744;">${paymentId}</span></p>` : ""}
      <p style="margin:0;font-size:13px;color:#888;line-height:1.6;">Questions? WhatsApp us at +${whatsapp}.</p>
    </div>
    <div style="background:#fdf6ec;padding:16px 24px;text-align:center;font-size:12px;color:#888;">
      WanderMate · <a href="https://www.wandermate.in" style="color:#e86228;">wandermate.in</a>
    </div>
  </div>
</body>
</html>`;
}

export async function sendBookingConfirmationEmail(
  booking: Booking,
  paymentId?: string
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.BOOKING_FROM_EMAIL ?? "WanderMate <bookings@wandermate.in>";

  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — skipping confirmation email");
    return false;
  }

  const resend = new Resend(apiKey);
  const html = buildInvoiceHtml(booking, paymentId);

  const { error } = await resend.emails.send({
    from,
    to: booking.email,
    subject: `Booking confirmed — ${getPackage(booking.family)?.name ?? "WanderMate"} | Invoice ${booking.id.slice(-8).toUpperCase()}`,
    html,
  });

  if (error) {
    console.error("[email] Failed to send confirmation:", error);
    return false;
  }

  return true;
}
