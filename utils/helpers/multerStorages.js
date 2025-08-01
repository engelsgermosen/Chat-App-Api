import path from "path";
import { v4 as guid } from "uuid";
import multer from "multer";
import { projectRoot } from "./path.js";

export const userImage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(projectRoot, "public", "images", "users"));
  },
  filename: (req, file, cb) => {
    const fileName = `${guid()}--${file.originalname}`;
    cb(null, fileName);
  },
});
