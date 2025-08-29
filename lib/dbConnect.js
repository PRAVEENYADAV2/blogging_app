// lib/dbConnect.js
import mongoose from "mongoose";

const connection = {}; // Local variable, not from mongoose

async function dbConnect() {
  if (connection.isConnected) {
    console.log("✅ Already connected to the database.");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGOOSE_URI || "", {});
    connection.isConnected = db.connections[0].readyState;
    console.log("✅ DB Connected Successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

export default dbConnect;
