// routes/sensorRoutes.js
import express from 'express';
import Sensor from '../models/Sensor.js';

const router = express.Router();

// 🔥 CORRECTION: Retourner TOUTES les données
router.get('/latest', async (req, res) => {
  try {
    console.log('🔍 Récupération des dernières données...');
    
    const data = await Sensor.find()
      .sort({ timestamp: -1 })
      .limit(10)
      .lean(); // 🔥 Utiliser lean() pour avoir des objets simples

    console.log('📊 Données brutes MongoDB:', data);

    // Formater les données pour inclure TOUT
    const formatted = data.map(item => {
      console.log('📦 Item complet:', item);
      return {
        // Données ESP32 réelles
        temperature1: item.temperature1,
        humidity1: item.humidity1,
        temperature2: item.temperature2, 
        humidity2: item.humidity2,
        temperature3: item.temperature3,
        humidity3: item.humidity3,
        // Données simulées
        temperature: item.temperature,
        humidity: item.humidity,
        ammonia: item.ammonia,
        luminosity: item.luminosity,
        timestamp: item.timestamp,
        deviceId: item.deviceId,
        _id: item._id
      };
    });

    console.log('🎯 Données formatées API:', formatted);
    res.json(formatted);
    
  } catch (error) {
    console.error('❌ Erreur API /latest:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;