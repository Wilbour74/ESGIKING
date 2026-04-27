
# ESGIKING – API Node.js

## Présentation
ESGIKING est une API RESTful développée en Node.js permettant la gestion de restaurants, utilisateurs, sessions et paniers d’achats. Elle utilise Express.js et MongoDB via Mongoose.

## Prérequis
- Node.js >= 18.x
- npm >= 9.x
- MongoDB (local ou distant)

## Installation
1. Clonez le dépôt :
	```bash
	git clone <url-du-repo>
	cd 09-ESGIKING
	```
2. Installez les dépendances :
	```bash
	npm install
	```

## Configuration
Créez un fichier `.env` à la racine du projet et renseignez les variables nécessaires (voir `env.utils.ts` pour les variables attendues) :

```
MONGODB_URI=mongodb://localhost:27017/esgiking
PORT=3000
SECRET_KEY=VotreCléSecrète
```

## Lancement
Pour démarrer le serveur en mode développement :
```bash
npm run dev
```
Ou en mode production :
```bash
npm start
```

## Structure du projet

```
├── controllers/         # Contrôleurs des routes
├── middlewares/         # Middlewares Express
├── models/              # Schémas et interfaces Mongoose
├── services/            # Logique métier
├── utils/               # Fonctions utilitaires
├── index.ts             # Point d’entrée principal
├── docker-compose.yml   # Configuration Docker
└── ...
```

## Contribution
Les contributions sont les bienvenues ! Merci de créer une issue ou une pull request pour toute suggestion ou amélioration.

## Licence
Ce projet est sous licence MIT.
