import express from "express";
import { createServer } from "http";
import mongoose from "mongoose";
import cors from "cors";
import { config } from "./config";
import { initWebSocket } from "./services/websocket/WebSocketService";
import { startSectionWorker } from "./workers/sectionWorker";
import assignmentsRouter from "./routes/assignments";
import filesRouter from "./routes/files";
import generationRouter from "./routes/generation";
import { errorHandler } from "./middleware/errorHandler";

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(cors({ origin: "*"}));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/assignments", assignmentsRouter);
app.use("/api/assignments/:id/files", filesRouter);
app.use("/api/assignments/:id/generate", generationRouter);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use(errorHandler);

// Request logger — shows every incoming API call
app.use((req, _res, next) => {
  console.log(`[HTTP] ${req.method} ${req.path}`);
  next();
});

// Boot
async function boot() {
  console.log(`[BOOT] Connecting to MongoDB: ${config.mongoUri}`);
  await mongoose.connect(config.mongoUri);
  console.log("✓ MongoDB connected");

  console.log(`[BOOT] Connecting to Redis: ${config.redisUrl}`);
  initWebSocket(httpServer);
  console.log("✓ WebSocket initialized");

  startSectionWorker();
  console.log("✓ Section worker started");

  httpServer.listen(config.port, () => {
    console.log(`✓ Backend listening on http://localhost:${config.port}`);
    console.log(`[BOOT] OpenRouter key present: ${!!config.openrouterKey}`);
  });
}

boot().catch((err) => {
  console.error("Boot failed:", err);
  process.exit(1);
});
