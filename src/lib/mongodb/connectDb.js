import mongoose from "mongoose";

let isConnected = false;
export const connectDb = async () => {
  try {
    if (isConnected) return;

    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "Sociallify",
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log("MongoDb connected ✅");

  } catch (error) {
    console.log(error);

  }
}

