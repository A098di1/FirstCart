import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import Product from "@/models/Product";
import Order from "@/models/Order";
import authSeller from "@/lib/authSeller";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    await connectDB();
    await authSeller(request); // ✅ Only allow seller

    const allOrders = await Order.find({}).lean(); // lean() for plain JS objects

    const sellerOrders = [];

    for (const order of allOrders) {
      const filteredItems = [];

      for (const item of order.items) {
        const product = await Product.findById(item.product._id || item.product);
        if (product?.userId === userId) {
          filteredItems.push({
            ...item,
            product: {
              _id: product._id,
              name: product.name,
              price: product.price,
              offerPrice: product.offerPrice,
              image: product.image,
            }
          });
        }
      }

      if (filteredItems.length > 0) {
        sellerOrders.push({
          ...order,
          items: filteredItems,
        });
      }
    }

    return NextResponse.json({ success: true, orders: sellerOrders });

  } catch (error) {
    console.error("❌ Seller Orders Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
