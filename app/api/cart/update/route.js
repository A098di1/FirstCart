import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { cartData } = await request.json();

    if (!cartData || typeof cartData !== "object") {
      return NextResponse.json({ success: false, message: "Invalid cart data" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    user.cartItems = cartData;
    await user.save();

    return NextResponse.json({ success: true, message: "Cart updated" });
  } catch (error) {
    console.error("❌ Cart update error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
