import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: "User" },
  name: { type: String, required: true },
  description: { type: String, required: true }, // ✅ Use description instead of dessertIcon
  price: { type: Number, required: true },
  offerPrice: { type: Number, required: true },
  image: { type: [String], required: true }, // ✅ More specific than just Array
  category: { type: String, required: true },
  date: { type: Number, required: true },
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
