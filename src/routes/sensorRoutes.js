import express from "express";
import SensorData from "../models/sensorData.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const data = await SensorData.find().sort({ timestamp: -1 }).limit(20);
    res.json(data); // ✅ bien un tableau []
  } catch (err) {
    console.error("Erreur récupération données capteurs:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
