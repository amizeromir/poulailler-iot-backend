// resetAdmin.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function resetAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: "poulailler" });
    console.log("✅ Connecté à MongoDB");

    // Supprimer tous les utilisateurs existants
    await mongoose.connection.collection('users').deleteMany({});
    console.log("🗑️  Anciens utilisateurs supprimés");

    // Créer un nouvel admin
    const adminUser = {
      name: "Admin Principal",
      email: "admin@poulailler.com",
      password: "123456", // En clair pour le moment
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await mongoose.connection.collection('users').insertOne(adminUser);
    console.log("✅ Admin créé:", adminUser.email, "/ 123456");

    await mongoose.disconnect();
    console.log("✅ Déconnecté de MongoDB");
    
  } catch (error) {
    console.error("❌ Erreur:", error);
  }
}

resetAdmin();