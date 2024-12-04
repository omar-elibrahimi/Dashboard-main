<template>
  <div>
    <h2>Top 5 Most Sold Products</h2>
    <div class="chart-container">
      <canvas ref="chart"></canvas>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
import axios from 'axios';

export default {
  name: "ChartComponent",
  data() {
    return {
      chart: null,
      mostSoldProducts: [],
    };
  },
  mounted() {
    Chart.register(...registerables);
    this.fetchMostSoldProducts();
  },
  beforeUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
  },
  methods: {
    async fetchMostSoldProducts() {
      try {
        const response = await axios.get("http://localhost:3000/analytics/trending_products", {
          params: {
            limit: 5 // Get top 5 products
          }
        });
        this.mostSoldProducts = response.data;
        this.renderChart();
      } catch (error) {
        console.error("Error fetching most sold products:", error);
      }
    },
    renderChart() {
      if (this.chart) {
        this.chart.destroy();
      }

      const ctx = this.$refs.chart.getContext("2d");
      
      // Prepare data for the chart
      const labels = this.mostSoldProducts.map(product => product.productName);
      const quantities = this.mostSoldProducts.map(product => product.totalQuantity);
      const backgroundColors = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)'
      ];

      this.chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Quantity Sold",
              data: quantities,
              backgroundColor: backgroundColors,
              borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Top 5 Most Sold Products',
              font: {
                size: 16
              }
            },
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `Quantity Sold: ${context.raw}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Quantity Sold'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Product Name'
              }
            }
          }
        },
      });
    },
  },
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 400px;
  margin: 20px auto;
}

h2 {
  color: #333;
  margin-bottom: 20px;
}
</style>