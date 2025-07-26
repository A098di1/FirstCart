import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    shopName: { type: String, required: true },
    phone: { type: String },
  },
  { timestamps: true }
);

// Avoid model overwrite issue in Next.js
export const Seller =
  mongoose.models.Seller || mongoose.model("Seller", sellerSchema);
