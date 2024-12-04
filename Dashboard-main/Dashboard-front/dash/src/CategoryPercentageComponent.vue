<template>
    <div>
      <h2>Répartition des ventes par catégorie en pourcentage</h2>
      <canvas ref="chart"></canvas>
    </div>
  </template>
  
  <script>
  import { Chart, registerables } from 'chart.js';
  import axios from "axios";
  
  export default {
    name: 'CategoryPercentageComponent',
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
          // Fetch data for category sales
          const response = await axios.get('http://localhost:3000/analytics/category_sales');
          this.categorySales = response.data;
          
          // Calculate percentages
          const totalSales = this.categorySales.reduce((sum, item) => sum + item.totalQuantity, 0);
          this.categorySales = this.categorySales.map(item => ({
            ...item,
            percentage: ((item.totalQuantity / totalSales) * 100).toFixed(1)
          }));
  
          // Sort by percentage in descending order
          this.categorySales.sort((a, b) => b.percentage - a.percentage);
  
          // Render the chart after processing the data
          this.renderChart();
        } catch (error) {
          console.error('Error fetching category sales:', error);
        }
      },
      renderChart() {
        const ctx = this.$refs.chart.getContext('2d');
  
        // Prepare data for the chart
        const labels = this.categorySales.map(item => item.category);
        const percentages = this.categorySales.map(item => item.percentage);
  
        // Create the bar chart
        this.chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Pourcentage des ventes',
              data: percentages,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.raw}%`;
                  }
                }
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Catégories',
                },
                ticks: {
                  maxRotation: 45,
                  minRotation: 45
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Pourcentage (%)',
                },
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return value + '%';
                  }
                }
              },
            },
          },
        });
      },
    },
    beforeUnmount() {
      // Cleanup chart when component is destroyed
      if (this.chart) {
        this.chart.destroy();
      }
    }
  };
  </script>
  
  <style scoped>
  div {
    width: 100%;
    height: 400px;
  }
  </style>