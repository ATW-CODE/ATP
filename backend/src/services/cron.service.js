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
  const { rows } = await pool.query(`
    SELECT id, storage_path
    FROM files
    WHERE expires_at < now()
      AND deleted_at IS NULL
      AND id NOT IN (
        SELECT DISTINCT file_id FROM print_jobs
      )
  `);

  for (const file of rows) {
    try {
      // 1️⃣ Mark deleted in DB first
      await pool.query(
        `UPDATE files SET deleted_at = now() WHERE id = $1`,
        [file.id]
      );

      // 2️⃣ Then delete from disk
      fs.unlinkSync(file.storage_path);
    } catch (err) {
      console.error("Failed to delete file:", file.id, err.message);
    }
  }

  if (rows.length) {
    console.log(`Deleted ${rows.length} expired files`);
  }
};

export const recoverStuckPrintJobs = async () => {
  // Jobs stuck in printing → fail them
  await pool.query(`
    UPDATE print_jobs
    SET status = 'failed',
        failed_at = now(),
        error = 'Printer timeout'
    WHERE status = 'printing'
      AND started_at < now() - interval '10 minutes'
  `);

  // Retry failed jobs (max 3)
  await pool.query(`
    UPDATE print_jobs
    SET status = 'queued',
        updated_at = now(),
        retries = retries + 1
    WHERE status = 'failed'
      AND retries < 3
      AND failed_at < now() - interval '2 minutes'
  `);
};