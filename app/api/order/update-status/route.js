import connectDB from "@/config/db";
import Order from "@/models/Order";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function PATCH(req) {
  await connectDB();
  const { userId } = getAuth(req);
  const { orderId, status } = await req.json();

  if (!userId || !orderId || !status) {
    return NextResponse.json({ success: false, message: "Missing data" }, { status: 400 });
  }

  try {
    const order = await Order.findById(orderId).populate("address");

    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    const isUser = order.userId === userId;

    // ❌ Prevent users from canceling after shipping
    if (status === "Cancelled" && isUser && order.status !== "Order Placed") {
      return NextResponse.json({ success: false, message: "Cannot cancel after shipping" }, { status: 403 });
    }

    // ✅ Update order status
    order.status = status;
    await order.save();

    // ✅ Notify user via email
    const user = await User.findById(order.userId);
    const userEmail = user?.email || process.env.SMTP_EMAIL;

    const subject = `Order #${order._id} - ${status}`;
    const statusMessage =
      status === "Cancelled"
        ? "Your order has been cancelled by the seller."
        : `Your order status has been updated to <strong>${status}</strong>.`;

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: userEmail,
      subject,
      html: `
        <h2>QuickCart - Order Update</h2>
        <p>Hi ${order.address?.fullName || "User"},</p>
        <p>${statusMessage}</p>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Status:</strong> ${status}</p>
        <p><strong>Amount:</strong> ₹${order.amount}</p>
        <p><strong>Shipping Address:</strong> ${order.address?.area}, ${order.address?.city}, ${order.address?.state} - ${order.address?.pincode}</p>
        <br />
        <p>Thank you for shopping with QuickCart!</p>
      `,
    });

    return NextResponse.json({ success: true, message: "Order status updated & email sent" });
  } catch (err) {
    console.error("Status update error:", err);
    return NextResponse.json({ success: false, message: "Error updating order" }, { status: 500 });
  }
}
