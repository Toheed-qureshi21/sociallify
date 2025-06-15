import mongoose from "mongoose";

let isConnected = false;
export const connectDb = async () => {
  try {
    if (isConnected) return;

    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "Sociallify",
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS:10000
    });

    isConnected = true;
    console.log("MongoDb connected ✅");

  } catch (error) {
    console.error("MongoDB connection failed ❌");
    console.log(error?.message || error);
    process.exit(1)
  }
}

