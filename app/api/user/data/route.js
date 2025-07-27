import connectDB from "@/config/db";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import User from "@/models/User";
import { clerkClient } from "@clerk/clerk-sdk-node";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    console.log("🔐 userId:", userId);

    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    console.log("✅ MongoDB connected");

    let user = await User.findOne({ _id: userId });

    if (!user) {
      console.log("⚠️ User not found in DB. Creating...");

      const clerkUser = await clerkClient.users.getUser(userId);
      console.log("🔍 user.publicMetadata:", clerkUser.publicMetadata);

      user = await User.create({
        _id: userId, // ✅ Clerk userId becomes MongoDB _id
        userId, // Optional if you want to store it separately
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
        email: clerkUser.emailAddresses[0].emailAddress,
        imageUrl: clerkUser.imageUrl,
        cartItems: {}, // default
      });

      console.log("✅ New user created:", user.name);
    }

    return NextResponse.json({ success: true, user });

  } catch (error) {
    console.error("❌ Error fetching user data:", error.message);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
