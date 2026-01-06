import dotenv from "dotenv";
import { runPrinterLivenessCron } from "./services/cron.service.js";

dotenv.config();

console.log("Starting printer liveness scheduler...");

// run every 60 seconds
setInterval(() => {
  runPrinterLivenessCron();
}, 60000);