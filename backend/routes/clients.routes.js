import express from "express";
import fs from "fs";
import path from "path";
import { verifyAdmin } from "../middleware/auth.jwt.js";
import crypto from "crypto";

const router = express.Router();
const filePath = path.resolve(process.cwd(), "config", "ai-clients.json");

function readClients() {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeClients(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
/**
 * POST /admin/clients
 * Create new API client
 */
router.post("/", verifyAdmin, (req, res) => {
  const { name, model, rateLimit, maxLength } = req.body;

  if (!name || !model) {
    return res.status(400).json({ error: "Name and model are required" });
  }

  const clients = readClients();

  const newClient = {
    name,
    apiKey: crypto.randomBytes(24).toString("hex"),
    model,
    rateLimit: rateLimit || 5,
    maxLength: maxLength || 300,
    enabled: true
  };

  clients.push(newClient);
  writeClients(clients);

  res.status(201).json({ client: newClient });
});


/**
 * GET /admin/clients
 * List all API clients
 */
router.get("/", verifyAdmin, (req, res) => {
  const clients = readClients();
  res.json(clients);
});

/**
 * PUT /admin/clients/:apiKey
 * Update client settings
 */
router.put("/:apiKey", verifyAdmin, (req, res) => {
  const { apiKey } = req.params;
  const { rateLimit, maxLength, enabled, model } = req.body;

  const clients = readClients();
  const index = clients.findIndex(c => c.apiKey === apiKey);

  if (index === -1) {
    return res.status(404).json({ error: "Client not found" });
  }

  clients[index] = {
    ...clients[index],
    rateLimit: rateLimit ?? clients[index].rateLimit,
    maxLength: maxLength ?? clients[index].maxLength,
    enabled: enabled ?? clients[index].enabled,
    model: model ?? clients[index].model
  };

  writeClients(clients);
  res.json({ success: true, client: clients[index] });
});

export default router;
