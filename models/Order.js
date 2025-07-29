import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // ✅ Must be 'Product' model
      },
      quantity: Number,
    },
  ],
  amount: Number,
  address: {
    fullName: String,
    phoneNumber: String,
    pincode: Number,
    area: String,
    city: String,
    state: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
