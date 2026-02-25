import mongoose from "mongoose";
import bcrypt from "bcrypt";
import adminModel from "./models/adminModel.js"; // path check kar lena

const MONGO_URI = "mongodb+srv://hemantbanjaratechnocrateoasis_db_user:Hs1WVqUPWXXIoSST@cluster0.icz4v4y.mongodb.net/appointy_db"

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    // delete old admin if exists
    await adminModel.deleteOne({ email: "admin@example.com" });

    const hashedPassword = await bcrypt.hash("123456", 10);

    await adminModel.create({
      name: "Super Admin",
      email: "admin@example.com",
      password: hashedPassword,
    });

    console.log("✅ Admin inserted successfully");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();
