import pool from "../db/index.js";
import fs from "fs";
import { PDFDocument } from "pdf-lib";

// import * as pdfParse from "pdf-parse";


// import { createRequire } from "module";
// const require = createRequire(import.meta.url);

// const pdfParse = require("pdf-parse");

// import pdfParsePkg from "pdf-parse";

// const pdfParse = pdfParsePkg.default || pdfParsePkg;

export const uploadFile = async (req, res) => {
  try {
    const userId = req.user.sub;

    if (!req.file) {
      return res.status(400).json({ message: "File is requirred" });
    }

    const { originalname, mimetype, size, filename, path } = req.file;

    const storagePath = path;

    let totalPages = null;

    if (mimetype === "application/pdf") {
      try {
        const buffer = fs.readFileSync(path);
        const pdfDoc = await PDFDocument.load(buffer);
        totalPages = pdfDoc.getPageCount();
      } catch (e) {
        console.error("PDF parse failed:", e);
        totalPages = null;
      }
    }

    const result = await pool.query(
      `
      INSERT INTO files (
        user_id,
        original_filename,
        storage_path,
        file_type,
        file_size,
        total_pages,
        expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6, now() + interval '24 hours')
      RETURNING id, original_filename, total_pages, expires_at;
      `,
      [userId, originalname, storagePath, mimetype, size, totalPages]
    );
    res.status(201).json({ file: result.rows[0] });
  } catch (err) {
    console.error("File upload error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const downloadFile = async (req, res) => {
  try {
    const { id } = req.params;

    let result;

    if (req.user) {
      // User request (frontend)
      const userId = req.user.sub;

      result = await pool.query(
        `
        SELECT original_filename, storage_path, expires_at, is_deleted
        FROM files
        WHERE id = $1 AND user_id = $2
        `,
        [id, userId]
      );
    } else {
      // Kiosk agent request
      result = await pool.query(
        `
        SELECT original_filename, storage_path, expires_at, is_deleted
        FROM files
        WHERE id = $1
        `,
        [id]
      );
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    const file = result.rows[0];

    if (file.is_deleted || new Date(file.expires_at) < new Date()) {
      return res.status(410).json({ message: "File expired or deleted" });
    }

    res.download(file.storage_path, file.original_filename);

  } catch (err) {
    console.error("Download file error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getExpiredFiles = async (req, res) => {
  try {
    const userId = req.user.sub;

    const result = await pool.query(
      `
      SELECT id, original_filename, expires_at
      FROM files
      WHERE user_id = $1
        AND expires_at < now()
        AND is_deleted = false
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Expired files error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


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
