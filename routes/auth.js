// routes/auth.js
import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Route de connexion
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    if (user.password !== password)
      return res.status(401).json({ message: "Mot de passe incorrect" });

    res.json({ message: "Connexion réussie", user });
  } catch (error) {
    console.error("Erreur login:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;