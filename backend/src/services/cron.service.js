import e from "express";
import pool from "../db/index.js";

export async function runPrinterLivenessCron() {
  try {
    const result = await pool.query(
      `
      UPDATE printers
      SET status = 'offline'
      WHERE status = 'online'
        AND last_seen_at IS NOT NULL
        AND now() - last_seen_at > interval '90 seconds'
      RETURNING id, name, status, last_seen_at;
      `
    );

    if (result.rows.length > 0) {
      console.log("\n===== PRINTERS MARKED OFFLINE BY CRON =====");
      console.table(result.rows);
      console.log("============================================\n");
    } else {
      console.log("All printers are online.");
    }
  } catch (err) {
    console.error("Cron error while checking printers:", err.message);
  }
}