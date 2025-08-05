import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

  // If COD (no Razorpay fields), skip verification
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({
      success: false,
      message: "Missing payment details for verification.",
    }, { status: 400 });
  }

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const isValid = generatedSignature === razorpay_signature;

  if (!isValid) {
    return NextResponse.json(
      { success: false, message: "Invalid Razorpay signature" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });
}
