import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server"; // ✅ Correct path
import User from "@/models/User";
import connectDB from "@/config/db";

export async function GET(request){
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "Unauthorized access",
      });
    }

    await connectDB();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
