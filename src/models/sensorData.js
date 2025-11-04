import mongoose from "mongoose";

const sensorDataSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  temperature: { value: Number, unit: { type: String, default: "°C" } },
  humidity: { value: Number, unit: { type: String, default: "%" } },
  ammonia: { value: Number, unit: { type: String, default: "ppm" } },
  luminosity: { value: Number, unit: { type: String, default: "lux" } },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model("SensorData", sensorDataSchema);