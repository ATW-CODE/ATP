import jwt from "jsonwebtoken";
import pool from "../db/index.js";

export const kioskAuth = async (req, res) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ message: "API key required" });
  }

  const result = await pool.query(
    `SELECT id FROM printers WHERE api_key = $1`,
    [apiKey]
  );

  if (result.rowCount === 0) {
    return res.status(403).json({ message: "Invalid API key" });
  }

  const printer = result.rows[0];

  const token = jwt.sign(
    {
      printerId: printer.id,
      role: "kiosk"
    },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  res.json({ token });
};
