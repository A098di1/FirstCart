import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import User from "@/models/User"; // ✅ Import the User model
import connectDB from "@/config/db"; // ✅ Ensure DB connection
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { address, items } = await request.json();

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (!address || !items || items.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid data" }, { status: 400 });
    }

    await connectDB(); // ✅ Ensure DB connection

    // ✅ Calculate total amount (offerPrice * quantity)
    let totalAmount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json({ success: false, message: "Invalid product in cart" }, { status: 400 });
      }
      totalAmount += product.offerPrice * item.quantity;
    }

    const tax = Math.floor(totalAmount * 0.02);
    const finalAmount = totalAmount + tax;

    // ✅ Send event to Inngest to queue the order
    await inngest.send({
      name: "order/created",
      data: {
        userId,
        address,
        items,
        amount: finalAmount,
        date: Date.now(),
      },
    });

    // ✅ Clear cart
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    user.cartItems = {};
    await user.save();

    return NextResponse.json({ success: true, message: "Order placed successfully!" });

  } catch (error) {
    console.error("❌ Order Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
