import dotenv from "dotenv";
dotenv.config(); // ✅ Load env FIRST
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";

import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.routes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use("/auth", authRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "AI Platform Backend is running"
  });
});

// AI routes
app.use("/api", aiRoutes);
app.use("/admin", adminRoutes);


const PORT = process.env.PORT || 5000;

console.log("PORT FROM ENV:", process.env.PORT); // ✅ debug check

app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
});
