import pool from "../db/index.js";

/**
 * POST /print/jobs
 * Create a new print job
 */
export const createPrintJob = async (req, res) => {
  try {
    const userId = req.user.sub;
    const { fileId, printerId, copies = 1, color = false } = req.body;

    if (!fileId || !printerId) {
      return res.status(400).json({ message: "fileId and printerId are required", });
    }

    // Verify file belongs to user
    const fileResult = await pool.query(
      `
      SELECT id
      FROM files
      WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL AND expires_at > now()
      `,
      [fileId, userId]
    );

    if (fileResult.rows.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    // Verify printer exists and is online
    const printerResult = await pool.query(
      `
      SELECT id
      FROM printers
      WHERE id = $1 AND status = 'online'
      `,
      [printerId]
    );

    if (printerResult.rows.length === 0) {
      return res.status(409).json({
        message: "Selected printer is not available",
      });
    }

    // Pricing logic (temporary)
    const pages = 10; // placeholder until file processing exists
    const costPerPage = color ? 5 : 2;
    const cost = pages * copies * costPerPage;

    // Insert print job
    const result = await pool.query(
      `
      INSERT INTO print_jobs (
        user_id,
        file_id,
        printer_id,
        status,
        copies,
        color,
        pages,
        cost
      )
      VALUES ($1, $2, $3, 'uploaded', $4, $5, $6, $7)
      RETURNING *
      `,
      [userId, fileId, printerId, copies, color, pages, cost]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Create print job error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET /print/jobs/mine
 * Get logged-in user's print jobs
 */
export const getMyPrintJobs = async (req, res) => {
  try {
    const userId = req.user.sub;

    const result = await pool.query(
      `
      SELECT
        id,
        status,
        copies,
        color,
        pages,
        cost,
        created_at,
        updated_at
      FROM print_jobs
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Get print jobs error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * PATCH /print/jobs/:id/status
 * Update print job status
 */

export const updatePrintJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.sub;
    const { status } = req.body;

    if (status === "failed") {
      const job = await getJob(jobId);

      if (job.retry_count + 1 < job.max_retries) {
        await pool.query(`
          UPDATE print_jobs
          SET
            status = 'uploaded',
            retry_count = retry_count + 1,
            last_error = $1
          WHERE id = $2
        `, [error, jobId]);
      } else {
        await pool.query(`
          UPDATE print_jobs
          SET
            status = 'failed',
            retry_count = retry_count + 1,
            last_error = $1
          WHERE id = $2
        `, [error, jobId]);
      }
    }


    const validStatuses = ["queued", "printing", "completed", "failed"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const result = await pool.query(
      `
      UPDATE print_jobs
      SET status = $1, updated_at = now()
      WHERE id = $2 AND user_id = $3
      RETURNING id, status, updated_at;
      `,
      [status, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Print job not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Update print job status error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
