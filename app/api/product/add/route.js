import { v2 as cloudinary } from 'cloudinary';
import { getAuth } from '@clerk/nextjs/server';
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
    const { userId } = getAuth(request);
    console.log("🧪 userId:", userId);

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized user' }, { status: 401 });
    }

    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 403 });
    }

    const formData = await request.formData();

    // ✅ Explicitly extract and log all fields
    const name = formData.get('name')?.toString() || '';
    const description = formData.get('description')?.toString() || '';
    const category = formData.get('category')?.toString() || '';
    const brand = formData.get('brand')?.toString() || 'Generic';
    const color = formData.get('color')?.toString() || 'Black';
    const price = Number(formData.get('price'));
    const offerPrice = Number(formData.get('offerPrice'));
    const files = formData.getAll('image');

    console.log("🧪 Form fields received:", { name, description, category, brand, color, price, offerPrice });
    console.log("🧪 Files uploaded:", files.length);

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, message: 'No images uploaded' }, { status: 400 });
    }

    // ✅ Upload each file to Cloudinary
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

    await connectDB();

    const newProduct = await Product.create({
      userId,
      name,
      description,
      category,
      brand,
      color,
      price,
      offerPrice,
      image: imageUrls,
      date: new Date(),
    });

    console.log("✅ Product saved to DB:", newProduct);

    return NextResponse.json({
      success: true,
      message: 'Product uploaded successfully',
      product: newProduct,
    });

  } catch (error) {
    console.error("❌ Error during product upload:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
