// import { User } from "../models/user.model.js";
// import { ApiError } from "../utils/apiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
// import { uploadOnCloudnary } from "../utils/cloudinary.js";

// const RegisterUser = asyncHandler(async (req, res, ) => {
//     // res.status(201).json({ success: true, message: "User registered successfully" });
//     // steps for registering a user
//     // 1. get user data  from frontend request body
//     // 2. validate the user data -not empty(e.g. check if email is valid, password is strong enough etc.) - can be done using libraries like joi or express-validator
//     // 3. check if user already exists in database using email or username how to check if user exists in database using mongoose ? use findOne method of mongoose model e.g. User.findOne({ email: email })

//     // check for image upload using multer  and avatar and coverimage fields
//     // upload images to cloudinary and get the urls and check avatar
//     // create a new user object using the user model why ? to save the user to database create entry in db creation call the mongoose model constructor with user data
   
   
//     //  create a new user object using the user model
//     // const newUser = new User({
//     //     username: req.body.username,
//     //     email: req.body.email,
//     //     fullname: req.body.fullname,
//     //     password: req.body.password,
//     //     avatar: avatarUrl, // URL from cloudinary
//     //     coverimage: coverImageUrl, // URL from cloudinary
//     // });

//     // remove password and refresh token from response
//     // check for responce
//     // send response to frontend with success message and user data except password and refresh token
//     // const userResponse = {
//     //     _id: newUser._id,
//     //     username: newUser.username,
//     //     email: newUser.email,
//     //     fullname: newUser.fullname,
//     //     avatar: newUser.avatar,
//     //     coverimage: newUser.coverimage,
//     //     createdAt: newUser.createdAt,
//     // };

//     // res.status(201).json({ success: true, message: "User registered successfully", user: userResponse });
   
//     const { username, fullname, email, password } = req.body //you can extract the data from body using destructuring
//     console.log("email:", email, "paasword: ", password);
//     // if (fullname === "") {
//     //     throw new ApiError(400, "Fullname is required");
//     // }
//     if ([username, fullname, email, password].some((field) => field?.trim() === "")) {
//         throw new ApiError(400, "All fields are required and cannot be empty");
//     }

//    const existedUser = await User.findOne({// we created an object to check if user exists
//         $or: [{ email}, { username }] // check if user exists with email or username here $or is mongoose operator to check multiple conditions
//    })
//     if (existedUser) {
//         throw new ApiError(409, "User already exists with this email or username");
//     }
//     //    store path because it is on server not uploaded to cloudinary yet
    
//       // 3️⃣ Get uploaded file paths (if any)
//   const avatarLocalPath = req.files?.avatar?.[0]?.path;
//     const coverImageLocalPath = req.files?.coverimage?.[0]?.path;
    
//     // const avatarLocalPath = req.files?.avatar?.[0]?.path
//     // // check if files are uploaded ? is better practice than checking for undefined in case of no files uploaded
//     // const coverImageLocalPath = req.files?.coverimage?.[0]?.path
   
//    console.log("avatar local path: ", avatarLocalPath);
//    console.log("cover image local path: ", coverImageLocalPath);
//     console.log("avatar file :", req.files);

//     // Prepare promises (only if paths exist)
// const uploadPromises = [];
// if (avatarLocalPath) uploadPromises.push(uploadOnCloudnary(avatarLocalPath));
// if (coverImageLocalPath) uploadPromises.push(uploadOnCloudnary(coverImageLocalPath));
    
// // let avatar = null;
// //     let coverimage = null;
//     // Run uploads in parallel
// const [avatar, coverimage] = await Promise.all([
//   avatarLocalPath ? uploadOnCloudnary(avatarLocalPath) : null,
//   coverImageLocalPath ? uploadOnCloudnary(coverImageLocalPath) : null
// ]);

// // let avatarUrl = "";
// // let coverimageUrl = "";
// // if (avatarLocalPath) {
// //   console.log("🖼️ Uploading avatar...");
// //   avatar = await uploadOnCloudnary(avatarLocalPath);
// //   console.log("✅ Avatar uploaded:", avatar?.url);
// // }

// // if (coverImageLocalPath) {
// //   console.log("🖼️ Uploading cover image...");
// //   coverimage = await uploadOnCloudnary(coverImageLocalPath);
// //   console.log("✅ Cover image uploaded:", coverimage?.url);
// // }
//     // if (!avatarLocalPath ) {
//     //     throw new ApiError(400, "Avatar  is required");
//     // }

