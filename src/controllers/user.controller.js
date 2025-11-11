import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudnary } from "../utils/cloudinary.js";

const RegisterUser = asyncHandler(async (req, res, ) => {
    // res.status(201).json({ success: true, message: "User registered successfully" });
    // steps for registering a user
    // 1. get user data  from frontend request body
    // 2. validate the user data -not empty(e.g. check if email is valid, password is strong enough etc.) - can be done using libraries like joi or express-validator
    // 3. check if user already exists in database using email or username how to check if user exists in database using mongoose ? use findOne method of mongoose model e.g. User.findOne({ email: email })

    // check for image upload using multer  and avatar and coverimage fields
    // upload images to cloudinary and get the urls and check avatar
    // create a new user object using the user model why ? to save the user to database create entry in db creation call the mongoose model constructor with user data
   
   
    //  create a new user object using the user model
    // const newUser = new User({
    //     username: req.body.username,
    //     email: req.body.email,
    //     fullname: req.body.fullname,
    //     password: req.body.password,
    //     avatar: avatarUrl, // URL from cloudinary
    //     coverimage: coverImageUrl, // URL from cloudinary
    // });

    // remove password and refresh token from response
    // check for responce
    // send response to frontend with success message and user data except password and refresh token
    // const userResponse = {
    //     _id: newUser._id,
    //     username: newUser.username,
    //     email: newUser.email,
    //     fullname: newUser.fullname,
    //     avatar: newUser.avatar,
    //     coverimage: newUser.coverimage,
    //     createdAt: newUser.createdAt,
    // };

    // res.status(201).json({ success: true, message: "User registered successfully", user: userResponse });
   
    const { username, fullname, email, password } = req.body //you can extract the data from body using destructuring
    console.log("email:", email, "paasword: ", password);
    // if (fullname === "") {
    //     throw new ApiError(400, "Fullname is required");
    // }
    if ([username, fullname, email, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required and cannot be empty");
    }

   const existedUser = await User.findOne({// we created an object to check if user exists
        $or: [{ email}, { username }] // check if user exists with email or username here $or is mongoose operator to check multiple conditions
   })
    if (existedUser) {
        throw new ApiError(409, "User already exists with this email or username");
    }
//    store path because it is on server not uploaded to cloudinary yet
   const avatarLocalPath= req.files?.avatar[0]?.path   // check if files are uploaded ? is better practice than checking for undefined in case of no files uploaded
    const coverImageLocalPath = req.files?.coverimage[0]?.path
   
   console.log("avatar local path: ", avatarLocalPath);
   console.log("cover image local path: ", coverImageLocalPath);
    console.log("avatar file :", req.files);

    if (!avatarLocalPath ) {
        throw new ApiError(400, "Avatar  is required");
    }
    // upload file on cloudinay
  const avatar= await  uploadOnCloudnary(avatarLocalPath) // this will tke time await why store in variable because
    const coverImage= await uploadOnCloudnary(coverImageLocalPath)
    if (!avatar //|| !coverImage
         
      ) {
        throw new ApiError(400, "Avatar  is required");
    }

   const user =await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
   })
    const userCreation = await User.findById(user._id).select(
        "-password -refereshToken" //by default all feild are selected
    )
    if (!userCreation) {
        throw new ApiError(500,"something went wrong")
    }

    return res.status(201).json(
        new ApiResponse(200,"user registered succesfully ",userCreation)//object created
    )

})
export { RegisterUser };
