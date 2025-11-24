// routes/controlRoutes.js
import express from 'express';
import mqtt from 'mqtt';

const router = express.Router();

// Configuration MQTT
const MQTT_CONFIG = {
  brokerUrl: 'mqtts://bb6e6606.ala.us-east-1.emqxsl.com:8883',
  username: 'amiz',
  password: 'IoT070679'
};

// Connexion MQTT pour le contrôle
const mqttClient = mqtt.connect(MQTT_CONFIG.brokerUrl, {
  username: MQTT_CONFIG.username,
  password: MQTT_CONFIG.password,
  port: 8883,
  rejectUnauthorized: false
});

mqttClient.on('connect', () => {
  console.log('✅ MQTT Control - Connecté au broker');
});

mqttClient.on('error', (err) => {
  console.error('❌ MQTT Control - Erreur:', err);
});

// ⚠️ CORRECTION : '/' au lieu de '/control'
router.post('/', async (req, res) => {
  try {
    const { device, command } = req.body;
    
    console.log(`🎮 Commande reçue: ${command} pour ${device}`);
    
    // Valider la commande
    const validCommands = ['fan_on', 'fan_off', 'light_on', 'light_off', 'water_on', 'water_off'];
    if (!validCommands.includes(command)) {
      return res.status(400).json({ error: 'Commande invalide' });
    }
    
    // Publier sur MQTT - le topic que votre ESP32 écoute
    mqttClient.publish('poulailler/control', command);
    
    console.log(`📤 Commande MQTT envoyée: ${command}`);
    
    res.json({ 
      success: true, 
      message: `Commande ${command} envoyée à ${device}`,
      command: command,
      device: device
    });
    
  } catch (error) {
    console.error('❌ Erreur contrôle:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;