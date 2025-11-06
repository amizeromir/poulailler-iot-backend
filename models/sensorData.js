import mongoose from "mongoose";

const sensorDataSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
    },
    temperature: {
      type: Number,
      required: false,
    },
    humidity: {
      type: Number,
      required: false,
    },
    ammonia: {
      type: Number,
      required: false,
    },
    luminosity: {
      type: Number,
      required: false,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { strict: false } // ✅ permet d'ignorer les champs inconnus pour éviter les erreurs "Path not in schema"
);

export default mongoose.model("SensorData", sensorDataSchema);
