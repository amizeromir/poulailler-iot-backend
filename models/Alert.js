// models/alert.js
import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  type: { type: String, required: true },
  message: { type: String, required: true },
  value: { type: Number },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Alert", alertSchema);
