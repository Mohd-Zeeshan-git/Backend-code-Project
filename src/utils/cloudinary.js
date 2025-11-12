import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config(
    {path:"./.env"}
);

// (async function() {

    // Configuration
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
        // Click 'View API Keys' above to copy your API secret
    });
    
    const uploadOnCloudnary = async (localpath) => {
       try {
           if (!localpath) throw new Error(" path is required");

           console.log("📤 Uploading to Cloudinary:", localpath);

//            if (!localpath || typeof localpath !== "string") {
//   console.warn("⚠️ Skipped Cloudinary upload: invalid path", localpath);
//   return null;
// }

           // Upload on cloudinary
           //    it will take time to upload depending on the size of the file and internet speed so use await here
        //    and store the result in a variable if needed
      const response = await cloudinary.uploader.upload(localpath, {
               resource_type: 'auto',
           })
           console.log("cloudinary connected successfully", response);
           console.log("file uploaded successfully", response.url);
           // return the response so user can use it further

            // delete local file after successful upload
    if (fs.existsSync(localpath)) {
      fs.unlinkSync(localpath);
      console.log("🧹 Local file deleted:", localpath);
    }

         return response;
       } catch (error) {
            console.error("❌ Cloudinary Upload Error:", error.message);

    // Only delete file if localpath actually exists
    if (localpath && fs.existsSync(localpath)) {
        fs.unlinkSync(localpath);
       
    }
        //    fs.unlinkSync(localpath); // remove the file from local server if uploaded on cloudinary
        //       console.log("cloudinary upload error", error);
        //    throw new Error(error.message);
           return null
       }
    }
export { uploadOnCloudnary };
    


// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";

// // ✅ Configure Cloudinary from .env
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // ✅ Upload function with safe file cleanup
//  const uploadOnCloudinary = async (localFilePath) => {
//   try {
//     // 🧱 Validation
//     if (!localFilePath) {
//       console.warn("⚠️ uploadOnCloudinary called without file path");
//       return null;
//     }

//     console.log(`☁️ Uploading to Cloudinary: ${localFilePath}`);

//     // 🧩 Upload file
//     const result = await cloudinary.uploader.upload(localFilePath, {
//       resource_type: "auto",
//         folder: "my_project_uploads", // Optional: change folder name
//       timeout: 60000, // 60 seconds
//   retry: 2, // Retry twice on failure
//     });

//     console.log("✅ Uploaded successfully:", result.secure_url);

//     // 🧹 Clean up local file only after successful upload
//     if (fs.existsSync(localFilePath)) {
//       fs.unlinkSync(localFilePath);
//       console.log(`🧹 Deleted local file: ${localFilePath}`);
//     }

//     return result;
//   } catch (error) {
//     console.error("❌ Cloudinary upload failed:", error.message);

//     // 🔒 Always try to delete local file if upload fails
//     if (localFilePath && fs.existsSync(localFilePath)) {
//       fs.unlinkSync(localFilePath);
//       console.log(`🧹 Deleted failed upload file: ${localFilePath}`);
//     }

//     return null;
//   }
// };

// export { uploadOnCloudinary };

    
    // Upload an image
    //  const uploadResult = await cloudinary.uploader
    //    .upload(
    //        'localpath', {
    //            public_id: 'video',
    //            resource_type:'auto'
    //        }
    //    )
    //    .catch((error) => {
    //        console.log(error);
    //    });
    
    // console.log(uploadResult);
    
    // Optimize delivery by resizing and applying auto-format and auto-quality
//     const optimizeUrl = cloudinary.url('shoes', {
//         fetch_format: 'auto',
//         quality: 'auto'
//     });
    
//     console.log(optimizeUrl);
    
//     // Transform the image: auto-crop to square aspect_ratio
//     const autoCropUrl = cloudinary.url('shoes', {
//         crop: 'auto',
//         gravity: 'auto',
//         width: 500,
//         height: 500,
//     });
    
//     console.log(autoCropUrl);    
// })();