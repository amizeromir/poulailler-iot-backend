// ✅ mqttSimulator.js — compatible ES Modules
import mqtt from "mqtt";

// 🔧 Connexion à ton broker EMQX Cloud
const client = mqtt.connect({
  host: "bb6e6606.ala.us-east-1.emqxsl.com",
  port: 8883,
  protocol: "mqtts",
  username: "amiz",
  password: "IoT070679",
});

client.on("connect", () => {
  console.log("✅ Simulateur connecté à EMQX Cloud");

  // Simulation toutes les 5 secondes
  setInterval(() => {
    const deviceId = "device1";

    const temperature = (20 + Math.random() * 10).toFixed(1);
    const humidity = (60 + Math.random() * 20).toFixed(1);
    const ammonia = (5 + Math.random() * 5).toFixed(1);
    const luminosity = Math.floor(50 + Math.random() * 50);

    // Publie sur chaque topic
    client.publish(`poulailler/${deviceId}/temperature`, temperature.toString());
    client.publish(`poulailler/${deviceId}/humidity`, humidity.toString());
    client.publish(`poulailler/${deviceId}/ammonia`, ammonia.toString());
    client.publish(`poulailler/${deviceId}/luminosity`, luminosity.toString());

    console.log(`📩 Données envoyées : 🌡️ ${temperature}°C | 💧 ${humidity}% | 🧪 NH3=${ammonia}ppm | 💡 Lumi=${luminosity}`);
  }, 5000);
});

client.on("error", (err) => {
  console.error("❌ Erreur de connexion MQTT :", err.message);
});
