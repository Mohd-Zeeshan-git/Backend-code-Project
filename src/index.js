// require('dotenv').config({path: './.env'});
import dotenv from "dotenv";
import { app } from "./app.js";
import { connectDB } from "./db/db.js";
dotenv.config({ path: "./.env" });

connectDB()
.then(() => {
    const PORT = process.env.PORT || 4000;
    app.on("error", (error) => {
        console.error("Error in DB connection", error);
        throw error;
    });
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((err) => {
    console.error("Error in DB connection", err);
    process.exit(1);
});







/*
import express from "express";
const app = express();

// iffy function to connect to MongoDB
; (async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URL}/${DB_URL}`);
        console.log("DB connected successfully");
        app.on("error", (error) => {
            console.error("Error in DB connection", error);
            throw error;
        }
        );
        const PORT = process.env.PORT
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error in DB connection", error);
        throw error;
    }
})()
*/