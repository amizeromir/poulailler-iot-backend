// server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import sensorRoutes from "./routes/sensorRoutes.js";
import { connectMQTT } from "./src/services/mqttService.js";

dotenv.config();
const app = express();

// ✅ Middleware CORS dynamique compatible GitHub Codespaces
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (origin && (origin.includes("localhost") || origin.endsWith(".app.github.dev"))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // Réponse immédiate pour la pré-requête
  }

  next();
});

app.use(express.json());

// ✅ Route de santé /api/health (pour test)
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "✅ Backend poulailler-iot fonctionne avec CORS dynamique",
    origin: req.headers.origin,
    mongo: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  });
});

// ✅ Routes principales
app.use("/api/auth", authRoutes);
app.use("/api/sensors", sensorRoutes);

// ✅ Démarrage du serveur après connexion MongoDB
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { dbName: "poulailler" })
  .then(() => {
    console.log("✅ Connecté à MongoDB Atlas");

    try {
      connectMQTT();
      console.log("✅ Connexion MQTT initialisée");
    } catch (err) {
      console.error("❌ Erreur MQTT :", err);
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    });
  })
  .catch((err) => console.error("❌ Erreur MongoDB:", err));
