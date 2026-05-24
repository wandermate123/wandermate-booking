import Link from "next/link";
import { format } from "date-fns";
import Header from "@/components/Header";
import { prisma } from "@/lib/db";
import { getPackage, getVariant } from "@/lib/catalog";
import { formatINR } from "@/lib/pricing";

export const metadata = { title: "Booking Confirmed | WanderMate" };

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ payment_id?: string; booking?: string }>;
}) {
  const { payment_id, booking: bookingId } = await searchParams;

  const booking = bookingId
    ? await prisma.booking.findUnique({ where: { id: bookingId } })
    : null;

  const pkg = booking ? getPackage(booking.family) : null;
  const variant = booking ? getVariant(booking.family, booking.variant) : null;

  return (
    <>
      <Header />
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
        <div className="max-w-lg w-full text-center">
          <div className="text-6xl mb-6">🙏</div>
          <h1 className="font-serif text-4xl font-semibold text-[#0f2744] mb-3">
            Booking Confirmed!
          </h1>
          <p className="text-gray-500 leading-relaxed mb-6">
            Thank you for booking with WanderMate. A confirmation email with your invoice
            has been sent to{" "}
            <span className="font-medium text-[#0f2744]">
              {booking?.email ?? "your email address"}
            </span>
            . Our host will call you within 2 hours to confirm itinerary details.
          </p>

          {booking && pkg && variant && (
            <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6 text-left w-full shadow-sm">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">
                Booking Summary
              </p>
              <div className="space-y-2 text-sm">
                <SummaryRow label="Package" value={pkg.name} />
                <SummaryRow label="Duration" value={variant.label} />
                <SummaryRow
                  label="Dates"
                  value={`${format(booking.startDate, "d MMM yyyy")} → ${format(booking.endDate, "d MMM yyyy")}`}
                />
                <SummaryRow
                  label="Guests"
                  value={`${booking.adults} adult${booking.adults === 1 ? "" : "s"}${booking.children > 0 ? `, ${booking.children} child${booking.children === 1 ? "" : "ren"}` : ""}`}
                />
                <SummaryRow label="Total paid" value={formatINR(booking.totalAmount)} highlight />
              </div>
              <p className="text-xs text-gray-400 mt-3 font-mono">ID: {booking.id}</p>
            </div>
          )}

          {payment_id && (
            <div className="bg-[#fdf6ec] rounded-xl border border-[#e86228]/20 p-4 mb-6 inline-block text-left w-full">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                Payment Reference
              </p>
              <p className="font-mono font-semibold text-[#0f2744] text-sm">{payment_id}</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_BOOKING_NUMBER}?text=Hi!%20I%20just%20completed%20my%20booking.%20Payment%20ID%3A%20${payment_id ?? ""}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1cb858]
                         text-white font-semibold rounded-lg px-6 py-3 text-sm transition-colors"
            >
              Message us on WhatsApp
            </a>

            <Link href="https://www.wandermate.in" className="btn-outline text-sm py-3">
              ← Back to WanderMate
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function SummaryRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex justify-between gap-4 ${highlight ? "font-semibold text-[#0f2744] pt-2 border-t border-gray-100" : "text-gray-600"}`}
    >
      <span>{label}</span>
      <span className={highlight ? "text-[#e86228]" : "text-[#0f2744]"}>{value}</span>
    </div>
  );
}

