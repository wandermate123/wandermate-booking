import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/db";

export const maxDuration = 10;

export async function POST(req: NextRequest) {
  try {
    const body      = await req.text();
    const signature = req.headers.get("x-razorpay-signature") ?? "";
    const secret    = process.env.RAZORPAY_WEBHOOK_SECRET!;

    // ── Verify signature ───────────────────────────────────────────────────
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

    // ── Handle payment.captured ────────────────────────────────────────────
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;

      await prisma.booking.updateMany({
        where: {
          razorpayOrderId: payment.order_id,
          status:          "PENDING",
        },
        data: {
          status:             "PAID",
          razorpayPaymentId:  payment.id,
          razorpaySignature:  signature,
        },
      });

      console.log(`[webhook] Booking paid — order ${payment.order_id}, payment ${payment.id}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("[webhook]", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
