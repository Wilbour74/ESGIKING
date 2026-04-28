import { Schema } from "mongoose";
import { Product, ProductType, ProductCategory } from "../../models";

export function getProductSchema(): Schema<Product> {
    return new Schema({
        name: {
            type: Schema.Types.String,
            required: true,
        },
        price: {
            type: Schema.Types.Number,
            required: true,
        },
        type: {
            type: Schema.Types.String,
            enum: ProductType,
            required: true,
        },
        category: {
            type: Schema.Types.String,
            enum: ProductCategory,
            required: true,
        }
    }, {
        versionKey: false, 
        collection: "products"
    })
}