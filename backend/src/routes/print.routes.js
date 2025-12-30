import express from "express";
import authenticate from "../middleware/auth.middleware.js";
import {
  createPrintJob,
  getMyPrintJobs,
} from "../controllers/print.controller.js";

const router = express.Router();

// Create a new print job
router.post("/jobs", authenticate, createPrintJob);

// Get current user's print jobs
router.get("/jobs/mine", authenticate, getMyPrintJobs);

export default router;
