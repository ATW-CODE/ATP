import e from "express";
import fs from "fs";
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

export const cleanupExpiredFiles = async () => {
  const result = await pool.query(
    `
    SELECT id, storage_path
    FROM files
    WHERE expires_at < now()
      AND deleted_at IS NULL
    `
  );

  for (const file of result.rows) {
    try {
      fs.unlinkSync(file.storage_path);
    } catch (err) {
      console.error("File delete failed:", err);
    }

    await pool.query(`DELETE FROM files WHERE id = $1`, [file.id]);
  }

  if (result.rows.length > 0) {
    console.log(`Deleted ${result.rows.length} expired files`);
  }
};