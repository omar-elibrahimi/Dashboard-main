<template>
  <div class="sales-report">
    <h2>Total Sales Report</h2>
    <div class="date-inputs">
      <label for="startDate">Start Date:</label>
      <input type="date" id="startDate" v-model="startDate" />

      <label for="endDate">End Date:</label>
      <input type="date" id="endDate" v-model="endDate" />

      <button @click="fetchTotalSales">Fetch Sales</button>
    </div>

    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-else-if="totalSales !== null">
      <h3>Total Sales Amount: {{ totalSales.toFixed(2) }} USD</h3>
    </div>
    <div v-else>
      <p>Enter a date range and click "Fetch Sales" to calculate the total sales.</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "TotalSalesReport",
  data() {
    return {
      startDate: "",
      endDate: "",
      totalSales: null,
      errorMessage: null,
    };
  },
  methods: {
    async fetchTotalSales() {
      this.errorMessage = null;
      this.totalSales = null;

      if (new Date(this.startDate) > new Date(this.endDate)) {
        this.errorMessage = "Start date must be earlier than the end date.";
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/analytics/total_sales`,
          {
            params: {
              startDate: this.startDate,
              endDate: this.endDate,
            },
          }
        );

        const sales = response.data.sales || [];
        this.totalSales = sales
          .filter(sale => !isNaN(sale.Quantity) && !isNaN(sale.TotalAmount))
          .reduce(
            (sum, sale) => sum + sale.Quantity * sale.TotalAmount,
            0
          );
      } catch (error) {
        this.errorMessage = "An error occurred while fetching the data.";
        console.error(error);
      }
    },
  },
};
</script>

<style scoped>
.sales-report {
  text-align: center;
  margin: 20px;
}
.date-inputs {
  margin-bottom: 20px;
}
.error {
  color: red;
}
</style>
