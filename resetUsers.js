// resetUsers.js - À METTRE DANS LE DOSSIER BACKEND
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function resetUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: "poulailler" });
    console.log("✅ Connecté à MongoDB");

    // Supprimer tous les utilisateurs
    await mongoose.connection.collection('users').deleteMany({});
    console.log("🗑️  Tous les utilisateurs supprimés");

    // Recréer l'admin avec mot de passe simple
    const adminUser = {
      name: "Admin Principal",
      email: "admin@poulailler.com",
      password: "123456", // En clair
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await mongoose.connection.collection('users').insertOne(adminUser);
    console.log("✅ Admin recréé: admin@poulailler.com / 123456");

    // Créer un utilisateur test
    const testUser = {
      name: "Test User",
      email: "test@test.com", 
      password: "test123",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await mongoose.connection.collection('users').insertOne(testUser);
    console.log("✅ Utilisateur test: test@test.com / test123");

    await mongoose.disconnect();
    console.log("✅ Déconnecté de MongoDB");
    
  } catch (error) {
    console.error("❌ Erreur:", error);
  }
}

resetUsers();