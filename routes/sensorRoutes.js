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

// 📊 Dernière valeur la plus récente (pour le dashboard résumé)
router.get("/latest", async (req, res) => {
  try {
    // Triez par le timestamp le plus récent (-1) et prenez seulement le premier document.
    const latestData = await SensorData.find()
      .sort({ timestamp: -1 })
      .limit(1);

    res.json(latestData);
  } catch (error) {
    console.error("Erreur /latest :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;