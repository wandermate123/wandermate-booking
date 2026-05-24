import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/db";
import { toPaise } from "@/lib/pricing";

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return NextResponse.json({ error: "bookingId is required" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.status !== "PENDING") {
      return NextResponse.json({ error: "Booking already processed" }, { status: 409 });
    }

    const order = await razorpay.orders.create({
      amount:          toPaise(booking.totalAmount),
      currency:        "INR",
      receipt:         bookingId,
      notes: {
        bookingId,
        package: booking.family,
        variant: booking.variant,
        guest:   booking.name,
      },
    });

    // Store order ID on booking
    await prisma.booking.update({
      where: { id: bookingId },
      data:  { razorpayOrderId: order.id },
    });

    return NextResponse.json({
      razorpayOrderId: order.id,
      amount:          order.amount,
      currency:        order.currency,
    });
  } catch (err: any) {
    console.error("[razorpay order]", err);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}
