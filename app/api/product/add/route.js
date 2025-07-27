import { v2 as cloudinary } from 'cloudinary';
import { getAuth } from '@clerk/nextjs/server'; // ✅ FIXED: use getAuth with request
import { NextResponse } from 'next/server';
import authSeller from '@/lib/authSeller';
import Product from '@/models/Product';
import connectDB from '@/config/db';

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    // ✅ Extract auth from the request headers (Bearer token)
    const { userId } = getAuth(request);
    console.log("🧪 userId:", userId);

    if (!userId) {
      console.log("❌ No user ID");
      return NextResponse.json({ success: false, message: 'Unauthorized user' }, { status: 401 });
    }

    const isSeller = await authSeller(userId);
    console.log("🧪 isSeller:", isSeller);

    if (!isSeller) {
      console.log("❌ Not a seller");
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 403 });
    }

    const formData = await request.formData();
    const name = formData.get('name');
    const description = formData.get('description');
    const category = formData.get('category');
    const price = formData.get('price');
    const offerPrice = formData.get('offerPrice');
    const files = formData.getAll('image');

    console.log("🧪 Form data:", { name, description, category, price, offerPrice });
    console.log("🧪 Uploaded files:", files.length);

    if (!files || files.length === 0) {
      console.log("❌ No image files received");
      return NextResponse.json({ success: false, message: 'No images uploaded' }, { status: 400 });
    }

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
    console.log("🧪 Cloudinary image URLs:", imageUrls);

    // ✅ Connect to DB
    await connectDB();
    console.log("✅ Connected to MongoDB");

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

    console.log("✅ Product saved:", newProduct);

    return NextResponse.json({
      success: true,
      message: 'Product uploaded successfully',
      product: newProduct,
    });

  } catch (error) {
    console.error("❌ Error in product upload:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
