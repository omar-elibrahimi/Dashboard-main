# ProductList.vue
<template>
  <div class="product-list">
    <h2 class="text-2xl font-bold mb-4">Liste des Produits</h2>
    
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-4">
      <p>Chargement des produits...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <p>{{ error }}</p>
    </div>

    <!-- Products Table -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-200">
        <thead>
          <tr class="bg-gray-50">
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nom du Produit
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Catégorie
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prix
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre Total de Ventes
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="product in paginatedProducts" :key="product.ProductID">
            <td class="px-6 py-4 whitespace-nowrap">
              {{ product.ProductName }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ product.Category }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ formatPrice(product.Price) }} €
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              {{ getTotalSales(product) }}
            </td>
          </tr>
          <!-- Empty State -->
          <tr v-if="paginatedProducts.length === 0">
            <td colspan="4" class="px-6 py-4 text-center text-gray-500">
              Aucun produit trouvé
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="mt-4 flex justify-center space-x-2">
        <button
          v-for="pageNumber in totalPages"
          :key="pageNumber"
          @click="currentPage = pageNumber"
          :class="[
            'px-3 py-1 rounded',
            currentPage === pageNumber
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]"
        >
          {{ pageNumber }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:3000' 
});

export default {
  name: 'ProductList',
  data() {
    return {
      products: [],
      loading: true,
      error: null,
      currentPage: 1,
      itemsPerPage: 25
    }
  },
  computed: {
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.products.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.products.length / this.itemsPerPage);
    }
  },
  methods: {
    async fetchProducts() {
      try {
        this.loading = true;
        const response = await api.get('/products');
        this.products = response.data;
        this.error = null;
      } catch (err) {
        this.error = "Une erreur est survenue lors du chargement des produits.";
        console.error('Error fetching products:', err);
      } finally {
        this.loading = false;
      }
    },
    formatPrice(price) {
      if (!price && price !== 0) return '0,00';
      return new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(price);
    },
    getTotalSales(product) {
      if (!product.sales) return 0;
      return product.sales.reduce((total, sale) => total + sale.Quantity, 0);
    }
  },
  created() {
    this.fetchProducts();
  }
}
</script>

<style scoped>
.product-list {
  @apply max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8;
}
</style>