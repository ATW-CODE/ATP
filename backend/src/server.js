import dotenv from "dotenv";
dotenv.config();

import app from './app.js';
import pool from './db/index.js';
import "./cron.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('Database check passed');

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
  }
};

startServer();