import { Mongoose, Model } from "mongoose";
import { Product, Restaurant, User } from "../models";
import { getRestaurantSchema, getProductSchema } from "./schema";

export type CreateRestaurant = Omit<Restaurant, "_id" | "director"> & { director?: string | User };

export class RestaurantService {
    readonly connection: Mongoose;
    readonly restoModel: Model<Restaurant>

    constructor(connection: Mongoose) {
        this.connection = connection;
        this.connection.model("Product", getProductSchema());
        this.restoModel = this.connection.model("Restaurant", getRestaurantSchema());
    }

    async makeRestaurant(restaurant: CreateRestaurant): Promise<Restaurant> {
        return this.restoModel.create(restaurant);
    }

    async fetchRestaurants(): Promise<Restaurant[]> {
        return this.restoModel.find().populate("director").exec();
    }

    async findRestaurantById(id: string): Promise<Restaurant | null> {
        return this.restoModel.findById(id).populate("director").exec();
    }

    async updateDirector(restaurantId: string, directorId: string): Promise<void> {
        await this.restoModel.findByIdAndUpdate(restaurantId, { director: directorId });
    }

    async affiliateProducts(restaurantId: string, products: string[]): Promise<void> {
        await this.restoModel.findByIdAndUpdate(restaurantId, { $addToSet: { products: { $each: products } } });
    }

    async getProducts(restaurantId: string): Promise<Product[]> {
        const restaurant = await this.restoModel.findById(restaurantId).populate("products").exec();
        if (!restaurant) {
            throw new Error("Restaurant not found");
        }
        return restaurant.products as Product[];
    }

    async desaffiliateProducts(restaurantId: string, products: string[]): Promise<void> {
        await this.restoModel.findByIdAndUpdate(restaurantId, { $pull: { products: { $in: products } } });
    }
}