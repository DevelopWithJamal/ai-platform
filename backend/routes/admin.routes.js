import express from "express";
import { verifyAdmin } from "../middleware/auth.jwt.js";

const router = express.Router();

router.get("/status", verifyAdmin, (req, res) => {
  res.json({
    status: "OK",
    ai: "online",
    message: "Admin access confirmed"
  });
});

export default router;
