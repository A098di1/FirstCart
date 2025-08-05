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
  razorpay_order_id: String,
  razorpay_payment_id: String,
  razorpay_signature: String,
  payment_status: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending',
  },
  payment_method: {
    type: String,
    enum: ['COD', 'Online'],
    default: 'COD',
  },
  status: {
    type: String,
    enum: ['Order Placed', 'Shipped', 'Out for Delivery', 'Delivered','Cancelled'],
    default: 'Order Placed'
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
