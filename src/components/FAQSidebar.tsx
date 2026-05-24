"use client";

import { useState } from "react";

type FAQ = { q: string; a: string };

export default function FAQSidebar({ faqs }: { faqs: FAQ[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <aside className="space-y-3">
      <h3 className="font-serif text-xl font-semibold text-[#0f2744] mb-4">
        Frequently Asked Questions
      </h3>
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="border border-gray-100 rounded-xl overflow-hidden"
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex justify-between items-center px-4 py-3.5 text-left
                       text-sm font-semibold text-[#0f2744] hover:bg-gray-50 transition-colors"
            aria-expanded={open === i}
          >
            <span>{faq.q}</span>
            <span className="ml-3 shrink-0 text-[#e86228] text-lg leading-none">
              {open === i ? "−" : "+"}
            </span>
          </button>
          {open === i && (
            <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
              {faq.a}
            </div>
          )}
        </div>
      ))}

      {/* WhatsApp CTA */}
      <div className="mt-6 rounded-xl bg-[#fdf6ec] border border-[#e86228]/20 p-5 text-center">
        <p className="text-sm font-semibold text-[#0f2744] mb-1">Have more questions?</p>
        <p className="text-xs text-gray-500 mb-3">
          Our team typically replies within 10 minutes.
        </p>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_BOOKING_NUMBER ?? "919999999999"}?text=Hi%20WanderMate!%20I%20have%20a%20question%20about%20a%20package.`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1cb858] text-white
                     font-semibold rounded-lg px-4 py-2.5 text-sm transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.128.558 4.122 1.532 5.853L0 24l6.302-1.508A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.665-.513-5.188-1.407l-.372-.221-3.865.924.988-3.744-.242-.386A9.961 9.961 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
          WhatsApp Us
        </a>
      </div>
    </aside>
  );
}
