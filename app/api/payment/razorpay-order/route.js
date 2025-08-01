import Razorpay from "razorpay";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: body.amount, // ✅ Already in paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ success: true, ...order }); // You can return full order here
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create Razorpay order." },
      { status: 500 }
    );
  }
}
