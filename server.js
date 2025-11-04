import authRoutes from "./routes/auth.js";
import dotenv from "dotenv";
import app from "./src/app.js";
import mongoose from "mongoose";
import { connectMQTT } from "./src/services/mqttService.js";
import cors from "cors";

dotenv.config();

// 🧩 Configuration CORS (autoriser le frontend local + Codespaces)
app.use(cors({
  origin: ["http://localhost:5173", "https://*.github.dev"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"]
}));

// ✅ Route de test toujours accessible
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "✅ Backend poulailler-iot fonctionne parfaitement",
    mongo: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date()
  });
});

const PORT = process.env.PORT || 5000;

// 📦 Routes principales
app.use("/api/auth", authRoutes);

// 🔌 Connexion MongoDB
mongoose
  .connect(process.env.MONGO_URI, { dbName: "poulailler" })
  .then(() => {
    console.log("✅ Connecté à MongoDB Atlas");

    try {
      connectMQTT();
      console.log("✅ Connexion MQTT initialisée");
    } catch (err) {
      console.error("❌ Erreur lors de la connexion MQTT :", err);
    }

    // 🚀 Démarrage du serveur (important : ici seulement)
    app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Serveur démarré sur le port ${PORT}`));
  })
  .catch((err) => console.error("❌ Erreur connexion MongoDB:", err));
