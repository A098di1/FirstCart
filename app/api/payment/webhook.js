import crypto from 'crypto';
import { NextResponse } from 'next/server';
import connectDB from '@/config/db';
import Order from '@/models/Order';

export async function POST(req) {
  await connectDB();

  const body = await req.text();
  const razorpaySignature = req.headers.get('x-razorpay-signature');

  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  if (razorpaySignature !== expectedSignature) {
    return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity;

    await Order.findOneAndUpdate(
      { razorpay_order_id: payment.order_id },
      {
        payment_status: 'Paid',
        razorpay_payment_id: payment.id,
        payment_method: 'Online',
      }
    );
  }

  return NextResponse.json({ success: true });
}