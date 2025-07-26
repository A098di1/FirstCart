import { connectToDB } from "@/lib/db"; // or your db file path
import { Seller } from "@/models/sellerModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectToDB();

  try {
    const body = await req.json();
    const { name, email, shopName, phone } = body;

    const newSeller = await Seller.create({ name, email, shopName, phone });

    return NextResponse.json({
      success: true,
      message: "Seller created successfully",
      seller: newSeller,
    });
  } catch (error) {
    console.error("Error saving seller:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
