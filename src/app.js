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

// routes import
import userRoutes from "./routes/user.route.js";
// routes use declaration
// app.get not used here because we are using routes from different files so we need to use middleware which is app.use here
// app.use("/users", userRoutes);
// here we are telling when the request com es to /users then pass the control to userRoutes which is defined in user.route.js
app.use("/api/v1/users", userRoutes);
// here api /v1 is the base route for versioning the api where api are grouped into versions so that if any changes are made in future we can create a new version without affecting the existing one why use api versioning ? imagine if we have a mobile app using our api and we make some changes in the api which are not compatible with the
//  mobile app then the app will break so to avoid this we use versioning
// e.g. if we make some changes in userRoutes in future we can create a new route file user.v2.route.js and use it as
// app.use("/api/v2/users", userV2Routes);
// so the mobile app will continue to use /api/v1/users without any issues
// above here /users is the base route for userRoutes we pass the control to userRoutes when the request comes to /users which is defined in user.route.js 
// e.g. /users/register will be handled in user.route.js which tells which controller to use for this route

export { app };
