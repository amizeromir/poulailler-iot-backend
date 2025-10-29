require("dotenv").config();
const app = require("./src/app");
const mongoose = require("mongoose");
const { connectMQTT } = require("./src/services/mqttService");

const PORT = process.env.PORT || 5000;

// 🔌 Connexion MongoDB
mongoose
  .connect(process.env.MONGO_URI, { dbName: "poulailler" })
  .then(() => {
    console.log("✅ Connecté à MongoDB Atlas");

    // 🔗 Connexion MQTT
    try {
      connectMQTT();
      console.log("✅ Connexion MQTT initialisée");
    } catch (err) {
      console.error("❌ Erreur lors de la connexion MQTT :", err);
    }

    // 🚀 Démarrage du serveur
    app.listen(PORT, () => console.log(`🚀 Serveur démarré sur le port ${PORT}`));
  })
  .catch((err) => console.error("❌ Erreur connexion MongoDB:", err));
