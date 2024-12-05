
// routes.ts
import { Router } from "express";
import { ProductListController } from "../controllers/getProducts_Ventes";

const router = Router();
const productListController = new ProductListController();


router.get("/products", (req, res) => productListController.getProductsWithSales(req, res));
router.get("/analytics/trending_products", (req, res) => productListController.getMostSoldProducts(req, res));

router.get("/analytics/category_sales", (req, res) => 
    productListController.getMostSoldCategories(req, res)
  );

  router.get("/products/by-date-range/:startDate/:endDate", (req, res) => 
    productListController.getProductsByDateRange(req, res)
  );
  router.get("/sales/date-range", (req, res) => 
    productListController.getSalesDateRange(req, res)
);
router.get(
  "/analytics/total_sales",
  (req, res) => productListController.getSalesByDateRange(req, res)
);

export default router;
