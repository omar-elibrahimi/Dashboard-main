<template>
  <div id="app">
    <h1>Dashboard des Produits et Ventes</h1>
    
    <div v-if="loading">Chargement des données...</div>
    <div v-if="error">{{ error }}</div>
    
    <!-- Affichage des produits -->
    <section v-if="!loading && !error">
      <h2>Produits</h2>
      <ul>
        <li v-for="product in products" :key="product.ProductID">
          <strong>{{ product.ProductName }}</strong> - 
          Catégorie: {{ product.Category }} - 
          Prix: {{ product.Price }} MAD
        </li>
      </ul>

      <!-- Affichage des ventes -->
      <h2>Ventes</h2>
      <ul>
        <li v-for="sale in sales" :key="sale.SaleID">
          Vente ID: {{ sale.SaleID }} - 
          Produit ID: {{ sale.ProductID }} - 
          Quantité: {{ sale.Quantity }} - 
          Date: {{ new Date(sale.Date).toLocaleString() }} - 
          Montant total: {{ sale.TotalAmount }} MAD
        </li>
      </ul>

      <!-- Total des ventes -->
      <h2>Total des Ventes</h2>
      <p><strong>{{ totalSales }} MAD</strong></p>

      <!-- Statistiques par catégorie -->
      <h2>Statistiques par Catégorie</h2>
      <ul>
        <li v-for="stat in categoryStats" :key="stat.Category">
          Catégorie: {{ stat.Category }} - Total des ventes: {{ stat.TotalSales }} MAD
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      products: [], // Liste des produits
      sales: [], // Liste des ventes
      totalSales: 0, // Total des ventes
      categoryStats: [], // Statistiques par catégorie
      loading: true, // Indicateur de chargement
      error: null, // Message d'erreur
    };
  },
  created() {
    // Charger les données des quatre API en parallèle
    Promise.all([
      axios.get("http://localhost:3000/api/products"), // API des produits
      axios.get("http://localhost:3000/api/sales"), // API des ventes
      axios.get("http://localhost:3000/api/totalVentes"), // API du total des ventes
      axios.get("http://localhost:3000/api/statistiques"), // API des statistiques par catégorie
    ])
      .then(([productsResponse, salesResponse, totalSalesResponse, categoryStatsResponse]) => {
        this.products = productsResponse.data; // Assigner les produits
        this.sales = salesResponse.data; // Assigner les ventes
        this.totalSales = totalSalesResponse.data.totalSales; // Assigner le total des ventes
        this.categoryStats = categoryStatsResponse.data; // Assigner les statistiques par catégorie
        this.loading = false; // Désactiver le chargement
      })
      .catch((err) => {
        this.error = "Erreur lors du chargement des données : " + err.message;
        this.loading = false; // Désactiver le chargement même en cas d'erreur
      });
  },
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
  margin: 20px;
}
h1, h2 {
  color: #2c3e50;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 10px 0;
  padding: 10px;
  background-color: #f4f4f4;
  border: 1px solid #ddd;
  border-radius: 5px;
}
p {
  font-size: 1.2em;
  font-weight: bold;
}
</style>
