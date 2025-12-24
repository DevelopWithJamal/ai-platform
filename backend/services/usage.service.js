import fs from "fs";
import path from "path";

const filePath = path.resolve(process.cwd(), "config", "usage.json");

function readUsage() {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function writeUsage(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function trackUsage(apiKey, clientName) {
  const usage = readUsage();
  const now = new Date().toISOString();

  if (!usage[apiKey]) {
    usage[apiKey] = {
      clientName,
      totalRequests: 0,
      lastUsed: null
    };
  }

  usage[apiKey].totalRequests += 1;
  usage[apiKey].lastUsed = now;

  writeUsage(usage);
}

export function getUsage() {
  return readUsage();
}
