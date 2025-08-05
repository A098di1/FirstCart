import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";
import nodemailer from "nodemailer";

// Set up email transporter
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
  const { orderId } = await req.json();

  if (!userId) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  if (!orderId) {
    return NextResponse.json({ success: false, message: "Order ID required" }, { status: 400 });
  }

  const order = await Order.findById(orderId).populate("address");

  if (!order) {
    return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
  }

  if (order.userId !== userId) {
    return NextResponse.json({ success: false, message: "Not your order" }, { status: 403 });
  }

  if (order.status !== "Order Placed") {
    return NextResponse.json({ success: false, message: "Only 'Order Placed' orders can be cancelled" }, { status: 400 });
  }

  // Cancel the order
  order.status = "Cancelled";
  await order.save();

  // Send cancellation email
  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: order.address?.email || process.env.SMTP_EMAIL, // fallback
    subject: "Order Cancelled - QuickCart",
    html: `
      <h2>Your order has been cancelled</h2>
      <p>Hi ${order.address?.fullName || "Customer"},</p>
      <p>Your order (ID: ${order._id}) has been successfully cancelled.</p>
      <p><strong>Amount:</strong> ₹${order.amount}</p>
      <p><strong>Status:</strong> Cancelled</p>
      <br/>
      <p>Thanks for shopping with <strong>QuickCart</strong>.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Email send failed:", err.message);
  }

  return NextResponse.json({ success: true, message: "Order cancelled and email sent" });
}
