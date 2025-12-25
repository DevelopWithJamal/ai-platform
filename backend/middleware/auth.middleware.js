// backend/middleware/auth.middleware.js

import { getClientByApiKey } from "../services/clients.service.js";

export function apiAuth(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res.status(401).json({ error: "API key missing" });
  }

  const client = getClientByApiKey(apiKey);

  if (!client) {
    return res.status(403).json({ error: "Invalid API key" });
  }

  if (!client.enabled) {
    return res.status(403).json({ error: "API key disabled" });
  }

  req.client = client; // attach for next middleware
  next();
}
