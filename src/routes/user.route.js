import { Router } from "express";
import { RegisterUser } from "../controllers/user.controller.js";
// remember to add extension .js while importing in ES6 modules

const router = Router();
// import controllers
// routes definition
router.route("/register").post(RegisterUser)


export default router;