// backend/server.js

import dotenv from "dotenv";
dotenv.config(); // load .env first

import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import clientsRoutes from "./routes/clients.routes.js";
import aiRoutes from "./routes/ai.routes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: "2mb" }));

// Health Check
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    service: "AI Backend Running 🔥"
  });
});

// Routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/admin/clients", clientsRoutes);
app.use("/api", aiRoutes);

// Server Start
const PORT = process.env.PORT || 7000;
console.log("PORT FROM ENV:", PORT);

app.listen(PORT, () =>
  console.log(`🚀 AI Backend Active at http://localhost:${PORT}`)
);
