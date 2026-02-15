import express from "express";
import authenticate from "../middleware/auth.middleware.js";
import {
  getQuote,
  createPrintJob,
  getMyPrintJobs,
  updatePrintJobStatus,
  getPrintJobStatus,
} from "../controllers/print.controller.js";

const router = express.Router();

// Create a new print job
router.post("/jobs", authenticate, createPrintJob);

// Get current user's print jobs
router.get("/jobs/mine", authenticate, getMyPrintJobs);

router.post("/quote", authenticate, getQuote);

router.patch("/jobs/:id/status", authenticate, updatePrintJobStatus);

router.get("/jobs/:id/fetchStatus", authenticate, getPrintJobStatus);

export default router;
