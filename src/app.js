import express from "express";
import cors from "cors";
import sensorRoutes from "./routes/sensorRoutes.js";

const app = express();
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));

app.use(cors());
app.use(express.json());

app.use("/api/sensors", sensorRoutes);

app.get("/", (req, res) => {
  res.send("🐔 API Poulailler IoT - en ligne !");
});

export default app;