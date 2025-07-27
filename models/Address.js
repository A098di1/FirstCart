import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true, // ✅ good for performance when querying by userId
  },
  fullName: {
    type: String,
    required: true,
    trim: true, 
  },
  phoneNumber: {
    type: String,
    required: true,
    match: /^[6-9]\d{9}$/, // ✅ simple Indian mobile number validation
  },
  pincode: {
    type: Number,
    required: true,
  },
  area: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true, // ✅ optional: adds createdAt and updatedAt fields
});

// ✅ Reuse the model if already defined (important for Next.js hot-reloading)
const Address = mongoose.models.Address || mongoose.model("Address", addressSchema);

export default Address;
