import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: 'User', // ✅ Capitalized to match User model
  },
  items: [
    {
      product: {
        type: String,
        required: true,
        ref: 'Product', // ✅ Capitalized
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  amount: {
    type: Number,
    required: true,
  },
  address: {
    type: Object, // ✅ full address object will be saved (from addressSchema)
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: 'Order placed',
  },
  date: {
    type: Date,
    default: Date.now, // ✅ More standard for timestamps
  },
});

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
