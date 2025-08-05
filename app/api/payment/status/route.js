import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { payment_id } = await req.json();

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  try {
    const payment = await razorpay.payments.fetch(payment_id);
    return NextResponse.json({ success: true, status: payment.status });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
