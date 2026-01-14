import dotenv from "dotenv";
import { runPrinterLivenessCron } from "./services/cron.service.js";
import { cleanupExpiredFiles } from "./services/cron.service.js";
import { recoverStuckPrintJobs } from "./services/cron.service.js";
import cron from "node-cron";

dotenv.config();

console.log("Starting printer liveness scheduler...");

// run every 60 seconds
setInterval(() => {
  runPrinterLivenessCron();
}, 60000);

cron.schedule("*/2 * * * *", async () => {
  await recoverStuckPrintJobs();
});

cron.schedule("*/10 * * * *", async () => {
  console.log("Running file cleanup cron");
  await cleanupExpiredFiles();
});