import fs from "fs";
import path from "path";

const clientsPath = path.resolve(process.cwd(), "config", "ai-clients.json");
export const clients = JSON.parse(fs.readFileSync(clientsPath, "utf-8"));
