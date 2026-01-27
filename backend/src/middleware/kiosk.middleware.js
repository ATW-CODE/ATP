import pool from "../db/index.js";

export default function authenticateKiosk(req, res, next) {
  const secret = req.get("X-Kiosk-Secret");

  if (!secret || secret !== process.env.KIOSK_SECRET) {
    return res.status(401).json({ message: "Invalid kiosk secret" });
  }

  next();
}

// kiosk.middleware.js
export async function printerAuth(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ message: "Missing printer api key" });
  }

  const result = await pool.query(
    "SELECT * FROM printers WHERE api_key = $1",
    [apiKey]
  );

  if (result.rowCount === 0) {
    return res.status(403).json({ message: "Invalid printer api key" });
  }

  req.printer = result.rows[0];
  next();
}

 