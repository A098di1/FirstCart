import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server"; // ✅ required to get userId
import { NextResponse } from "next/server";
import Product from "@/models/Product";
import authSeller from "@/lib/authSeller"; // ✅ optional: to check seller role

export async function GET(request) {
  try {
    const { userId } = getAuth(request); // ✅ fix: get userId from request
    console.log("🧪 userId:", userId);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    console.log("✅ MongoDB connected");

    // Optional: check if user is a seller
    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json({ success: false, message: "Not authorized" }, { status: 403 });
    }

    // ✅ fetch only products created by this user
    const products = await Product.find({ userId });

    return NextResponse.json({ success: true, products });

  } catch (error) {
    console.error("❌ Product fetch failed:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
