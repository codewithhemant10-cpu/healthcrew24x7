import mongoose from "mongoose";
import dotenv from 'dotenv';

// Load environment variables explicitly
dotenv.config();

const connectDB = async () => {
  try {
    // Check both MONGODB_URI and MONGO_URI for flexibility
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI exists:', !!mongoUri);
    
    if (!mongoUri) {
      throw new Error("MongoDB URI not found in environment variables. Please check your .env file.");
    }
    
    await mongoose.connect(mongoUri);
    console.log("✅ Database Connected Successfully");
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;