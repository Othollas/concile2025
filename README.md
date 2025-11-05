# Application de Vote Restaurant Concile2025

Application web permettant d'organiser des votes pour choisir un restaurant avec gestion du nombre de participants (adultes et enfants).

## Résumé

Cette application Next.js permet à plusieurs utilisateurs de voter pour leur restaurant préféré tout en indiquant combien de personnes ils emmènent. Chaque utilisateur reçoit un code de vérification (simulé par SMS) pour sécuriser son vote. L'application offre des détails complets sur chaque restaurant avec images, carte Google Maps et spécialités culinaires.

## Fonctionnalités principales

- Création de compte avec code de vérification SMS (simulé)
- Connexion avec utilisateurs existants
- Vote pour un restaurant
- Indication du nombre d'adultes et d'enfants
- Modification du vote à tout moment
- Visualisation des résultats en temps réel
- Détails des restaurants (photos, localisation, spécialités)
- Interface responsive avec animations

## Captures d'écran

```
Page d'accueil          Page de vote           Page résultats
+----------------+      +----------------+     +----------------+
|                |      |   🍷  🍣  🍕   |     | Restaurant     |
|   🍽️ Vote      | ---> |   🥗  🍔       | --> | 1. Bistro: 12  |
|   Restaurant   |      |                |     | 2. Sushi: 8    |
|                |      | [Valider vote] |     | 3. Pizza: 5    |
| [Commencer]    |      +----------------+     +----------------+
+----------------+
```

## Structure du projet

```
restaurant-voting/
├── components/
│   ├── Toast.jsx                    # Notifications
│   ├── HomePage.jsx                 # Page d'accueil
│   ├── PseudoPage.jsx              # Connexion/inscription
│   ├── ParticipantsPage.jsx        # Sélection adultes/enfants
│   ├── RestaurantVotePage.jsx      # Page de vote
│   ├── RestaurantDetailsModal.jsx  # Modale détails restaurant
│   ├── ResultsPage.jsx             # Affichage résultats
│   └── ConfirmationPage.jsx        # Confirmation vote
├── lib/
│   ├── mongodb.js                   # Configuration MongoDB
│   └── restaurants.js               # Données des restaurants
├── pages/
│   ├── api/
│   │   ├── users/
│   │   │   ├── index.js            # GET/POST utilisateurs
│   │   │   └── [pseudo].js         # GET/PUT utilisateur
│   │   └── votes.js                # GET tous les votes
│   ├── _app.js                     # Configuration Next.js
│   └── index.js                    # Page principale
├── styles/
│   └── globals.css                 # Styles globaux + animations
├── utils/
│   └── api.js                      # Fonctions API
├── .env.local                      # Variables d'environnement
├── .gitignore
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Base de données MongoDB

### Collections

**users**
```javascript
{
  _id: ObjectId,
  pseudo: String,
  code: String,              // Code de vérification à 4 chiffres
  hasVoted: Boolean,
  participants: {
    adults: Number,
    children: Number
  },
  vote: Object,             // Restaurant choisi
  timestamp: String,
  lastUpdated: String
}
```

**Indexes recommandés**
```javascript
db.users.createIndex({ pseudo: 1 }, { unique: true })
db.users.createIndex({ hasVoted: 1 })
```

### Schéma relationnel

```
User (1) -------- (0..1) Vote -------- (1) Restaurant
     |
     +--- participants (embedded)
```

## Installation

### Prérequis

- Node.js 18+ 
- Compte MongoDB Atlas (gratuit)
- Compte Vercel (optionnel, pour le déploiement)

### Étapes

**1. Cloner le repository**
```bash
git clone https://github.com/Othollas/concile2025.git
cd concile2025
```

**2. Installer les dépendances**
```bash
npm install
```

**3. Configurer MongoDB Atlas**

- Créer un compte sur [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas/register)
- Créer un cluster gratuit M0 (512 MB)
- Aller dans **Database Access** → Créer un utilisateur
- Aller dans **Network Access** → Autoriser les IP nécessaires à votre projet.
- Cliquer sur **Connect** → **Connect your application**
- Copier l'URI de connexion

**4. Configurer les variables d'environnement**

Créer un fichier `.env.local` à la racine :
```bash
MONGODB_URI=<votre_uri_mongodb>
```

Remplacer `username`, `password` et `cluster` par vos informations MongoDB.

**5. Lancer en développement**
```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

