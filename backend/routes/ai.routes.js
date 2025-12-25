// backend/routes/ai.routes.js

import express from "express";
import { apiAuth } from "../middleware/auth.middleware.js";
import { clientRateLimiter } from "../middleware/rateLimiter.js";
import { generateAI } from "../services/ai.service.js";
import { trackUsage } from "../services/usage.service.js";

const router = express.Router();

/**
 * POST /api/generate
 * Headers: x-api-key
 * Body:
 * {
 *   "system": "optional system instruction",
 *   "prompt": "main user prompt/input"
 * }
 */
router.post("/generate", apiAuth, clientRateLimiter, async (req, res) => {
  try {
    const { system, prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt is required" });
    }

    if (prompt.length > req.client.maxLength) {
      return res.status(400).json({ error: "Prompt exceeds max length" });
    }

    // Combine system + user message (like OpenAI)
    const finalPrompt = system
      ? `${system}\n\nUser:\n${prompt}`
      : prompt;

    // Track API usage
    trackUsage(req.client.apiKey, req.client.name);

    // Generate AI result
    const result = await generateAI(finalPrompt, req.client);

    return res.json({
      success: true,
      model: req.client.model,
      result
    });

  } catch (err) {
    console.error("AI Route Error:", err.message);
    return res.status(500).json({ error: "AI request failed" });
  }
});

export default router;
