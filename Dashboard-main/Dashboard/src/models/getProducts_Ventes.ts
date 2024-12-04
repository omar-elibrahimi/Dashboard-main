
// models.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
    ProductID: number;
    ProductName: string;
    Category: string;
    Price: number;
}

const ProductSchema: Schema = new Schema({
    ProductID: { type: Number, required: true, unique: true },
    ProductName: { type: String, required: true },
    Category: { type: String, required: true },
    Price: { type: Number, required: true }
});

export const Product = mongoose.model<IProduct>("Product", ProductSchema);



export interface ISale extends Document {
    SaleID: number;
    ProductID: number;
    Quantity: number;
    Date: Date;
    TotalAmount: number;
}

const SaleSchema: Schema = new Schema({
    SaleID: { type: Number, required: true, unique: true },
    ProductID: { type: Number, required: true },
    Quantity: { type: Number, required: true },
    Date: { type: Date, required: true },
    TotalAmount: { type: Number, required: true }
});

export const Sale = mongoose.model<ISale>("Sale", SaleSchema);
