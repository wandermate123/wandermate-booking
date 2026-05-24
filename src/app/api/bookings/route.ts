import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { calculatePrice, toPaise } from "@/lib/pricing";
import { getVariant, MAX_PAX } from "@/lib/catalog";
import { addDays } from "date-fns";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      family,
      variantId,
      startDate,
      adults,
      children = 0,
      addOnIds = [],
      pickupDrop,
      name,
      email,
      phone,
      specialRequests = "",
    } = body;

    // ── Validation ─────────────────────────────────────────────────────────
    if (!family || !variantId || !startDate || !adults || !name || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (adults + children > MAX_PAX) {
      return NextResponse.json(
        { error: `Maximum ${MAX_PAX} travellers per booking` },
        { status: 400 }
      );
    }

    const variant = getVariant(family, variantId);
    if (!variant) {
      return NextResponse.json({ error: "Invalid package or variant" }, { status: 400 });
    }

    // ── Pricing ────────────────────────────────────────────────────────────
    const pricing = calculatePrice({
      family,
      variantId,
      adults,
      children,
      addOnIds,
      startDate,
      pickupDrop,
    });
    if (!pricing) {
      return NextResponse.json({ error: "Could not calculate price" }, { status: 500 });
    }

    // ── Dates ──────────────────────────────────────────────────────────────
    const start = new Date(startDate);
    const end   = addDays(start, variant.nights);

    // ── Create record ──────────────────────────────────────────────────────
    const booking = await prisma.booking.create({
      data: {
        family,
        variant: variantId,
        startDate: start,
        endDate:   end,
        adults,
        children,
        addOns:    addOnIds,
        name:      name.trim(),
        email:     email.toLowerCase().trim(),
        phone:     phone.trim(),
        specialRequests: specialRequests.trim(),
        adultTotal:  pricing.adultTotal,
        childTotal:  pricing.childTotal,
        addOnTotal:  pricing.addOnTotal,
        subtotal:    pricing.subtotal,
        taxAmount:   pricing.taxAmount,
        totalAmount: pricing.total,
        status:      "PENDING",
      },
    });

    return NextResponse.json({ id: booking.id, totalAmount: booking.totalAmount });
  } catch (err: any) {
    console.error("[bookings POST]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
