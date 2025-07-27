import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authSeller from "@/lib/authSeller";
import Product from "@/models/Product"; // ✅ Import your product model

export async function GET(request) {
  try {
    const { userId } = getAuth(request); // ✅ fixed key name

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized user" }, { status: 401 });
    }

    const isSeller = await authSeller(userId); // ✅ added await

    if (!isSeller) {
      return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });
    }

    await connectDB();

    const products = await Product.find({ userId }); // ✅ You can also filter by userId

    return NextResponse.json({ success: true, products });

  } catch (error) {
    console.error("❌ Product fetch failed:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
