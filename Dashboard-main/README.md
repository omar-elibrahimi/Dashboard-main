# Dashboard Application
Cette application est un dashboard de visualisation de données de ventes et de produits, développée avec Vue.js pour le frontend et Node.js/Express pour le backend.
Prérequis
# Avant de commencer, assurez-vous d'avoir installé :

Node.js (version 14 ou supérieure)
npm (généralement installé avec Node.js)
MongoDB (pour la base de données)

# Installation
# Frontend

Accédez au répertoire frontend :

bashCopy cd Dashboard-main/Dashboard-front/dash

Installez les dépendances :

bashCopynpm install
# Backend

Accédez au répertoire backend :

bashCopycd Dashboard-main/Dashboard

# Installez les dépendances :

bashCopynpm install
Lancement de l'application
# Frontend
bashCopycd Dashboard-main/Dashboard-front/dash 
npm run serve
# Backend
bashCopycd Dashboard-main/Dashboard
npm run dev
# Fonctionnalités
L'application propose plusieurs composants de visualisation de données :
1. ChartComponent

Visualisation graphique des données de ventes
Analyse des tendances

2. CategoryComponent

Affichage des ventes par catégorie de produits
Vue d'ensemble de la performance des différentes catégories

3. ProductSalesReport

Rapport détaillé des ventes par produit
Filtrage par période
Analyse des performances produits

4. ProductList

Liste complète des produits
Détails des produits et leurs ventes associées

5. CategoryPercentageComponent

Répartition en pourcentage des ventes par catégorie
Visualisation de la distribution des ventes

6. TotalSalesReport

Rapport global des ventes
Analyse des ventes sur une période donnée

# API Endpoints
L'application expose les endpoints suivants :

GET /products : Récupère tous les produits avec leurs ventes
GET /analytics/trending_products : Obtient les produits les plus vendus
GET /analytics/category_sales : Récupère les ventes par catégorie
GET /products/by-date-range/:startDate/:endDate : Filtre les produits par période
GET /sales/date-range : Obtient la plage de dates des ventes disponibles
GET /analytics/total_sales : Récupère le total des ventes

Structure du Projet
CopyDashboard-main/
├── Dashboard-front/
│   └── dash/
│       ├── src/
│       │   ├── components/
│       │   │   ├── ChartComponent.vue
│       │   │   ├── CategoryComponent.vue
│       │   │   ├── ProductSalesReport.vue
│       │   │   ├── ProductList.vue
│       │   │   ├── CategoryPercentageComponent.vue
│       │   │   └── TotalSalesReport.vue
│       │   └── App.vue
└── Dashboard/
    ├── controllers/
    ├── models/
    ├── routes/
    └── services/
# Technologies Utilisées

Frontend :

Vue.js
Chart.js pour les visualisations
Axios pour les requêtes API


Backend :

Node.js
Express
TypeScript
MongoDB avec Mongoose