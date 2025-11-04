import express from "express";
import SensorData from "../models/sensorData.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const data = await SensorData.find().sort({ timestamp: -1 }).limit(20);
  res.json(data);
});

export default router;