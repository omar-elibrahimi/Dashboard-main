
// services.ts
import { Product, Sale } from "../models/getProducts_Ventes"

export class ProductListService {
   
    async getAllProductsWithSales() {
        try {
            // 1-get products from database with find() and stored in products
            const products = await Product.find().lean(); 

     
            const productsWithSales = await Promise.all(
                //3- associe a chaque produit son sales avec map
                products.map(async (product) => {
                    // 2-get sales from database with find by productID 
                    const sales = await Sale.find({ ProductID: product.ProductID }).lean();
                    // 4-retourner tous les produits avec les sales 
                    return { ...product, sales };
                })
            );

            return productsWithSales;
        } catch (error) {
            throw new Error("Erreur lors de la récupération des produits avec leurs ventes.");
        }
    }

    async getMostSoldProducts(limit?: number) {
        try {
          // Define the pipeline stages with proper typing
          const pipeline: any[] = [
            {
              $group: {
                _id: "$ProductID",
                totalQuantity: { $sum: "$Quantity" }
              }
            },
            { 
              $sort: { totalQuantity: -1 } 
            }
          ];
    
          // Add limit stage if specified
          if (limit) {
            pipeline.push({ $limit: limit });
          }
    
          const salesAggregation = await Sale.aggregate(pipeline);
    
          // Get product details for the aggregated sales
          const mostSoldProducts = await Promise.all(
            salesAggregation.map(async (sale) => {
              const product = await Product.findOne({ ProductID: sale._id }).lean();
              return {
                productName: product?.ProductName,
                productID: sale._id,
                totalQuantity: sale.totalQuantity,
                category: product?.Category
              };
            })
          );
    
          return mostSoldProducts;
        } catch (error) {
          throw new Error("Erreur lors de la récupération des produits les plus vendus.");
        }
      }

      async getMostSoldCategories() {
        try {
          // Get all products with their sales
          const products = await Product.find().lean();
          const categorySales = new Map<string, number>();
    
          // Get all sales for each product and aggregate by category
          await Promise.all(
            products.map(async (product) => {
              const sales = await Sale.find({ ProductID: product.ProductID }).lean();
              const totalQuantity = sales.reduce((sum, sale) => sum + sale.Quantity, 0);
              
              // Add quantity to category total
              const currentTotal = categorySales.get(product.Category) || 0;
              categorySales.set(product.Category, currentTotal + totalQuantity);
            })
          );
    
          // Convert Map to array and sort by quantity in descending order
          const sortedCategories = Array.from(categorySales.entries()).map(([category, totalQuantity]) => ({
            category,
            totalQuantity
          })).sort((a, b) => b.totalQuantity - a.totalQuantity);
    
          return sortedCategories;
        } catch (error) {
          throw new Error("Erreur lors de la récupération des catégories les plus vendues.");
        }
      }


      async getProductsByDateRange(startDate: string, endDate: string) {
        try {
          // Find all sales within the date range
          const sales = await Sale.find({
            Date: {
              $gte: new Date(startDate),
              $lte: new Date(`${endDate}T23:59:59.999Z`)
            }
          }).lean();
    
          // Get unique product IDs from the sales
          const productIds = [...new Set(sales.map(sale => sale.ProductID))];
    
          // Get the product details for these sales
          const products = await Product.find({
            ProductID: { $in: productIds }
          }).lean();
    
          // Map products with their sales for the specified date range
          const productsWithSales = products.map(product => {
            const productSales = sales.filter(sale => 
              sale.ProductID === product.ProductID
            );
    
            return {
              ...product,
              sales: productSales,
              totalQuantity: productSales.reduce((sum, sale) => sum + sale.Quantity, 0),
              totalAmount: productSales.reduce((sum, sale) => sum + sale.TotalAmount, 0)
            };
          });
    
          return productsWithSales;
        } catch (error) {
          throw new Error("Erreur lors de la récupération des produits par période.");
        }
      }
      async getProductsByDateRangeOptimized(startDate: string, endDate: string) {
        try {
          const products = await Sale.aggregate([
            {
              $match: {
                Date: {
                  $gte: new Date(startDate),
                  $lte: new Date(`${endDate}T23:59:59.999Z`)
                }
              }
            },
            {
              $lookup: {
                from: 'products',
                localField: 'ProductID',
                foreignField: 'ProductID',
                as: 'product'
              }
            },
            {
              $unwind: '$product'
            },
            {
              $group: {
                _id: '$ProductID',
                productDetails: { $first: '$product' },
                sales: { $push: '$$ROOT' },
                totalQuantity: { $sum: '$Quantity' },
                totalAmount: { $sum: '$TotalAmount' }
              }
            },
            {
              $project: {
                _id: 0,
                ProductID: '$_id',
                ProductName: '$productDetails.ProductName',
                Category: '$productDetails.Category',
                Price: '$productDetails.Price',
                sales: 1,
                totalQuantity: 1,
                totalAmount: 1
              }
            },
            {
              $sort: { totalQuantity: -1 } // Sort by quantity sold, descending
            }
          ]);
    
          return products;
        } catch (error) {
          throw new Error("Erreur lors de la récupération des produits par période.");
        }
      }
      async getSalesDateRange() {
        try {
            // Get the smallest and largest dates from the Sales collection
            const smallestSale = await Sale.findOne().sort({ Date: 1 }).select("Date");
            const biggestSale = await Sale.findOne().sort({ Date: -1 }).select("Date");

            if (!smallestSale || !biggestSale) {
                throw new Error("Aucune donnée de vente trouvée.");
            }

            // Return the smallest and biggest dates
            return {
                smallestDate: smallestSale.Date,
                biggestDate: biggestSale.Date,
            };
        } catch (error) {
            throw new Error("Erreur lors de la récupération de la plage de dates des ventes.");
        }
    }

    async getSalesByDateRange(startDate: Date, endDate: Date) {
      try {
          // Find all sales within the date range
          const sales = await Sale.find({
              Date: { $gte: startDate, $lte: endDate }
          }).sort({ Date: 1 });

          // Get all unique product IDs from the sales
          const productIds = [...new Set(sales.map((sale) => sale.ProductID))];

          // Fetch all products in one query
          const products = await Product.find({
              ProductID: { $in: productIds }
          });

          // Create a map for quick product lookup
          const productMap = new Map(
              products.map((product) => [product.ProductID, product])
          );

          // Combine sale and product information
          return sales.map((sale) => {
              const product = productMap.get(sale.ProductID);
              return {
                  SaleID: sale.SaleID,
                  ProductName: product ? product.ProductName : "Unknown Product",
                  Quantity: sale.Quantity,
                  Price: product ? product.Price : 0,
                  TotalAmount: sale.TotalAmount,
                  Date: sale.Date
              };
          });
      } catch (error) {
          throw new Error(`Error fetching sales:`);
      }
  }
}
