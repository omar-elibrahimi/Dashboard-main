"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const products_js_1 = __importDefault(require("../src/routes/products.js"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware pour parser les JSON
app.use(express_1.default.json());
// Ajouter les routes
app.use("/api", products_js_1.default);
// Lancer le serveur
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
