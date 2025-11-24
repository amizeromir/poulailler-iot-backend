// server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import sensorRoutes from "./routes/sensorRoutes.js";
import { connectMQTT } from "./src/services/mqttService.js";
import usersRoutes from "./routes/users.js";
import alertRoutes from "./routes/alertRoutes.js";
import controlRoutes from "./routes/controlRoutes.js";

dotenv.config();

console.log("🔍 DEBUG EMAIL =", process.env.ALERT_EMAIL);
console.log("🔍 DEBUG PASS LENGTH =", process.env.ALERT_EMAIL_PASSWORD?.length);
console.log("🔍 DEBUG TO =", process.env.ALERT_EMAIL_TO);

const app = express();

/* ----------------------- 🔧 CORS dynamique universel ----------------------- */
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origin.includes("localhost") ||
        origin.includes("127.0.0.1") ||
        origin.endsWith(".app.github.dev") ||
        origin.includes("vercel.app") ||
        origin.includes("netlify.app")
      ) {
        callback(null, true);
      } else {
        console.warn("🚫 Requête CORS bloquée depuis :", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

/* ----------------------- ✅ Route de test / santé ----------------------- */
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "✅ Backend poulailler-iot fonctionne avec CORS dynamique",
    origin: req.headers.origin || "n/a",
    mongo:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

/* ----------------------- 🔌 Routes principales ----------------------- */
// ⚠️ TOUTES LES ROUTES DOIVENT ÊTRE AVANT LE DÉMARRAGE DU SERVEUR ⚠️
app.use("/api/auth", authRoutes);
app.use("/api/sensors", sensorRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/control", controlRoutes); // ✅ VOTRE ROUTE DE CONTRÔLE

/* ----------------------- ⚙️ Connexion MongoDB + lancement serveur ----------------------- */
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { dbName: "poulailler" })
  .then(() => {
    console.log("✅ Connecté à MongoDB Atlas");

    // Lancer MQTT
    try {
      connectMQTT();
      console.log("📡 Service MQTT connecté");
    } catch (err) {
      console.error("❌ Erreur lors du démarrage MQTT :", err);
    }

    // Lancer serveur - MAINTENANT les routes sont bien enregistrées
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Serveur backend prêt sur le port ${PORT}`);
      console.log("📋 Routes disponibles:");
      console.log("   - GET  /api/health");
      console.log("   - POST /api/control 👈 VOTRE ROUTE DE CONTRÔLE");
      console.log("   - ... autres routes");
    });
  })
  .catch((err) => console.error("❌ Erreur connexion MongoDB :", err));