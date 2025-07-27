import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  category: String,
  price: Number,
  offerPrice: Number,
  image: [String],
  date: { type: Date, default: Date.now },
});

export default mongoose.models.Product || mongoose.model("Product", productSchema);