## Déploiement sur Vercel

**1. Pousser sur GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/votre-username/restaurant-voting.git
git push -u origin main
```

**2. Connecter à Vercel**
- Aller sur [vercel.com](https://vercel.com)
- Cliquer sur **Import Project**
- Sélectionner votre repository GitHub
- Ajouter la variable d'environnement :
  - Key: `MONGODB_URI`
  - Value: votre URI MongoDB
- Cliquer sur **Deploy**

**3. Accéder à votre application**
```
https://votre-projet.vercel.app
```

## Utilisation

### Pour voter

1. Accéder à l'application
2. Cliquer sur "Commencer à voter"
3. **Nouveau vote** : 
   - Entrer un pseudo
   - Recevoir un code à 4 chiffres (affiché en démo)
   - Valider le code
4. **Ou se reconnecter** : 
   - Cliquer sur votre pseudo existant
   - Entrer votre code
5. Indiquer le nombre d'adultes et d'enfants
6. Choisir un restaurant
7. Valider le vote

### Pour modifier son vote

1. Se reconnecter avec son pseudo
2. Entrer son code
3. Modifier les participants ou le restaurant
4. Valider les modifications

### Pour voir les résultats

1. Après avoir voté, cliquer sur "Voir les résultats"
2. Ou depuis l'accueil, voter puis accéder aux résultats

Les résultats affichent :
- Classement des restaurants par nombre total de participants
- Nombre de votes par restaurant
- Liste des votants pour chaque restaurant
- Répartition adultes/enfants

## Technologies utilisées

- **Frontend** : React 18, Next.js 14, Tailwind CSS
- **Backend** : Next.js API Routes
- **Base de données** : MongoDB Atlas
- **Icons** : Lucide React
- **Déploiement** : Vercel
- **Cartes** : Google Maps Embed API

## Configuration des restaurants

Les restaurants sont définis dans `lib/restaurants.js`. Pour ajouter ou modifier un restaurant :

```javascript
{
  id: 6,
  name: "Nouveau Restaurant",
  emoji: "🥘",
  description: "Description du restaurant",
  priceRange: "€€",
  address: "Adresse complète",
  images: [
    "url_image_1",
    "url_image_2",
    "url_image_3"
  ],
  specialties: ["Plat 1", "Plat 2", "Plat 3"]
}
```

## Scripts disponibles

```bash
npm run dev      # Lancer en développement (port 3000)
npm run build    # Créer un build de production
npm run start    # Lancer le build de production
npm run lint     # Vérifier le code
```

## Sécurité

- Les codes de vérification sont stockés en base de données
- Les mots de passe ne sont jamais exposés dans les réponses API
- Les requêtes sont validées côté serveur
- MongoDB utilise des connexions chiffrées (SSL/TLS)

**Note** : Dans cette version, les codes SMS sont simulés et affichés directement. Pour une vraie application, intégrer un service SMS comme Twilio ou Vonage.

## Limites du plan gratuit MongoDB Atlas

- Stockage : 512 MB
- Connexions simultanées : Illimitées
- Transfert de données : Aucune limite
- Durée : Permanent (gratuit pour toujours)

**Capacité estimée** : 
- 10,000+ utilisateurs
- 50,000+ votes
- Largement suffisant pour un usage personnel ou événementiel

## Améliorations futures possibles

- Envoi de vrais SMS pour les codes
- Système d'événements (plusieurs votes différents)
- Système de commentaires
- Notification en temps réel des nouveaux votes
- Authentification OAuth (Google, Facebook)
- Mode sombre
- Multilingue (i18n)

## Licence

MIT

## Auteur

Olivier Thollas - [GitHub](https://github.com/Othollas)

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commit les changements (`git commit -m 'Ajout d'une fonctionnalité'`)
4. Push sur la branche (`git push origin feature/amelioration`)
5. Ouvrir une Pull Request