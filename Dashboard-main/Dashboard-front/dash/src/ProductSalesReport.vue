<!-- ProductSalesReport.vue -->
<template>
  <div class="sales-report">
    <!-- Date Range Information -->
    <h2 class="date-range-info">
      Please choose a date between 2023-06-17 and 2024-10-29.
    </h2>

    <!-- Date Range Selection -->
    <div class="date-picker-container">
      <div class="date-inputs">
        <div class="input-group">
          <label for="startDate">Date de début:</label>
          <input 
            type="date" 
            id="startDate" 
            v-model="startDate"
            :max="endDate"
          >
        </div>
        <div class="input-group">
          <label for="endDate">Date de fin:</label>
          <input 
            type="date" 
            id="endDate" 
            v-model="endDate"
            :min="startDate"
          >
        </div>
      </div>
      <button 
        @click="fetchSalesData"
        :disabled="!startDate || !endDate"
        class="search-button"
      >
        Rechercher
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">
      Chargement des données...
    </div>

    <!-- Error Message -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Results Table -->
    <div v-if="!loading && salesData.length > 0" class="results-container">
      <h3>Résultats des ventes</h3>
      
      <!-- Summary -->
      <div class="summary">
        <div class="summary-item">
          <span>Total des ventes:</span>
          <strong>{{ formatPrice(totalAmount) }} €</strong>
        </div>
        <div class="summary-item">
          <span>Quantité totale:</span>
          <strong>{{ totalQuantity }}</strong>
        </div>
      </div>

      <!-- Products Table -->
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Produit</th>
              <th>Quantité</th>
              <th>Montant Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in salesData" :key="product.ProductID">
              <td>{{ product.ProductName }}</td>
              <td>{{ product.totalQuantity }}</td>
              <td>{{ formatPrice(product.totalAmount) }} €</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- No Results Message -->
    <div v-if="!loading && salesData.length === 0 && !error" class="no-results">
      Aucune vente trouvée pour cette période.
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ProductSalesReport",

  data() {
    return {
      startDate: "",
      endDate: "",
      salesData: [],
      loading: false,
      error: null,
      totalAmount: 0,
      totalQuantity: 0,
    };
  },

  computed: {
    apiUrl() {
      return `http://localhost:3000/api/products/by-date-range/${this.startDate}/${this.endDate}`;
    },
  },

  methods: {
    async fetchSalesData() {
      if (!this.startDate || !this.endDate) return;

      this.loading = true;
      this.error = null;
      this.salesData = [];

      try {
        const response = await axios.get(this.apiUrl);

        this.salesData = response.data.products;
        this.totalAmount = response.data.summary.totalRevenue;
        this.totalQuantity = response.data.summary.totalQuantitySold;
      } catch (error) {
        this.error =
          "Erreur lors de la récupération des données. Veuillez réessayer.";
        console.error("Error fetching sales data:", error);
      } finally {
        this.loading = false;
      }
    },

    formatPrice(price) {
      return new Intl.NumberFormat("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price);
    },
  },
};
</script>

<style scoped>
.sales-report {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.date-range-info {
  text-align: center;
  color: #555;
  font-size: 18px;
  margin-bottom: 20px;
}

/* Other styles remain unchanged */
</style>
