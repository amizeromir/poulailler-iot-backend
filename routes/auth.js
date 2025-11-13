// routes/auth.js 
import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Route de connexion CORRIGÉE
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("🔐 Tentative de connexion:", email);
    
    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ Utilisateur non trouvé:", email);
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    console.log("🔍 Utilisateur trouvé:", user.email);
    console.log("🔑 Mot de passe stocké:", user.password);
    console.log("🔑 Mot de passe fourni:", password);

    // Vérifier le mot de passe (comparaison directe)
    if (user.password !== password) {
      console.log("❌ Mot de passe incorrect pour:", email);
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    console.log("✅ Connexion réussie pour:", email);

    // Retourner les infos utilisateur (sans le mot de passe)
    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    res.json({ 
      message: "Connexion réussie", 
      user: userResponse 
    });

  } catch (error) {
    console.error("❌ Erreur login:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;