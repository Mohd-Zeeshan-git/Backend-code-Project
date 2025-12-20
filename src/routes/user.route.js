// import { Router } from "express";
// import { RegisterUser } from "../controllers/user.controller.js";
// // remember to add extension .js while importing in ES6 modules
// import { upload } from "../middlewares/multer.middleware.js";
// //  file upload middleware is used to handle file uploads using multer

// const router = Router();
// // import controllers
// // routes definition
// router.route("/register").post(
//     // here upload works as middleware to handle file upload before passing control to RegisterUser controller
//     // this will handle multipart/form-data request and process the files according to the defined fields in multer middleware
  
//   // router.post("/register",
//   // (req, res, next) => {
//   //   console.log("🟡 Starting multer parsing...");
//   //   next();
    

//   // },

//     upload.fields([ // define multiple fields for file upload accepts array of objects each object defines a field
//         { name: "avatar", maxCount: 2 }, // define avatar field with maxCount 1 i.e. only one file can be uploaded for this field
//         { name: "coverimage", maxCount: 2 }
//     ]),
//      (err, req, res, next) => {
//     console.error("❌ Multer Error:", err);
//     if (err) return res.status(400).json({ success: false, message: err.message });
//     next();
//     },
//   (req, res, next) => { console.log("✅ Passed multer successfully"); next(); },
//     RegisterUser
// )


// export default router;



import { Router } from "express";
import { loginUser, logOutUser, RefereshAccessToken, RegisterUser } from "../controllers/user.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// ✅ User Registration Route
router.post(
  "/register",
  // --- Step 1: start log before parsing ---
  (req, res, next) => {
    console.log("🟡 Starting multer parsing...");
    next();
  },

  // --- Step 2: Multer handles file uploads ---
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverimage", maxCount: 1 },
  ]),

  // --- Step 3: Handle multer errors gracefully ---
  (err, req, res, next) => {
    if (err) {
      console.error("❌ Multer Error:", err.message);
      return res
        .status(400)
        .json({ success: false, message: `File upload error: ${err.message}` });
    }
    console.log("✅ Passed multer successfully");
    next();
  },

  // --- Step 4: Call your controller ---
  RegisterUser
);

router.route("/login").post(loginUser);

//secured route
router.route("/logout").post(verifyUser, logOutUser);
router.route("/refresh-token").post(RefereshAccessToken); // handled in controller
router.route("/change-password").post(verifyUser, changeCurrentPassword);
router.route("/current-user").get(verifyUser, getCurrentUser);
router.route("/update-account").patch(verifyUser, updateAccountDetails);
router.route("/update-avatar").patch(verifyUser, upload.single("avatar"), updateUserAvatar);
router.route("/update-coverimage").patch(verifyUser, upload.single("coverimage"), updateUserCoverImage);
router.route("/channel/:username").get(verifyUser, getUserChannelProfile);
router.route("/watch-history").get(verifyUser, getUserWatchHistory);

export default router;
