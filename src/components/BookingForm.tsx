"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Package, Variant } from "@/lib/catalog";
import { ADD_ONS, MAX_PAX, PACKAGES } from "@/lib/catalog";
import { calculatePrice, formatINR } from "@/lib/pricing";

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  pkg: Package;
  initialVariant: Variant;
};

type FormState = {
  variantId: string;
  startDate: string;
  adults: number;
  children: number;
  addOns: string[];
  name: string;
  email: string;
  phone: string;
  specialRequests: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function addDays(dateStr: string, days: number): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

function today() {
  return new Date().toISOString().split("T")[0];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BookingForm({ pkg, initialVariant }: Props) {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    variantId: initialVariant.id,
    startDate: "",
    adults: 2,
    children: 0,
    addOns: [],
    name: "",
    email: "",
    phone: "",
    specialRequests: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const variant = pkg.variants.find((v) => v.id === form.variantId) ?? initialVariant;
  const pricing = calculatePrice({
    family: pkg.family,
    variantId: form.variantId,
    adults: form.adults,
    children: form.children,
    addOnIds: form.addOns,
  });

  const endDate = form.startDate ? addDays(form.startDate, variant.nights) : "";
  const totalPax = form.adults + form.children;

  // ─── Field helpers ─────────────────────────────────────────────────────────

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleAddOn = (id: string) =>
    set(
      "addOns",
      form.addOns.includes(id) ? form.addOns.filter((a) => a !== id) : [...form.addOns, id]
    );

  // ─── Submit → create booking → open Razorpay ───────────────────────────────

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!pricing) return;
      setError(null);
      setLoading(true);

      try {
        // 1. Create booking record (status: PENDING)
        const bookingRes = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            family: pkg.family,
            variantId: form.variantId,
            startDate: form.startDate,
            adults: form.adults,
            children: form.children,
            addOnIds: form.addOns,
            name: form.name,
            email: form.email,
            phone: form.phone,
            specialRequests: form.specialRequests,
          }),
        });

        const bookingData = await bookingRes.json();
        if (!bookingRes.ok) throw new Error(bookingData.error ?? "Failed to create booking");

        // 2. Create Razorpay order
        const orderRes = await fetch("/api/razorpay/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bookingId: bookingData.id }),
        });

        const orderData = await orderRes.json();
        if (!orderRes.ok) throw new Error(orderData.error ?? "Failed to create payment order");

        // 3. Open Razorpay checkout
        const Razorpay = (await loadRazorpay()) as any;
        const rzp = new Razorpay({
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          order_id: orderData.razorpayOrderId,
          amount: orderData.amount,
          currency: "INR",
          name: "WanderMate",
          description: `${pkg.name} — ${variant.label}`,
          prefill: { name: form.name, email: form.email, contact: form.phone },
          theme: { color: "#e86228" },
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
            // Webhook handles status update — redirect to thank you
            router.push(
              `/book/thank-you?payment_id=${response.razorpay_payment_id}&booking=${bookingData.id}`
            );
          },
          modal: {
            ondismiss: () => setLoading(false),
          },
        });

        rzp.open();
      } catch (err: any) {
        setError(err.message ?? "Something went wrong. Please try again.");
        setLoading(false);
      }
    },
    [form, pkg, variant, pricing, router]
  );

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="space-y-8" noValidate>

      {/* Duration pills */}
      <section>
        <label className="form-label">Duration</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {pkg.variants.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => set("variantId", v.id)}
              className={`border text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors ${
                form.variantId === v.id
                  ? "bg-[#e86228] text-white border-[#e86228]"
                  : "border-gray-200 text-[#0f2744] hover:border-[#0f2744]"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-[#e86228] font-semibold mt-2">
          ₹{variant.adultPrice.toLocaleString("en-IN")} / adult
        </p>
      </section>

      {/* Dates */}
      <section className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label" htmlFor="startDate">Start Date</label>
          <input
            id="startDate"
            type="date"
            required
            min={today()}
            value={form.startDate}
            onChange={(e) => set("startDate", e.target.value)}
            className="form-input"
          />
        </div>
        <div>
          <label className="form-label">End Date</label>
          <input
            type="date"
            disabled
            value={endDate}
            className="form-input bg-gray-50 text-gray-400 cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">Auto-calculated</p>
        </div>
      </section>

      {/* Guests */}
      <section>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label" htmlFor="adults">
              Adults
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => set("adults", Math.max(1, form.adults - 1))}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center
                           text-lg font-medium hover:border-[#0f2744] transition-colors"
              >
                −
              </button>
              <span className="font-serif text-3xl font-semibold text-[#0f2744] min-w-[2rem] text-center">
                {form.adults}
              </span>
              <button
                type="button"
                onClick={() =>
                  set("adults", totalPax < MAX_PAX ? form.adults + 1 : form.adults)
                }
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center
                           text-lg font-medium hover:border-[#0f2744] transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="children">
              Children <span className="font-normal normal-case">(age 5–11, 50% off)</span>
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => set("children", Math.max(0, form.children - 1))}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center
                           text-lg font-medium hover:border-[#0f2744] transition-colors"
              >
                −
              </button>
              <span className="font-serif text-3xl font-semibold text-[#0f2744] min-w-[2rem] text-center">
                {form.children}
              </span>
              <button
                type="button"
                onClick={() =>
                  set("children", totalPax < MAX_PAX ? form.children + 1 : form.children)
                }
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center
                           text-lg font-medium hover:border-[#0f2744] transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>
        {totalPax >= MAX_PAX && (
          <p className="text-xs text-amber-600 mt-2">
            Maximum {MAX_PAX} travellers per booking. Contact us for larger groups.
          </p>
        )}
      </section>

      {/* Add-ons */}
      <section>
        <label className="form-label">Add-ons (optional)</label>
        <div className="space-y-2 mt-1">
          {ADD_ONS.map((ao) => (
            <label
              key={ao.id}
              className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                form.addOns.includes(ao.id)
                  ? "border-[#e86228] bg-[#fdf6ec]"
                  : "border-gray-100 hover:border-gray-200 bg-white"
              }`}
            >
              <input
                type="checkbox"
                checked={form.addOns.includes(ao.id)}
                onChange={() => toggleAddOn(ao.id)}
                className="mt-0.5 accent-[#e86228]"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#0f2744]">{ao.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{ao.description}</p>
              </div>
              <span className="text-sm font-semibold text-[#e86228] shrink-0">
                +{formatINR(ao.price)}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* Guest details */}
      <section className="space-y-4">
        <h3 className="font-serif text-lg font-semibold text-[#0f2744]">Your Details</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="form-label" htmlFor="name">Full Name *</label>
            <input
              id="name"
              required
              type="text"
              placeholder="Rahul Sharma"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="form-input"
            />
          </div>
          <div>
            <label className="form-label" htmlFor="phone">Phone *</label>
            <input
              id="phone"
              required
              type="tel"
              placeholder="+91 98765 43210"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              className="form-input"
            />
          </div>
        </div>

        <div>
          <label className="form-label" htmlFor="email">Email Address *</label>
          <input
            id="email"
            required
            type="email"
            placeholder="you@email.com"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className="form-input"
          />
        </div>

        <div>
          <label className="form-label" htmlFor="specialRequests">
            Special Requests{" "}
            <span className="font-normal normal-case text-gray-400">
              ({form.specialRequests.length}/2000)
            </span>
          </label>
          <textarea
            id="specialRequests"
            rows={3}
            maxLength={2000}
            placeholder="Dietary preferences, mobility requirements, specific temples or rituals..."
            value={form.specialRequests}
            onChange={(e) => set("specialRequests", e.target.value)}
            className="form-input resize-y"
          />
        </div>
      </section>

      {/* Price summary */}
      {pricing && (
        <section className="bg-[#0f2744] rounded-2xl p-5 text-white">
          <h3 className="font-serif text-lg font-semibold text-[#c9a84c] mb-4">
            Price Summary
          </h3>
          <div className="space-y-2 text-sm">
            <Row label={`Adults (${form.adults} × ${formatINR(variant.adultPrice)})`} value={formatINR(pricing.adultTotal)} />
            {form.children > 0 && (
              <Row
                label={`Children (${form.children} × ${formatINR(Math.round(variant.adultPrice * 0.5))})`}
                value={formatINR(pricing.childTotal)}
              />
            )}
            {pricing.addOnTotal > 0 && (
              <Row label="Add-ons" value={formatINR(pricing.addOnTotal)} />
            )}
            <Row label="Subtotal" value={formatINR(pricing.subtotal)} />
            <Row label="GST (5%)" value={formatINR(pricing.taxAmount)} muted />
            <div className="border-t border-white/20 pt-3 mt-1 flex justify-between items-baseline">
              <span className="font-semibold">Total</span>
              <span className="font-serif text-2xl font-bold text-[#e86228]">
                {formatINR(pricing.total)}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={
          loading ||
          !form.startDate ||
          !form.name ||
          !form.phone ||
          !form.email ||
          !pricing
        }
        className="btn-primary w-full py-4 text-base"
      >
        {loading ? "Processing…" : `Pay ${pricing ? formatINR(pricing.total) : ""} Securely`}
      </button>

      <p className="text-center text-xs text-gray-400">
        🔒 Secure payment via Razorpay · UPI · Cards · Net Banking · Wallets
      </p>

      {/* WhatsApp fallback */}
      <div className="text-center pt-2">
        <p className="text-xs text-gray-500 mb-2">Prefer to book over the phone?</p>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_BOOKING_NUMBER}?text=Hi!%20I%20want%20to%20book%20the%20${encodeURIComponent(pkg.name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-[#25D366] font-semibold text-sm
                     hover:underline"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.128.558 4.122 1.532 5.853L0 24l6.302-1.508A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.665-.513-5.188-1.407l-.372-.221-3.865.924.988-3.744-.242-.386A9.961 9.961 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
          Book via WhatsApp instead
        </a>
      </div>
    </form>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Row({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className={`flex justify-between ${muted ? "text-white/60" : "text-white/80"}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

// ─── Razorpay script loader ───────────────────────────────────────────────────

function loadRazorpay(): Promise<unknown> {
  return new Promise((resolve, reject) => {
    if ((window as any).Razorpay) return resolve((window as any).Razorpay);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve((window as any).Razorpay);
    s.onerror = reject;
    document.body.appendChild(s);
  });
}
