import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true, // Clerk user ID
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  imageUrl: {
    type: String,
    default: "",
  },
  cartItems: {
    type: Object,
    default: {},
  },
}, {
  minimize: false, // Keeps empty objects in output
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Use cached model if it already exists (important in Next.js API routes)
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
