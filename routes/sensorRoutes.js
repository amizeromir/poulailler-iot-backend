// routes/sensorRoutes.js
import express from "express";
import SensorData from "../models/sensorData.js";

const router = express.Router();

// 📡 Historique : les 10 dernières mesures toutes confondues
router.get("/", async (req, res) => {
  try {
    const data = await SensorData.find().sort({ timestamp: -1 }).limit(10);
    res.json(data);
  } catch (error) {
    console.error("Erreur lors de la récupération des capteurs :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// 📊 Dernière valeur de chaque capteur (pour le dashboard)
router.get("/latest", async (req, res) => {
  try {
    // Regroupe par deviceId et prend le plus récent timestamp
    const latestData = await SensorData.aggregate([
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: "$deviceId",
          deviceId: { $first: "$deviceId" },
          temperature: { $first: "$temperature" },
          humidity: { $first: "$humidity" },
          ammonia: { $first: "$ammonia" },
          luminosity: { $first: "$luminosity" },
          timestamp: { $first: "$timestamp" }
        }
      }
    ]);

    res.json(latestData);
  } catch (error) {
    console.error("Erreur /latest :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
