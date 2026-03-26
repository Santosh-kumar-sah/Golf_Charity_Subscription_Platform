// import multer from "multer";
// import { ApiError } from "../utils/ApiError.js";

// const storage = multer.memoryStorage();

// const upload = multer({
//   storage,
//   limits: {
//     fileSize: 2 * 1024 * 1024, // 2MB
//   },
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = [
//       "image/jpeg",
//       "image/png",
//       "image/jpg",
//       "image/webp"
//     ];

//     if (!allowedTypes.includes(file.mimetype)) {
//       return cb(new ApiError(400, "Only JPG, PNG, WEBP allowed"), false);
//     }

//     cb(null, true);
//   },
// });

// export { upload };

import multer from "multer";

// ✅ Use memory storage - controller handles Cloudinary upload
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file) {
    return cb(new Error("No file provided"), false);
  }
  
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"), false);
  }
  
  cb(null, true);
};

// ✅ Single uploader for both charity and winner uploads
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter,
});

// ✅ Middleware to validate file exists and is not empty
const validateFileUpload = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
      statusCode: 400,
    });
  }
  
  if (!req.file.buffer || req.file.buffer.length === 0) {
    return res.status(400).json({
      success: false,
      message: "File is empty",
      statusCode: 400,
    });
  }
  
  next();
};

export { upload, validateFileUpload };