import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      product: {
        _id: mongoose.Schema.Types.ObjectId,
        name: String,
        brand: String,
        color: String,
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
