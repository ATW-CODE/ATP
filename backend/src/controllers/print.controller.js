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

    // 1️⃣ Verify file belongs to user
    const fileResult = await pool.query(
      `
      SELECT id
      FROM files
      WHERE id = $1 AND user_id = $2
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

    // 3️⃣ Pricing logic (temporary)
    const pages = 10; // placeholder until file processing exists
    const costPerPage = color ? 5 : 2;
    const cost = pages * copies * costPerPage;

    // 4️⃣ Insert print job
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
