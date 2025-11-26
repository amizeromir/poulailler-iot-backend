# Étape 1 : Image de base légère pour la construction (Build)
# Utilisation de l'image officielle Node.js (version 20 LTS)
FROM node:20-alpine AS builder

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
# L'option --only=production permet d'ignorer les dépendances de développement
RUN npm install --only=production

# Copier le reste du code de l'application
# Assurez-vous que votre point d'entrée principal (ex: server.js, index.js) est inclus
COPY . .

# Étape 2 : Image de production finale (plus petite et plus sécurisée)
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les dépendances et le code depuis l'étape 'builder'
COPY --from=builder /app .

# Définir la variable d'environnement pour le port
# L'API est exposée sur le port 80 dans l'ACA, mais Node.js écoute sur 8080 par défaut
# La variable PORT est lue par l'application pour savoir sur quel port écouter
ENV PORT 8080

# Exposer le port que l'application Node.js utilise (8080)
# (Le conteneur Apps gère le mapping vers le port 80 public)
EXPOSE 8080

# Commande de démarrage de l'application
# Assurez-vous que 'index.js' est bien le fichier de démarrage de votre API
CMD [ "npm", "start" ]
