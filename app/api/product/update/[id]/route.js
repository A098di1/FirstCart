import connectDB from "@/config/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function PUT(req, context) {
  await connectDB();

  const { id } = context.params;

  try {
    const body = await req.json();

    const updatedData = {
      name: body.name,
      description: body.description,
      category: body.category,
      brand: body.brand,
      color: body.color,
      price: body.price,
      offerPrice: body.offerPrice,
      image: body.image, // optional
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedProduct) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ success: false, message: "Failed to update product" }, { status: 500 });
  }
}
