export const config = {
  port: Number(process.env.PORT ?? 4000),
  mongoUri: process.env.MONGO_URI ?? "mongodb://localhost:27017/vedaai",
  redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379",
  openrouterKey: process.env.OPENROUTER_API_KEY ?? "",
  geminiKey: process.env.GEMINI_API_KEY ?? "",
  ollamaUrl: process.env.OLLAMA_URL ?? "http://192.168.68.104:11434",
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:4000",
  uploadsDir: process.env.UPLOADS_DIR ?? "./uploads",
};
