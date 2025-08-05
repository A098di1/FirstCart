import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import connectDB from "@/config/db";
import Product from "@/models/Product";
import User from "@/models/User";
import Address from "@/models/Address";
import Order from "@/models/Order";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    const {
      address: addressId,
      items,
      totalAmount,
      payment_method = "COD", // default to COD
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await req.json();

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (!addressId || !items || items.length === 0 || !totalAmount) {
      return NextResponse.json({ success: false, message: "Invalid order data" }, { status: 400 });
    }

    await connectDB();

    // ✅ Validate address
    const addressDoc = await Address.findById(addressId);
    if (!addressDoc) {
      return NextResponse.json({ success: false, message: "Address not found" }, { status: 404 });
    }

    // ✅ Validate products and calculate total
    let calculatedTotal = 0;
    const enrichedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json({ success: false, message: "Invalid product" }, { status: 400 });
      }

      calculatedTotal += product.offerPrice * item.quantity;

      enrichedItems.push({
        product: {
          _id: product._id,
          name: product.name,
          brand: product.brand || "N/A",
          color: product.color || "N/A",
        },
        quantity: item.quantity,
      });
    }

    const tax = Math.floor(calculatedTotal * 0.02);
    const finalAmount = calculatedTotal + tax;

    // ✅ Compare with client total
    if (Math.floor(totalAmount) !== Math.floor(finalAmount)) {
      return NextResponse.json({ success: false, message: "Amount mismatch" }, { status: 400 });
    }

    // ✅ Save the order
    const newOrder = new Order({
      userId,
      items: enrichedItems,
      amount: finalAmount,
      address: {
        fullName: addressDoc.fullName,
        phoneNumber: addressDoc.phoneNumber,
        pincode: addressDoc.pincode,
        area: addressDoc.area,
        city: addressDoc.city,
        state: addressDoc.state,
      },
      payment_method,
      payment_status: payment_method === "Online" ? "Paid" : "Pending",
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    await newOrder.save();

    // ✅ Clear user cart
    const user = await User.findById(userId);
    if (user) {
      user.cartItems = {};
      await user.save();
    }

    return NextResponse.json({ success: true, message: "Order placed successfully!" });
  } catch (error) {
    console.error("❌ Order create error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
