import { Schema } from "mongoose";
import { Restaurant, User, Product } from "../../models";

export function getRestaurantSchema(): Schema<Restaurant> {
    return new Schema({
        city: {
            type: Schema.Types.String,
            required: true,
            unique: true
        },
        director: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        products: [
            {
                type: Schema.Types.ObjectId,
                ref: "Product"
            }
        ]
    }, {
        versionKey: false, 
        collection: "restaurants"
    })
}