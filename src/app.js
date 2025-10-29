const express = require("express");
const cors = require("cors");
const sensorRoutes = require("./routes/sensorRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/sensors", sensorRoutes);

app.get("/", (req, res) => {
  res.send("🐔 API Poulailler IoT - en ligne !");
});

module.exports = app;
