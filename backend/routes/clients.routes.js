import express from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import axios from "axios";
import { verifyAdmin } from "../middleware/auth.jwt.js";

const router = express.Router();
const filePath = path.resolve(process.cwd(), "config", "ai-clients.json");

// Helpers
function readClients() {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeClients(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

/**
 * GET /admin/clients
 */
router.get("/", verifyAdmin, (req, res) => {
  res.json(readClients());
});

/**
 * GET /admin/clients/models
 * Auto-discover models from Ollama
 */
router.get("/models", verifyAdmin, async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.OLLAMA_BASE_URL}/api/tags`
    );

    const models = response.data.models.map(m => m.name);
    res.json(models);
  } catch (err) {
    console.error("❌ Ollama model fetch failed");
    res.status(500).json({ error: "Unable to fetch models from Ollama" });
  }
});

/**
 * POST /admin/clients
 * Auto-generate API key
 */
router.post("/", verifyAdmin, async (req, res) => {
  const { name, model, rateLimit, maxLength } = req.body;

  if (!name || !model) {
    return res.status(400).json({ error: "Name and model required" });
  }

  try {
    // Validate model exists in Ollama
    const response = await axios.get(
      `${process.env.OLLAMA_BASE_URL}/api/tags`
    );
    const availableModels = response.data.models.map(m => m.name);

    if (!availableModels.includes(model)) {
      return res.status(400).json({ error: "Model not available in Ollama" });
    }

    const clients = readClients();

    const client = {
      name,
      apiKey: crypto.randomBytes(32).toString("hex"),
      model,
      rateLimit: rateLimit ?? 5,
      maxLength: maxLength ?? 300,
      enabled: true,
      createdAt: new Date().toISOString()
    };

    clients.push(client);
    writeClients(clients);

    res.status(201).json({ client });
  } catch (err) {
    console.error("❌ Client creation failed");
    res.status(500).json({ error: "Failed to create client" });
  }
});

/**
 * PUT /admin/clients/:apiKey
 */
router.put("/:apiKey", verifyAdmin, (req, res) => {
  const clients = readClients();
  const client = clients.find(c => c.apiKey === req.params.apiKey);

  if (!client) {
    return res.status(404).json({ error: "Client not found" });
  }

  Object.assign(client, req.body);
  writeClients(clients);

  res.json({ client });
});

/**
 * PUT /admin/clients/:apiKey/regenerate
 */
router.put("/:apiKey/regenerate", verifyAdmin, (req, res) => {
  const clients = readClients();
  const client = clients.find(c => c.apiKey === req.params.apiKey);

  if (!client) {
    return res.status(404).json({ error: "Client not found" });
  }

  client.apiKey = crypto.randomBytes(32).toString("hex");
  writeClients(clients);

  res.json({ apiKey: client.apiKey });
});

/**
 * DELETE /admin/clients/:apiKey
 */
router.delete("/:apiKey", verifyAdmin, (req, res) => {
  const clients = readClients();
  const filtered = clients.filter(c => c.apiKey !== req.params.apiKey);

  if (clients.length === filtered.length) {
    return res.status(404).json({ error: "Client not found" });
  }

  writeClients(filtered);
  res.json({ success: true });
});

export default router;
