import Link from "next/link";
import Header from "@/components/Header";
import { isVaranasiFamily, PACKAGES } from "@/lib/catalog";
import { formatINR, getGroupQuote } from "@/lib/pricing";

export const metadata = { title: "Choose a Package | WanderMate" };

export default function BookPickerPage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="bg-[#0f2744] text-white py-16 px-4 text-center">
        <p className="text-[#e86228] text-xs font-semibold uppercase tracking-widest mb-3">
          Book Online
        </p>
        <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-4 leading-tight">
          Choose Your Journey
        </h1>
        <p className="text-gray-300 max-w-xl mx-auto text-base leading-relaxed">
          Curated, private tours crafted for travellers who want more than sightseeing.
          Pick a package and duration that suits you.
        </p>
      </section>

      {/* Package cards */}
      <section className="max-w-6xl mx-auto px-4 py-14 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PACKAGES.map((pkg) => (
          <div
            key={pkg.family}
            className="card overflow-hidden flex flex-col hover:shadow-md transition-shadow"
          >
            {/* Card header */}
            <div className="bg-[#0f2744] px-6 py-7">
              <h2 className="font-serif text-2xl font-semibold text-white mb-1">
                {pkg.name}
              </h2>
              <p className="text-[#e86228] text-sm font-medium">{pkg.subtitle}</p>
            </div>

            {/* Body */}
            <div className="p-6 flex-1 flex flex-col">
              <p className="text-gray-500 text-sm leading-relaxed mb-5">{pkg.tagline}</p>

              {/* Highlights */}
              <ul className="space-y-1.5 mb-6">
                {pkg.highlights.slice(0, 4).map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-[#e86228] mt-0.5">✦</span>
                    {h}
                  </li>
                ))}
              </ul>

              {/* Duration options */}
              <div className="mt-auto">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                  Select duration
                </p>
                <div className="flex flex-wrap gap-2">
                  {pkg.variants.map((v) => {
                    const groupQuote = isVaranasiFamily(pkg.family)
                      ? getGroupQuote(pkg.family, v.id, 2)
                      : v.adultPrice
                        ? v.adultPrice * 2
                        : null;

                    return (
                      <Link
                        key={v.id}
                        href={`/book/${pkg.family}/${v.id}`}
                        className="border border-[#0f2744] text-[#0f2744] text-xs font-semibold px-3.5 py-2 rounded-lg
                                   hover:bg-[#0f2744] hover:text-white transition-colors duration-150"
                      >
                        <span className="block">{v.label}</span>
                        {groupQuote != null && (
                          <span className="block text-[10px] font-normal mt-0.5 opacity-80">
                            {formatINR(groupQuote)} / 2 adults
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* WhatsApp fallback */}
      <div className="text-center pb-16 px-4">
        <p className="text-gray-500 text-sm mb-3">Not sure which package is right for you?</p>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_BOOKING_NUMBER}?text=Hi%20WanderMate!%20I%20need%20help%20choosing%20a%20package.`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1cb858] text-white font-semibold
                     rounded-lg px-6 py-3 text-sm transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.128.558 4.122 1.532 5.853L0 24l6.302-1.508A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.665-.513-5.188-1.407l-.372-.221-3.865.924.988-3.744-.242-.386A9.961 9.961 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
          Chat on WhatsApp
        </a>
      </div>
    </>
  );
}
