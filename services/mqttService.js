// src/services/mqttService.js
import mqtt from "mqtt";
import SensorData from "../../models/sensorData.js";
import Alert from "../../models/alert.js"; // <-- nouveau modèle pour les alertes

// ======= 1️⃣ Fonction d’analyse intelligente =======
async function checkAlerts(deviceId, type, value) {
  try {
    let alertType = null;
    let message = "";

    // Seuils configurables
    const seuils = {
      temperature: { min: 20, max: 35 },
      humidite: { min: 40, max: 70 },
      co2: { max: 1200 },
    };

    if (type === "temperature") {
      if (value < seuils.temperature.min) {
        alertType = "Température basse";
        message = `Température trop basse (${value}°C) détectée sur ${deviceId}.`;
      } else if (value > seuils.temperature.max) {
        alertType = "Température élevée";
        message = `Température trop élevée (${value}°C) détectée sur ${deviceId}.`;
      }
    }

    if (type === "humidite") {
      if (value < seuils.humidite.min) {
        alertType = "Humidité basse";
        message = `Humidité trop basse (${value}%) détectée sur ${deviceId}.`;
      } else if (value > seuils.humidite.max) {
        alertType = "Humidité élevée";
        message = `Humidité trop élevée (${value}%) détectée sur ${deviceId}.`;
      }
    }

    if (type === "co2" && value > seuils.co2.max) {
      alertType = "CO₂ élevé";
      message = `Concentration de CO₂ élevée (${value} ppm) sur ${deviceId}.`;
    }

    if (alertType) {
      // 🔥 Enregistrement dans la base
      const alert = new Alert({
        deviceId,
        type: alertType,
        message,
        value,
        timestamp: new Date(),
      });

      await alert.save();
      console.log(`🚨 ALERTE SAUVEGARDÉE → ${alertType}: ${message}`);
    }
  } catch (err) {
    console.error("❌ Erreur dans checkAlerts:", err.message);
  }
}

// ======= 2️⃣ Connexion MQTT + Traitement =======
export function connectMQTT() {
  const options = {
    host: process.env.MQTT_HOST,
    port: Number(process.env.MQTT_PORT),
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    protocol: "mqtts",
  };

  console.log("🔌 Connexion à MQTT:", options.host, "port", options.port);
  const client = mqtt.connect(options);

  client.on("connect", () => {
    console.log(`✅ Connecté à EMQX Cloud (${options.host})`);
    client.subscribe("poulailler/+/+", (err) => {
      if (err) console.error("❌ Erreur de souscription:", err.message);
      else console.log("📡 Souscription réussie aux topics poulailler/#");
    });
  });

  client.on("message", async (topic, message) => {
    console.log(`📨 Message reçu → ${topic}: ${message.toString()}`);

    try {
      const [_, deviceId, type] = topic.split("/");
      const value = parseFloat(message.toString());

      if (isNaN(value)) {
        console.warn(`⚠️ Valeur non numérique sur ${type}: ${message.toString()}`);
        return;
      }

      // Sauvegarde de la mesure
      await SensorData.findOneAndUpdate(
        { deviceId },
        { $set: { [`${type}.value`]: value, updatedAt: new Date() } },
        { new: true, upsert: true }
      );

      console.log(`✅ Donnée sauvegardée: ${deviceId}/${type} = ${value}`);

      // Vérification automatique des alertes
      await checkAlerts(deviceId, type, value);
    } catch (err) {
      console.error("❌ Erreur traitement message MQTT:", err.message);
    }
  });

  client.on("error", (err) => {
    console.error("🚨 Erreur MQTT:", err.message);
  });
}
