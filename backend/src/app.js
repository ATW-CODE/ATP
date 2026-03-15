import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";   
import printRoutes from "./routes/print.routes.js";
import fileRoutes from "./routes/file.routes.js";
import printerRoutes from "./routes/printer.routes.js";
import kioskRoutes from "./routes/kiosk.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import { kioskAuth } from "./controllers/kiosk.auth.controller.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "https://treatments-basement-benefits-course.trycloudflare.com",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use("/print", printRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/files", fileRoutes);
app.use("/printers", printerRoutes);
app.use("/kiosk", kioskRoutes);
app.use(express.json());
app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "ATP Backend" });
});
app.use("/payments", paymentRoutes);
app.use("/kiosk", kioskAuth);

export default app;
