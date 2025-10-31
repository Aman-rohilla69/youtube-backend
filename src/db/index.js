import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    // mongoose.connect() function ka use karke hum MongoDB se connect karte hai
    // process.env.MONGODB_URL me humara MongoDB ka URL hota hai
    // DB_NAME me humara database ka naam hota hai
    // mongoose.connect() kitni cheeze leta hai?
    // 1. MongoDB URL
    // 2. options (optional)
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`,
    );
    console.log(
      `MongoDB Connect Successfully Connected !! DB Host : ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.log(" MongoDB Connection Failed!", error);
    process.exit(1);
  }
};

export default connectDB;
