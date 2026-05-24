import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";
import { sendBookingConfirmationEmail } from "@/lib/booking-email";

export const maxDuration = 10;

export async function POST(req: NextRequest) {
  try {
    const body      = await req.text();
    const signature = req.headers.get("x-razorpay-signature") ?? "";
    const secret    = process.env.RAZORPAY_WEBHOOK_SECRET!;

    const expected = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (
      !crypto.timingSafeEqual(
        Buffer.from(expected, "hex"),
        Buffer.from(signature, "hex")
      )
    ) {
      console.warn("[webhook] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;

      const booking = await prisma.booking.findFirst({
        where: { razorpayOrderId: payment.order_id },
      });

      if (!booking) {
        console.warn("[webhook] No booking for order", payment.order_id);
        return NextResponse.json({ received: true });
      }

      if (booking.status === "PENDING") {
        await prisma.booking.update({
          where: { id: booking.id },
          data: {
            status:            "PAID",
            razorpayPaymentId: payment.id,
            razorpaySignature: signature,
          },
        });
      }

      if (!booking.confirmationEmailSentAt) {
        const sent = await sendBookingConfirmationEmail(
          { ...booking, status: "PAID", razorpayPaymentId: payment.id },
          payment.id
        );

        if (sent) {
          await prisma.booking.update({
            where: { id: booking.id },
            data:  { confirmationEmailSentAt: new Date() },
          });
        }
      }

      console.log(`[webhook] Booking paid — order ${payment.order_id}, payment ${payment.id}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("[webhook]", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
