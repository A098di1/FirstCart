// /api/order/list/route.js

import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectDB();

  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" });
    }

    const orders = await Order.find({ userId })
      .populate("items.product") // ✅ This line is crucial
      .sort({ date: -1 });

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error("Order list error:", error);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
