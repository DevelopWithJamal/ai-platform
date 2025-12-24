import express from "express";
import { apiAuth } from "../middleware/auth.middleware.js";
import { clientRateLimiter } from "../middleware/rateLimiter.js";
import { enhanceText } from "../services/ai.service.js";
import { trackUsage } from "../services/usage.service.js";

const router = express.Router();

/**
 * POST /api/enhance
 * Body: { text: string }
 */
router.post(
  "/enhance",
  apiAuth,
  clientRateLimiter,
  async (req, res) => {
    try {
      const { text } = req.body;

      if (!text || typeof text !== "string") {
        return res.status(400).json({
          error: "Invalid input"
        });
      }

      if (text.length > req.client.maxLength) {
        return res.status(400).json({
          error: "Text length exceeds limit"
        });
      }

      // ✅ TRACK USAGE (THIS WAS MISSING)
      trackUsage(req.client.apiKey, req.client.name);

      // Call AI
      const result = await enhanceText(text, req.client);

      res.json({ result });
    } catch (error) {
      console.error("AI error:", error.message);
      res.status(500).json({
        error: "AI processing failed"
      });
    }
  }
);

export default router;
