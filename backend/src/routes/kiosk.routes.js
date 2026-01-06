import express from "express";
import authenticateKiosk from "../middleware/kiosk.middleware.js";
import { claimNextJob } from "../controllers/kiosk.controller.js";
import { printerHeartbeat } from "../controllers/kiosk.controller.js";

const router = express.Router();

router.post("/heartbeat", authenticateKiosk, printerHeartbeat);
router.options("/heartbeat", (req, res) => res.sendStatus(204));
router.post("/jobs/claim", authenticateKiosk, claimNextJob);

export default router;
