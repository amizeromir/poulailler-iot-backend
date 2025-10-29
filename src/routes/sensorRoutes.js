const express = require("express");
const SensorData = require("../models/sensorData");
const router = express.Router();

router.get("/", async (req, res) => {
  const data = await SensorData.find().sort({ timestamp: -1 }).limit(20);
  res.json(data);
});

module.exports = router;
