import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true }, // fixed typo in "requird"
    email: { type: String, required: true, unique: true },
    imageUrl: { type: String, default: "" }, // fixed typo + type (String not object)
    cartItems: { type: Object, default: {} }, // fixed `object` to `Object`
  },
  { minimize: false }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
