import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import User from "@/models/User"; // ✅ Your Mongoose User model
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({ userId }); // ✅ Correct method

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const { cartItems } = user;
    return NextResponse.json({ success: true, cartItems });

  } catch (error) {
    console.error("❌ GET cart error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
