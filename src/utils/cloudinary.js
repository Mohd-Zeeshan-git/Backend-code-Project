import { v2 as cloudinary } from 'cloudinary';

// (async function() {

    // Configuration
    cloudinary.config({
        cloud_name: Process.env.CLOUDINARY_CLOUD_NAME,
        api_key: Process.env.CLOUDINARY_API_KEY,
        api_secret: Process.env.CLOUDINARY_API_SECRET
        // Click 'View API Keys' above to copy your API secret
    });
    
    const uploadOnCloudnary = async (localpath) => {
       try {
           if (!localpath) throw new Error(" path is required");
           // Upload on cloudinary
           //    it will take time to upload depending on the size of the file and internet speed so use await here
        //    and store the result in a variable if needed
      const response = await cloudinary.uploader.upload(localpath, {
               resource_type: 'auto',
           })
           console.log("cloudinary connected successfully", response);
           console.log("file uploaded successfully", response.url);
           // return the response so user can use it further
         return response;
       } catch (error) {
           fs.unlinkSync(localpath); // remove the file from local server if uploaded on cloudinary
        //       console.log("cloudinary upload error", error);
           throw new Error(error.message);
           return null
       }
    }
    export { uploadOnCloudnary };
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