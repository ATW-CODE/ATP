import express from "express";
import { Router } from "express";
import { kioskAuth } from "../controllers/kiosk.auth.controller.js";
import authenticateKiosk from "../middleware/kiosk.middleware.js";
import { claimNextJob } from "../controllers/kiosk.controller.js";
import { printerHeartbeat } from "../controllers/kiosk.controller.js";
import { printerAuth } from "../middleware/kiosk.middleware.js";
import pool from "../db/index.js";


const router = express.Router();

router.post("/auth", kioskAuth);
router.post("/heartbeat", authenticateKiosk, printerHeartbeat);
router.options("/heartbeat", (req, res) => res.sendStatus(204));
router.post("/jobs/claim", authenticateKiosk, claimNextJob);

router.patch(
  "/jobs/:id/status",
  printerAuth,
  async (req, res) => {
    const { id } = req.params;
    const { status, error } = req.body;

    const result = await pool.query(
      `
      UPDATE print_jobs
      SET status = $1,
          error = $2,
          updated_at = now()
      WHERE id = $3
        AND printer_id = $4
      RETURNING id, status
      `,
      [status, error || null, id, req.printer.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Print job not found" });
    }

    res.json(result.rows[0]);
  }
);


export default router;
