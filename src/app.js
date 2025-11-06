import express from "express";
import cors from "cors";
import sensorRoutes from "./routes/sensorRoutes.js";
import authRoutes from "./routes/auth.js";

const app = express();

// ✅ Middleware CORS dynamique compatible Codespaces
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (
    origin &&
    (origin.includes("localhost") ||
     origin.endsWith(".app.github.dev"))
  ) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

// 🧪 Route test
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "✅ Backend poulailler-iot fonctionne avec CORS dynamique",
    origin: req.headers.origin,
  });
});

// ✅ Routes API
app.use("/api/auth", authRoutes);
app.use("/api/sensors", sensorRoutes);

// Page d’accueil
app.get("/", (req, res) => {
  res.send("🐔 API Poulailler IoT - en ligne avec CORS dynamique !");
});

export default app;
