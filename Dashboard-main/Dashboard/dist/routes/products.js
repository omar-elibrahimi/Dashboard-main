"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_js_1 = require("../controllers/products.js");
const router = (0, express_1.Router)();
const productController = new products_js_1.ProductController();
/**
 * Définition des routes pour les produits
 */
router.get("/products", (req, res) => productController.getProducts(req, res));
exports.default = router;
