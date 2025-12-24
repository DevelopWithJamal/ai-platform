import fs from "fs";
import path from "path";

// Resolve path to ai-clients.json
const clientsFilePath = path.resolve(
  process.cwd(),
  "config",
  "ai-clients.json"
);

// Load clients once at startup
const clients = JSON.parse(
  fs.readFileSync(clientsFilePath, "utf-8")
);

/**
 * Get client config by API key
 */
export function getClientByApiKey(apiKey) {
  return clients.find(client => client.apiKey === apiKey);
}

