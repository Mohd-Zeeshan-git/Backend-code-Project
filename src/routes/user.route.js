import { Router } from "express";
import { RegisterUser } from "../controllers/user.controller.js";
// remember to add extension .js while importing in ES6 modules
import { upload } from "../middlewares/multer.middleware.js";
//  file upload middleware is used to handle file uploads using multer

const router = Router();
// import controllers
// routes definition
router.route("/register").post(
    // here upload works as middleware to handle file upload before passing control to RegisterUser controller
    // this will handle multipart/form-data request and process the files according to the defined fields in multer middleware
    upload.fields([ // define multiple fields for file upload accepts array of objects each object defines a field
        { name: "avatar", maxCount: 1 }, // define avatar field with maxCount 1 i.e. only one file can be uploaded for this field
        { name: "coverimage", maxCount: 1 }
    ]),
    RegisterUser
)


export default router;