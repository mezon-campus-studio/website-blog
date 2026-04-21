import { BadRequestException } from "@/common/utils/app-error";
import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
   const allowed = ["image/jpeg", "image/png", "image/webp"];
   if (!allowed.includes(file.mimetype)) {
      cb(new BadRequestException("Avatar must be jpg, png, or webp"));
      return;
   }

   cb(null, true);
};

export const uploadAvatar = multer({
   storage,
   fileFilter,
   limits: { fileSize: 5 * 1024 * 1024 },  
});
