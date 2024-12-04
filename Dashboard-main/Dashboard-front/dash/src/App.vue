<!-- app.vue -->
<template>
  <div id="app">
    <h1>Vue.js and Chart.js Demo</h1>
    <ChartComponent />
    <CategoryComponent />
    <ProductSalesReport />
    <ProductList />
    <CategoryPercentageComponent />
    <TotalSalesReport />
  </div>
</template>

<script>
import ChartComponent from "./ChartComponent.vue";
import CategoryComponent from "./CategoryComponent.vue";
import ProductSalesReport from "./ProductSalesReport.vue";
import CategoryPercentageComponent from "./CategoryPercentageComponent.vue";
import TotalSalesReport from "./TotalSalesReport.vue"
import ProductList from "./ProductList.vue";
export default {
  name: "App",
  components: {
    ChartComponent,
    CategoryComponent,
    ProductSalesReport,
    CategoryPercentageComponent,
    TotalSalesReport,
    ProductList
  },
};
</script>

<style>
#app {
  text-align: center;
  margin: 20px;
}
</style>
