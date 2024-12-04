"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const products_js_1 = require("../models/products.js");
class ProductService {
    /**
     * Récupère tous les produits
     * @returns Liste des produits
     */
    getAllProducts() {
        return products_js_1.products;
    }
}
exports.ProductService = ProductService;
