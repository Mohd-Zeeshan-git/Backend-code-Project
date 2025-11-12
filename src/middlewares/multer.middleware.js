// import multer from "multer";
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/temp")
//   },
//   filename: function (req, file, cb) {
//     // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     //   cb(null, file.fieldname + '-' + uniqueSuffix)
//       cb(null, file.originalname);
//   }
// })

// export const upload = multer({
//     // storage: storage
//     // same as
//   storage,
//   limits: { fileSize: 10 * 1024 * 1024 } 
// })




import fs from "fs";
import multer from "multer";
import path from "path";

// Ensure temp folder exists
const tempDir = "./public/temp";
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("📂 Saving to:", tempDir);
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const safeName = file.fieldname + "-" + uniqueSuffix + ext;
    cb(null, safeName);
  },
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed!"), false);
};

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter,
});
