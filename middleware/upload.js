import multer from "multer";

// store the file temporarily before uploading to Cloudinary
const storage = multer.diskStorage({});
export const upload = multer({ storage });
