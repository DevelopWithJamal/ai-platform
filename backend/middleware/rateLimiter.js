// backend/middleware/rateLimiter.js

import rateLimit from "express-rate-limit";
import fs from "fs";
import path from "path";

// Load clients from JSON once at server start
const clientsPath = path.resolve(process.cwd(), "config", "ai-clients.json");
const clients = JSON.parse(fs.readFileSync(clientsPath, "utf-8"));

const limiterStore = new Map();

// Create one limiter per API key
clients.forEach(client => {
  limiterStore.set(
    client.apiKey,
    rateLimit({
      windowMs: 60 * 1000,     // 1 minute
      max: client.rateLimit || 50,
      standardHeaders: true,
      legacyHeaders: false,
      message: { error: "Rate limit exceeded. Please slow down." }
    })
  );

  console.log("🛡 Rate limiter initialized for:", client.apiKey);
});

// Middleware - apply only, no creation here
export function clientRateLimiter(req, res, next) {
  const client = req.client;
  if (!client) return res.status(500).json({ error: "Client config missing" });

  const limiter = limiterStore.get(client.apiKey);
  if (!limiter) return res.status(500).json({ error: "Limiter missing" });

  return limiter(req, res, next);
}
