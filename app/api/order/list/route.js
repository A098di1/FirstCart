// /app/api/order/list/route.js
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import connectDB from '@/config/db';
import Order from '@/models/Order';

export async function GET(request) {
  try {
    await connectDB();
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const orders = await Order.find({ userId }).sort({ date: -1 });

    return NextResponse.json({
      success: true,
      orders,
    });

  } catch (error) {
    console.error("Order fetch failed:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
