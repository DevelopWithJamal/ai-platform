import express from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { verifyAdmin } from "../middleware/auth.jwt.js";

const router = express.Router();
const filePath = path.resolve(process.cwd(), "config", "ai-clients.json");

// Available AI models (central control)
const AVAILABLE_MODELS = [
  "mistral:7b",
  "llama3",
  "gpt-oss:120b-cloud"
];

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
 */
router.get("/models", verifyAdmin, (req, res) => {
  res.json(AVAILABLE_MODELS);
});

/**
 * POST /admin/clients
 * Create new API key (AUTO-GENERATED)
 */
router.post("/", verifyAdmin, (req, res) => {
  const { name, model, rateLimit, maxLength } = req.body;

  if (!name || !model) {
    return res.status(400).json({ error: "Name and model required" });
  }

  if (!AVAILABLE_MODELS.includes(model)) {
    return res.status(400).json({ error: "Invalid model" });
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
});

/**
 * PUT /admin/clients/:apiKey
 * Update settings
 */
router.put("/:apiKey", verifyAdmin, (req, res) => {
  const clients = readClients();
  const client = clients.find(c => c.apiKey === req.params.apiKey);

  if (!client) return res.status(404).json({ error: "Not found" });

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

  if (!client) return res.status(404).json({ error: "Not found" });

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
    return res.status(404).json({ error: "Not found" });
  }

  writeClients(filtered);
  res.json({ success: true });
});

export default router;
