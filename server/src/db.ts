import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL as string);

    console.log("Connected to MongoDB");
  } catch (error) {
    throw new Error("Failed to connect to mongoose");
  }
};

export default connectDB;
