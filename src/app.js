import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(express.static("public")); // Serve static files from the "public" directory


export { app };
