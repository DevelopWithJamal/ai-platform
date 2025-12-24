import rateLimit from "express-rate-limit";

// Cache rate limiters per API key
const limiters = new Map();

export function clientRateLimiter(req, res, next) {
  const client = req.client;

  if (!client) {
    return res.status(500).json({ error: "Client config missing" });
  }

  // Create limiter once per API key
  if (!limiters.has(client.apiKey)) {
    const limiter = rateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: client.rateLimit,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        error: "Rate limit exceeded. Please slow down."
      }
    });

    limiters.set(client.apiKey, limiter);
  }

  // Use cached limiter
  return limiters.get(client.apiKey)(req, res, next);
}
