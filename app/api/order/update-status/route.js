import connectDB from "@/config/db";
import Order from "@/models/Order";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  await connectDB();
  const { userId } = getAuth(req);
  const { orderId, status } = await req.json();

  if (!userId || !orderId || !status) {
    return NextResponse.json({ success: false, message: "Missing data" }, { status: 400 });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    // Users can cancel only before "Shipped"
    if (status === "Cancelled" && order.status !== "Order Placed") {
      return NextResponse.json({ success: false, message: "Cannot cancel after shipping" }, { status: 403 });
    }

    order.status = status;
    await order.save();

    return NextResponse.json({ success: true, message: "Order status updated" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Error updating order" }, { status: 500 });
  }
}
