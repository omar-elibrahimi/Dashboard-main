
// controllers.ts
import { Request, Response } from "express";
import { ProductListService } from "../services/getProducts_Ventes";

const productListService = new ProductListService();

export class ProductListController {
    /**
     * Récupère les produits avec leurs ventes.
     */
    async getProductsWithSales(req: Request, res: Response): Promise<void> {
        try {
            const productsWithSales = await productListService.getAllProductsWithSales();
            res.status(200).json(productsWithSales);
        } catch (error) {
            res.status(500).json({ message: "Erreur lors de la récupération des produits avec leurs ventes.", error });
        }
    }
    async getMostSoldProducts(req: Request, res: Response): Promise<void> {
        try {
          const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
          const mostSoldProducts = await productListService.getMostSoldProducts(limit);
          res.status(200).json(mostSoldProducts);
        } catch (error) {
          res.status(500).json({ 
            message: "Erreur lors de la récupération des produits les plus vendus.", 
            error 
          });
        }
      }

      async getMostSoldCategories(req: Request, res: Response): Promise<void> {
        try {
          const categorySales = await productListService.getMostSoldCategories();
          res.status(200).json(categorySales);
        } catch (error) {
          res.status(500).json({
            message: "Erreur lors de la récupération des catégories les plus vendues.",
            error
          });
        }
      }

      async getProductsByDateRange(req: Request, res: Response): Promise<void> {
        try {
          const { startDate, endDate } = req.params;
          
          // Validate date format
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!startDate || !endDate || !dateRegex.test(startDate) || !dateRegex.test(endDate)) {
            res.status(400).json({
              message: "Format de date invalide. Utilisez le format YYYY-MM-DD"
            });
            return;
          }
    
          // Validate date range
          if (new Date(startDate) > new Date(endDate)) {
            res.status(400).json({
              message: "La date de début doit être antérieure à la date de fin"
            });
            return;
          }
    
          // Using the optimized version
          const productsWithSales = await productListService.getProductsByDateRangeOptimized(
            startDate, 
            endDate
          );
          
          res.status(200).json({
            dateRange: {
              from: startDate,
              to: endDate
            },
            products: productsWithSales,
            summary: {
              totalProducts: productsWithSales.length,
              totalQuantitySold: productsWithSales.reduce((sum, p) => sum + p.totalQuantity, 0),
              totalRevenue: productsWithSales.reduce((sum, p) => sum + p.totalAmount, 0)
            }
          });
        } catch (error) {
          res.status(500).json({
            message: "Erreur lors de la récupération des produits par période.",
            error
          });
        }
      }

      async getSalesDateRange(req: Request, res: Response): Promise<void> {
        try {
            const salesDateRange = await productListService.getSalesDateRange();
            res.status(200).json(salesDateRange);
        } catch (error) {
            res.status(500).json({ 
                message: "Erreur lors de la récupération de la plage de dates des ventes.", 
                
            });
        }
    }

   
    async getSalesByDateRange(req: Request, res: Response): Promise<void> {
      try {
          const { startDate, endDate } = req.query;

          // Validate date format
          const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
          if (!startDate || !endDate || !dateRegex.test(startDate as string) || !dateRegex.test(endDate as string)) {
              res.status(400).json({
                  message: "Invalid date format. Please use YYYY-MM-DD."
              });
              return;
          }

          // Validate date range
          if (new Date(startDate as string) > new Date(endDate as string)) {
              res.status(400).json({
                  message: "Start date must be earlier than end date."
              });
              return;
          }

          // Fetch sales within the date range
          const salesWithDetails = await productListService.getSalesByDateRange(
              new Date(startDate as string),
              new Date(endDate as string)
          );

          // Calculate summary
          const summary = salesWithDetails.reduce(
              (acc, sale) => {
                  acc.totalQuantitySold += sale.Quantity;
                  acc.totalRevenue += sale.TotalAmount;
                  return acc;
              },
              { totalQuantitySold: 0, totalRevenue: 0 }
          );

          res.status(200).json({
              dateRange: {
                  from: startDate,
                  to: endDate
              },
              sales: salesWithDetails,
              summary
          });
      } catch (error) {
          res.status(500).json({
              message: "Error fetching sales by date range.",
              
          });
      }
  }
}