//     // upload file on cloudinay
// //   const avatar= await  uploadOnCloudnary(avatarLocalPath) // this will tke time await why store in variable because
// //     const coverimage= await uploadOnCloudnary(coverImageLocalPath)
//     // if (!avatar //|| !coverImage
         
//     //   ) {
//     //     throw new ApiError(400, "Avatar  is required");
//     // }

//    const user =await User.create({
//         fullname,
//         avatar: avatar?.url|| "",
//         coverimage: coverimage?.url || "",
//         email,
//         password,
//         username:username.toLowerCase()
//    })
//     const userCreation = await User.findById(user._id).select(
//         "-password -refereshToken" //by default all feild are selected
//     )
//     if (!userCreation) {
//         throw new ApiError(500,"something went wrong")
//     }

//     return res.status(201).json(
//         new ApiResponse(200,"user registered succesfully ",userCreation)//object created
//     )

// })
// export { RegisterUser };

import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudnary } from "../utils/cloudinary.js";

const generateAccessTokenAndRefreshToken = async (userId)=>{
    try {
        const user = await User.findById(userId); 
       const accessToken= user.generateAccessToken();
        const refereshToken = user.generateRefreshToken();
        

        user.refereshToken = refereshToken;
        await user.save({ validateBeforeSave: false }); // skip validation
        return { accessToken, refereshToken };

    } catch (error) { 
        console.error("❌ Token Generation Error:", error);
        throw new ApiError(500, "token generation failed")
    }
}

const RegisterUser = asyncHandler(async (req, res) => {
  const { username, fullname, email, password } = req.body;

  console.log("📩 Incoming registration data:");
  console.log("Email:", email, "| Password:", password);

  // ✅ 1. Validate basic fields
  if ([username, fullname, email, password].some((f) => !f?.trim())) {
    throw new ApiError(400, "All fields are required and cannot be empty");
  }

  // ✅ 2. Check if user already exists
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (existedUser) {
    throw new ApiError(409, "User already exists with this email or username");
  }

  // ✅ 3. Extract file paths (if any)
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverimage?.[0]?.path;

  console.log("🖼️ Avatar local path:", avatarLocalPath);
  console.log("🖼️ Cover image local path:", coverImageLocalPath);
  console.log("📂 Uploaded files:", req.files);

  // ✅ 4. Upload images (conditionally)
  let avatarUrl = "";
  let coverImageUrl = "";

  if (avatarLocalPath) {
    console.log("📤 Uploading avatar to Cloudinary...");
    const avatarUpload = await uploadOnCloudnary(avatarLocalPath);
    avatarUrl = avatarUpload?.secure_url || avatarUpload?.url || "";
    console.log("✅ Avatar uploaded:", avatarUrl);
  }

  if (coverImageLocalPath) {
    console.log("📤 Uploading cover image to Cloudinary...");
    const coverUpload = await uploadOnCloudnary(coverImageLocalPath);
    coverImageUrl = coverUpload?.secure_url || coverUpload?.url || "";
    console.log("✅ Cover image uploaded:", coverImageUrl);
  }

  // ✅ 5. (Optional) enforce avatar required
  // if (!avatarUrl) throw new ApiError(400, "Avatar is required");

  // ✅ 6. Create new user
  const user = await User.create({
    fullname,
    username: username.toLowerCase(),
    email,
    password,
    avatar: avatarUrl,
    coverimage: coverImageUrl,
  });

  // ✅ 7. Exclude sensitive fields
  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while creating user");
  }

  // ✅ 8. Send success response
  return res
    .status(201)
    .json(new ApiResponse(200, "User registered successfully", createdUser));
});

const loginUser = asyncHandler(async (req, res) => {
    // req.body -> data from frontend
    // username email password check if user exists
    // find user in db
    // password check
    // generate tokens
    // send cookie
    //  send response
    const { username, email, password } = req.body;
  // if (!username && !email)
  if(!(username || email))
  {
        throw new ApiError(400,"username or email is required to login")
    }
   const user= User.findOne({
        $or: [{ email }, { username }]
   })
    if (!user) {
        throw new ApiError(404,"user not found with this email or username")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401,"invalid password")
    }
    const tokens = await generateAccessTokenAndRefreshToken(user._id);
    
    // send response
    const loggedInUser = await User.findById(user._id).select("-password -refereshToken")
    
    const options = {
        httpOnly: true,
        secure:true,
        // secure: process.env.NODE_ENV === "production", // send cookie only over https in production}
    }
    return res.status(200).cookie("refreshToken", tokens.refereshToken, options)
        .cookie("accessToken", tokens.accessToken, options)
        .json(
            new ApiResponse(200,"user logged in successfully",{
                user: loggedInUser,
                accessToken: tokens.accessToken
            })
        )
});


