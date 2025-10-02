import mongoose from "mongoose";
import { DB_URL } from "../constants.js";
// function to connect to MongoDB
 export const connectDB = async () => {
    try {
       const connectionDB = await mongoose.connect(`${process.env.MONGO_URL}/${DB_URL}`);
        console.log("DB connected successfully");
        console.log(`MongoDB connected: ${connectionDB.connection.host}`);
        mongoose.connection.on("error", (error) => {
            console.error("Error in DB connection", error);
            throw error;
        });
    } catch (error) {
        console.error("Error in DB connection", error);
        process.exit(1);
    }
}; 
export default connectDB;