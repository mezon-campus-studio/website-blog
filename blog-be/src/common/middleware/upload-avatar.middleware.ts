import { BadRequestException } from "@/common/utils/app-error";
import multer from "multer";
import path from "path";
import fs from "fs";

const avatarDir = path.resolve(process.cwd(), "uploads", "avatars");

if (!fs.existsSync(avatarDir)) {
   fs.mkdirSync(avatarDir, { recursive: true });
}

const storage = multer.diskStorage({
   destination: (_req, _file, cb) => cb(null, avatarDir),
   filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const safeName = file.originalname.replace(ext, "").replace(/[^a-zA-Z0-9_-]/g, "");
      cb(null, `${Date.now()}-${safeName || "avatar"}${ext}`);
   },
});

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
   limits: { fileSize: 2 * 1024 * 1024 },
});
