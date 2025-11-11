import { asyncHandler } from "../utils/asyncHandler.js";

const RegisterUser = asyncHandler(async (req, res, ) => {
    res.status(201).json({ success: true, message: "User registered successfully" });
})
export { RegisterUser };
