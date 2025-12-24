import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running"
  });
});

// Port
const PORT = process.env.PORT || 5000;

// Start server (END)
app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
});
