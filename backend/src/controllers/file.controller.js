import pool from "../db/index.js";

/**
 * GET /files/mine
 * Get files belonging to the logged-in user
 */
export const getMyFiles = async (req, res) => {
  try {
    const userId = req.user.sub;

    const result = await pool.query(
      `
      SELECT
        id,
        original_filename,
        file_type,
        file_size,
        created_at
      FROM files
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Get files error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
