import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import User from "@/models/User";
import Address from "@/models/Address"; // ✅ Add this
import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const { address: addressId, items } = await request.json();

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    if (!addressId || !items || items.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid data" }, { status: 400 });
    }

    await connectDB();

    // ✅ Fetch address document using addressId
    const addressDoc = await Address.findById(addressId);
    if (!addressDoc) {
      return NextResponse.json({ success: false, message: "Address not found" }, { status: 404 });
    }

    // ✅ Fetch product details and calculate total
    let totalAmount = 0;
    const enrichedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return NextResponse.json({ success: false, message: "Invalid product in cart" }, { status: 400 });
      }

      totalAmount += product.offerPrice * item.quantity;

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

    const tax = Math.floor(totalAmount * 0.02);
    const finalAmount = totalAmount + tax;

    // ✅ Send enriched order data to Inngest
    await inngest.send({
      name: "order/created",
      data: {
        userId,
        address: {
          fullName: addressDoc.fullName,
          phoneNumber: addressDoc.phoneNumber,
          pincode: addressDoc.pincode,
          area: addressDoc.area,
          city: addressDoc.city,
          state: addressDoc.state,
        },
        items: enrichedItems,
        amount: finalAmount,
        date: Date.now(),
      },
    });

    // ✅ Clear user cart
    const user = await User.findById(userId);
    if (user) {
      user.cartItems = {};
      await user.save();
    }

    return NextResponse.json({ success: true, message: "Order placed successfully!" });

  } catch (error) {
    console.error("❌ Order Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
