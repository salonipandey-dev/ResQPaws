const cloudinary = require("cloudinary").v2;
const CloudinaryStorage = require('multer-storage-cloudinary');
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for rescue case media (images/videos)
const caseMediaStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "resqpaws/cases",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "mp4", "mov"],
    resource_type: "auto",
    transformation: [{ width: 1280, crop: "limit", quality: "auto" }],
  },
});

// Storage for user avatars
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "resqpaws/avatars",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 400, height: 400, crop: "fill", quality: "auto" }],
  },
});

const uploadCaseMedia = multer({
  storage: caseMediaStorage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB for videos
});

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = { cloudinary, uploadCaseMedia, uploadAvatar };
