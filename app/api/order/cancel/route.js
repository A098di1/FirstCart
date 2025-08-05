import connectDB from "@/config/db";
import Order from "@/models/Order";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    await connectDB();
    const { userId } = getAuth(req);
    const { orderId } = await req.json();

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    if (order.status !== "Order Placed") {
      return NextResponse.json({ success: false, message: "You can only cancel orders that are not yet shipped." }, { status: 400 });
    }

    order.status = "Cancelled";
    await order.save();

    return NextResponse.json({ success: true, message: "Order cancelled successfully." });
  } catch (err) {
    console.error("❌ Cancel order error:", err);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
