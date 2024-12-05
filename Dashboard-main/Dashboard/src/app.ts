
// app.ts
import express, { Application } from "express";
import mongoose from "mongoose";
import productListRoutes from "./routes/getProducts_Ventes";
import cors from "cors";

const app: Application = express();
const PORT = process.env.PORT || 3000;
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require('swagger-ui-express')
// Middleware
app.use(express.json());
app.use(cors());
// Routes
app.use(productListRoutes);


const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "World of Numeric entretien",
        version: "1.0.0",
        description: "API documentation for E-commerce Dashboard",
      },
      servers: [
        {
          url: "http://localhost:3000",
        },
      ],
    },
    apis: ["./routes/getProducts_Ventes.ts"], // Adjust this path to your route files
  };

  const swaggerDocs = swaggerJsdoc(swaggerOptions);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
// In your app.ts
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

// Connexion à MongoDB
mongoose.connect("mongodb+srv://admin:admin@cluster0.kbohmbm.mongodb.net/").then(() => {
    console.log("Connecté à la base MongoDB.");
    app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
}).catch(err => {
    console.error("Erreur de connexion à MongoDB :", err);
});
