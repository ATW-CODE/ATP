import pool from "../db/index.js";

/**
 * GET /printers
 * List all printers with location and status
 */
export const getPrinters = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        location_name,
        status
      FROM printers
      ORDER BY location_name
    `);

    res.json(result.rows);
  } catch (err) {
    console.error("Get printers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
