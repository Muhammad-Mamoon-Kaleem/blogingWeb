import multer from "multer";
import fs from 'fs'
// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './tmp'); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

// File filter to validate image uploads
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and JPG images are allowed"), false);
  }
};

// Multer instance for handling multiple images
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max file size: 5MB
  fileFilter,
});

const removeUploadedFiles = (files) => {
    if (files && files.length > 0) {
      files.forEach(file => {
        console.log(`Checking file: ${file.path}`);
        fs.stat(file.path, (err, stats) => {
          if (err || !stats) {
            console.error(`File not found or stat error: ${file.path}`, err);
          } else {
            fs.unlink(file.path, (unlinkErr) => {
              if (unlinkErr) {
                console.error(`Error removing file from tmp folder: ${unlinkErr}`);
              } else {
                console.log(`File removed: ${file.path}`);
              }
            });
          }
        });
      });
    }
  };


export { upload,removeUploadedFiles };
