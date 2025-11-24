// src/services/mqttService.js
import mqtt from "mqtt";
import SensorData from "../../models/sensorData.js";
import { ALERT_THRESHOLDS } from "../config/alertThresholds.js";
import { checkAlerts } from "./alertChecker.js";
import { sendAlertEmail } from "./emailService.js";
 
/** Vérifie les seuils */
function checkThresholds(type, value) {
  const threshold = ALERT_THRESHOLDS[type];
  if (!threshold) return null;
 
  if (threshold.min !== undefined && value < threshold.min) {
    return `⚠️ ${type} trop basse (${value})`;
  }
  if (threshold.max !== undefined && value > threshold.max) {
    return `🔥 ${type} trop élevée (${value})`;
  }
 
  return null;
}
 
/** Connexion MQTT */
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
      if (err) console.error("❌ Erreur souscription:", err.message);
      else console.log("📡 Souscription réussie → poulailler/#");
    });
  });
 
  /* ------------------------------------------
   * 1️⃣ PREMIER LISTENER — TON ANCIEN CODE
   * (je le garde intact, j’ajoute juste l’email)
   * ------------------------------------------ */
  client.on("message", async (topic, message) => {
    console.log(`📨 Message reçu → ${topic}: ${message.toString()}`);
 
    try {
      const [_, deviceId, type] = topic.split("/");
      const value = parseFloat(message.toString());
 
      if (isNaN(value)) {
        console.warn(`⚠️ Valeur non numérique → ${type}: ${message.toString()}`);
        return;
      }
 
      // 🔄 Sauvegarde MongoDB
      await SensorData.findOneAndUpdate(
        { deviceId },
        { $set: { [`${type}.value`]: value, updatedAt: new Date() } },
        { new: true, upsert: true }
      );
 
      console.log(`✅ Donnée sauvegardée: ${deviceId}/${type} = ${value}`);
 
      // 🚨 Détection alerte
      const alertMessage = checkThresholds(type, value);
 
      if (alertMessage) {
        console.log(`🚨 Alerte détectée: ${alertMessage}`);
 
        // 📧 Email
        sendAlertEmail(`Alerte ${type}`, alertMessage);
 
        // MQTT broadcast alert
        client.publish(
          "poulailler/alertes",
          JSON.stringify({
            deviceId,
            type,
            value,
            message: alertMessage,
            timestamp: new Date(),
          })
        );
      }
    } catch (err) {
      console.error("❌ Erreur traitement MQTT:", err.message);
    }
  });
 
  /* ------------------------------------------
   * 2️⃣ DEUXIÈME LISTENER — TON SECOND CODE
   * (je garde EXACTEMENT la même logique)
   * ------------------------------------------ */
  client.on("message", async (topic, message) => {
    const [_, deviceId, type] = topic.split("/");
    const value = parseFloat(message.toString());
 
    // 🔄 Mise à jour MongoDB
    await SensorData.findOneAndUpdate(
      { deviceId },
      { $set: { [`${type}.value`]: value, updatedAt: new Date() } },
      { new: true, upsert: true }
    );
 
    const updated = await SensorData.findOne({ deviceId });
 
    const alert = checkAlerts(deviceId, {
      temperature: updated.temperature?.value,
      humidity: updated.humidity?.value,
      ammonia: updated.ammonia?.value,
      luminosity: updated.luminosity?.value,
    });
 
    if (alert) {
      console.log("🚨 Alerte détectée :", alert.message);
 
      // 📧 Email
      sendAlertEmail(`Alerte ${alert.type}`, alert.message);
    }
  });
 
  client.on("error", (err) => {
    console.error("🚨 Erreur MQTT:", err.message);
  });
}
 