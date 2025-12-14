import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const verifyUser = asyncHandler(async (req, res, next) => { 
    try {
        const token = req.cookies?.accessToken || req.headers(authorization)?.replace("Bearer ", "");
        console.log("🔒 Verifying user authentication...");
        if (!token) {
            throw new ApiError(401, "Authentication token missing");
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET )
    
    
        const user = await User.findById(decodedToken?._Id).select("-password refreshToken")
        if (!user) {
            // todo : discuss about frontend handling
            throw new ApiError(401, "User not found");
        }
        req.user = user; 
        console.log("✅ User authenticated:", user.username);
        next();
    } catch (error) {
        console.error("❌ Authentication Error:", error.message);
        throw new ApiError(401, "Invalid or expired authentication token");
    }
});

export { verifyUser };
