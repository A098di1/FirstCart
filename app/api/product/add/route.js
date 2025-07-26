import { v2 as cloudinary } from 'cloudinary';
import { auth } from '@clerk/nextjs/server'; // ✅ FIXED: correct import
import authSeller from "@/lib/authSeller";
import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connectDB from "@/config/db";

// ✅ Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    // ✅ Correct way to get userId in app route
    const { userId } = auth(); // FIXED: get userId directly
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized user' });
    }

    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json({ success: false, message: 'Not authorized' });
    }

    const formData = await request.formData();
    const name = formData.get('name');
    const description = formData.get('description');
    const category = formData.get('category');
    const price = formData.get('price');
    const offerPrice = formData.get('offerPrice'); // ✅ fix spelling (was lowercase before!)
    const files = formData.getAll('image'); // ✅ key is 'image' (not 'images')

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, message: 'No images uploaded' });
    }

    // ✅ Upload all files to Cloudinary
    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'image' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(buffer);
        });
      })
    );

    const imageUrls = uploadedImages.map((res) => res.secure_url);

    // ✅ Save to MongoDB
    await connectDB();

    const newProduct = await Product.create({
      userId,
      name,
      description,
      category,
      price: Number(price),
      offerPrice: Number(offerPrice),
      image: imageUrls,
      date: Date.now(),
    });

    return NextResponse.json({
      success: true,
      message: 'Product uploaded successfully',
      product: newProduct,
    });

  } catch (error) {
    console.error("Error in product upload:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
