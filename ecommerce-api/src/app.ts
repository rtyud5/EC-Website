import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import { errorMiddleware } from "./middlewares/error.middleware";
import { rateLimitMiddleware } from "./middlewares/rate-limit.middleware";
import apiRoutes from "./routes/index";

export const app = express();

// ─── Global Middlewares ─────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rate limiter (placeholder, dùng in-memory)
app.use(rateLimitMiddleware(200, 60000));

// ─── Health Check ───────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "ecommerce-api", timestamp: new Date().toISOString() });
});

// ─── API Routes ─────────────────────────────────────────
app.use("/api", apiRoutes);

// ─── Error Handler (phải ở cuối) ────────────────────────
app.use(errorMiddleware);
