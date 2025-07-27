import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      console.log("✅ Already connected to MongoDB");
      return;
    }

    const uri = process.env.MONGODB_URI; // ✅ THIS MUST MATCH .env.local
    if (!uri) {
      throw new Error("❌ MONGODB_URI not found in environment variables");
    }

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
  }
};

export default connectDB;
