<template>
  <div>
    <h2>Most Sold Categories</h2>
    <canvas ref="chart"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
import axios from "axios";

export default {
  name: "CategoryComponent",
  data() {
    return {
      chart: null,
      categorySales: [], // Holds the category data fetched from the API
    };
  },
  mounted() {
    // Register all necessary Chart.js components
    Chart.register(...registerables);
    this.fetchCategorySales();
  },
  methods: {
    async fetchCategorySales() {
      try {
        // Fetch data for most sold categories
        const response = await axios.get("http://localhost:3000/analytics/category_sales");
        this.categorySales = response.data;

        // Render the chart after fetching the data
        this.renderChart();
      } catch (error) {
        console.error("Error fetching category sales:", error);
      }
    },
    renderChart() {
      const ctx = this.$refs.chart.getContext("2d");
      
      // Prepare data for the chart
      const labels = this.categorySales.map((item) => item.category); // Categories on the x-axis
      const quantities = this.categorySales.map((item) => item.totalQuantity); // Quantities on the y-axis

      // Create the bar chart
      this.chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Quantity Sold",
              data: quantities,
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Categories",
              },
            },
            y: {
              title: {
                display: true,
                text: "Quantity Sold",
              },
            },
          },
        },
      });
    },
  },
};
</script>

<style scoped>
div {
  width: 100%;
  height: 400px;
}
</style>
