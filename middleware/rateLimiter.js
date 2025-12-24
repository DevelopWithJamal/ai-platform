import rateLimit from "express-rate-limit";

/**
 * Rate limiter based on client config
 */
export function clientRateLimiter(req, res, next) {
  const limit = req.client?.rateLimit || 5;

  const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: limit,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      error: "Rate limit exceeded. Please slow down."
    }
  });

  return limiter(req, res, next);
}