const logOutUser = asyncHandler(async (req, res) => {
  // clear cookies
  await User.findByIdAndUpdate(req.user._id, {
    $set: { refereshToken: undefined },
  },
    { new: true }
  );

 const options = {
        httpOnly: true,
        secure:true,
        // secure: process.env.NODE_ENV === "production", // send cookie only over https in production}
 }
  return res.status(200).clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse(200, "User logged out successfully")
    );
})

const RefereshAccessToken = asyncHandler(async (req, res) => {
  // get referesh token from cookie
  
  const IncomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!IncomingRefreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }
  // verify referesh token
 try {
  const decodedToken = jwt.verify(
     IncomingRefreshToken,
     process.env.REFRESH_TOKEN_SECRET,
  )
   const user = User.findById(decodedToken?._Id);
   if (!user //|| user.refereshToken !== IncomingRefreshToken
 
   ) {
     throw new ApiError(401, "Invalid refresh token");
   }
   if (user?.refereshToken !== IncomingRefreshToken) {
     throw new ApiError(401, "Refresh token does not match");
   }
   
   // generate new access token
   
   const options={
     httpOnly: true,
     secure:true,
   }
   const { accessToken,newRefereshToken}=await generateAccessTokenAndRefreshToken(user._id);
   // send response
   return res.status(200).cookie("accessToken", accessToken, options)
     .cookie("refreshToken", newRefereshToken, options)
     .json(
       new ApiResponse(200, "Access token refreshed successfully", {
         accessToken,refreshToken:newRefereshToken
       })
     );
 } catch (error) {
   throw new ApiError(401, "Invalid or expired refresh token");
   console.error("❌ Refresh Token Error:", error);
 }

});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword //confPassword

  } = req.body

  // if(!(newPassword===confPassword)){throw new ApiError(400,"password do not match")}
  
  const user = await User.findById(req.user?._id)
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400,"invalid old password")
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200)
  .json(new ApiResponse(200,"password changed succesfully"))
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200)
    .json(200, "current user fetched succesfully", req.user)
});

const updateAccountDetails=asyncHandler(async(req,res)=>
{
  const { fullname, email } = req.body;
  if ((!fullname?.trim()) || (!email?.trim())) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname,
        email: email.toLowerCase(),
      }
    },
    { new: true }
  ).select("-password");

  return res.status(200)
    .json(new ApiResponse(200, "Account details updated successfully", user));
});

const updateUserAvatar = asyncHandler(async (req, res) => { 
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required");
  }
  
  console.log("📤 Uploading new avatar to Cloudinary...");
  const avatar = await uploadOnCloudnary(avatarLocalPath);
  // const avatarUrl = avatarUpload?.secure_url || avatarUpload?.url || "";
  // console.log("✅ New avatar uploaded:", avatarUrl);
  if (!avatar.url //avatarUrl

  ) {
    throw new ApiError(500, "Failed to upload avatar");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url //avatarUrl
      }
    },
    { new: true }
  ).select("-password");

  return res.status(200)
    .json(new ApiResponse(200, "User avatar updated successfully", user));

});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;
  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image is required");
  }

  console.log("📤 Uploading new cover image to Cloudinary...");
  const coverimage = await uploadOnCloudnary(coverImageLocalPath);
  // const avatarUrl = avatarUpload?.secure_url || avatarUpload?.url || "";
  // console.log("✅ New avatar uploaded:", avatarUrl);
  if (!coverimage.url //avatarUrl

  ) {
    throw new ApiError(500, "Failed to upload avatar");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverimage: coverimage.url //avatarUrl
      }
    },
    { new: true }
  ).select("-password");

  return res.status(200)
    .json(new ApiResponse(200, "User avatar updated successfully", user));

});

export {
  changeCurrentPassword,
  getCurrentUser, loginUser, logOutUser, RefereshAccessToken, RegisterUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage
};

