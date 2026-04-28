const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const hasCloudinaryConfig =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
};

const uploadsRoot = path.join(process.cwd(), "uploads");
const casesDir = path.join(uploadsRoot, "cases");
const avatarsDir = path.join(uploadsRoot, "avatars");
ensureDir(casesDir);
ensureDir(avatarsDir);

const caseMediaStorage = hasCloudinaryConfig
  ? new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "resqpaws/cases",
        allowed_formats: ["jpg", "jpeg", "png", "webp", "mp4", "mov"],
        resource_type: "auto",
        transformation: [{ width: 1280, crop: "limit", quality: "auto" }],
      },
    })
  : multer.diskStorage({
      destination: (_req, _file, cb) => cb(null, casesDir),
      filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`),
    });

const avatarStorage = hasCloudinaryConfig
  ? new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "resqpaws/avatars",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 400, height: 400, crop: "fill", quality: "auto" }],
      },
    })
  : multer.diskStorage({
      destination: (_req, _file, cb) => cb(null, avatarsDir),
      filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`),
    });

const uploadCaseMedia = multer({
  storage: caseMediaStorage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = { cloudinary, uploadCaseMedia, uploadAvatar };
