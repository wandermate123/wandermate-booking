import Link from "next/link";
import Header from "@/components/Header";

export const metadata = { title: "Booking Confirmed | WanderMate" };

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ payment_id?: string; booking?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <>
      <Header />
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6">🙏</div>
          <h1 className="font-serif text-4xl font-semibold text-[#0f2744] mb-3">
            Booking Confirmed!
          </h1>
          <p className="text-gray-500 leading-relaxed mb-6">
            Thank you for booking with WanderMate. Our host will call you within 2 hours to
            confirm your itinerary details.
          </p>

          {resolvedSearchParams.payment_id && (
            <div className="bg-[#fdf6ec] rounded-xl border border-[#e86228]/20 p-4 mb-6 inline-block text-left w-full">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Payment Reference</p>
              <p className="font-mono font-semibold text-[#0f2744] text-sm">{resolvedSearchParams.payment_id}</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_BOOKING_NUMBER}?text=Hi!%20I%20just%20completed%20my%20booking.%20Payment%20ID%3A%20${resolvedSearchParams.payment_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1cb858]
                         text-white font-semibold rounded-lg px-6 py-3 text-sm transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.128.558 4.122 1.532 5.853L0 24l6.302-1.508A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.665-.513-5.188-1.407l-.372-.221-3.865.924.988-3.744-.242-.386A9.961 9.961 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              Message us on WhatsApp
            </a>

            <Link
              href="https://www.wandermate.in"
              className="btn-outline text-sm py-3"
            >
              ← Back to WanderMate
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
