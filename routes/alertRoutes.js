// routes/alertRoutes.js
import express from "express";
import Alert from "../models/Alert.js";

const router = express.Router();

// 📡 Récupérer les 20 dernières alertes
router.get("/", async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ timestamp: -1 }).limit(20);
    res.json(alerts);
  } catch (err) {
    console.error("Erreur récupération alertes:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
