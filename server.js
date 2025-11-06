// server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import sensorRoutes from "./routes/sensorRoutes.js";
import { connectMQTT } from "./src/services/mqttService.js"; // ✅ Corrigé : chemin direct
import usersRoutes from "./routes/users.js";

dotenv.config();
const app = express();

/* ----------------------- 🔧 CORS dynamique universel ----------------------- */
app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin || // Postman ou script local
        origin.includes("localhost") || // Dev local
        origin.includes("127.0.0.1") ||
        origin.endsWith(".app.github.dev") || // GitHub Codespaces
        origin.includes("vercel.app") || // futur déploiement possible
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
app.use("/api/auth", authRoutes);
app.use("/api/sensors", sensorRoutes);

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

    // Lancer serveur
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Serveur backend prêt sur le port ${PORT}`);
    });
  })
  .catch((err) => console.error("❌ Erreur connexion MongoDB :", err));
  app.use("/api/users", usersRoutes);
