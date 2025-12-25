// backend/services/clients.service.js

import { clients } from "../config/clients.config.js";

// Return client details using API key
export function getClientByApiKey(apiKey) {
  return clients.find(c => c.apiKey === apiKey);
}
