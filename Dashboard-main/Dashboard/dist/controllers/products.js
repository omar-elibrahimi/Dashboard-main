"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const products_js_1 = require("../services/products.js");
const productService = new products_js_1.ProductService();
class ProductController {
    /**
     * Gère la requête pour récupérer tous les produits
     */
    getProducts(req, res) {
        try {
            const products = productService.getAllProducts();
            res.status(200).json(products);
        }
        catch (error) {
            res.status(500).json({ message: "An error occurred while fetching products." });
        }
    }
}
exports.ProductController = ProductController;
