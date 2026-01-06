import pool from "../db/index.js";

export const printerHeartbeat = async (req, res) => {
  try {
    const { printerId } = req.body;

    if (!printerId) {
      return res.status(400).json({ message: "printerId is required" });
    }

    const result = await pool.query(
      `
      UPDATE printers
      SET
        status = 'online',
        last_seen_at = now()
      WHERE id = $1
      RETURNING id, status, last_seen_at;
      `,
      [printerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Printer not found" });
    }

    res.json({
      message: "Heartbeat received",
      printer: result.rows[0],
    });
  } catch (err) {
    console.error("Printer heartbeat error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



/**
 * POST /kiosk/jobs/claim
 * Claim next uploaded job for a specific printer
 */

export const claimNextJob = async (req, res) => {
  const { printerId } = req.query;

  if (!printerId) {
    return res.status(400).json({ message: "printerId is required" });
  }

  try{
    // Find oldest uploaded job for this printer
    const result = await pool.query(
      `
      UPDATE print_jobs
      SET status = 'queued'
      WHERE id = (
        SELECT id
        FROM print_jobs
        WHERE printer_id = $1
          AND status = 'uploaded'
        ORDER BY created_at
        LIMIT 1
        FOR UPDATE SKIP LOCKED
      )
      RETURNING *;
      `,
      [printerId]
    );

    if (result.rows.length === 0) {
      return res.status(204).send(); // No jobs available
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Claim job error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
