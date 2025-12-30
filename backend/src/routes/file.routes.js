import express from "express";
import authenticate from "../middleware/auth.middleware.js";
import { getMyFiles } from "../controllers/file.controller.js";

const router = express.Router();

router.get("/mine", authenticate, getMyFiles);

export default router;
