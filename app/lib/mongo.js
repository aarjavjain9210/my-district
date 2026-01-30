import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/my-district";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null };
}

export async function connectMongo() {
  if (cached.conn) {
    console.log("✅ Using cached MongoDB connection");
    return cached.conn;
  }

  try {
    console.log("🔄 Connecting to MongoDB...");
    cached.conn = await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully");
    return cached.conn;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw error;
  }
}
