import express from "express";
import authenticate from "../middleware/auth.middleware.js";
import { uploadFile, downloadFile, getExpiredFiles, getMyFiles } from "../controllers/file.controller.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Upload a new file
router.post("/", authenticate, upload.single("file"), uploadFile);
router.get("/mine", authenticate, getMyFiles);
router.get("/expired", authenticate, getExpiredFiles);
router.get("/:id", authenticate, downloadFile);

export default router;
