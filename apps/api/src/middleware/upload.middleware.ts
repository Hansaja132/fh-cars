import multer from 'multer';
import { AppError } from './error-handler';

// Store uploaded files in memory buffers to upload directly to Supabase Storage
const storage = multer.memoryStorage();

// File filter to restrict uploads to valid image types
const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Only JPEG, PNG, WEBP, GIF, and SVG images are allowed.', 400, 'INVALID_FILE_TYPE'));
  }
};

export const uploadImageMiddleware = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB file size limit
  },
  fileFilter,
});
