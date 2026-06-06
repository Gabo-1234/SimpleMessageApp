import mongoose from "mongoose";
  
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://GG:gabogabo2@cluster0.t1lpvwe.mongodb.net/");
    // await mongoose.connect("mongodb+srv://testUser:testUser@cluster0.yoqm7lx.mongodb.net/?appName=Cluster0")
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("Connection error:", err);
    process.exit(1);
  }
};

export default connectDB;