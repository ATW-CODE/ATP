import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";   

const app = express();

app.post("/test", (req, res) => {
  console.log(">>> /test HIT");
  res.json({ ok: true });
});

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "ATP Backend" });
});

export default app;
