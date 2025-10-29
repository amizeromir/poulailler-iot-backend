// src/services/mqttService.js
const mqtt = require("mqtt");
const SensorData = require("../models/sensorData");

function connectMQTT() {
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

      await SensorData.findOneAndUpdate(
        { deviceId },
        { $set: { [`${type}.value`]: value, updatedAt: new Date() } },
        { new: true, upsert: true }
      );

      console.log(`✅ Donnée sauvegardée: ${deviceId}/${type} = ${value}`);
    } catch (err) {
      console.error("❌ Erreur traitement message MQTT:", err.message);
    }
  });

  client.on("error", (err) => {
    console.error("🚨 Erreur MQTT:", err.message);
  });
}

module.exports = { connectMQTT };
