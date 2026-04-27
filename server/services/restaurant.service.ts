import { Mongoose, Model } from "mongoose";
import { Restaurant } from "../models";
import { getRestaurantSchema } from "./schema";

export type CreateRestaurant = Omit<Restaurant, "_id">;

export class RestaurantService {
    readonly connection: Mongoose;
    readonly restoModel: Model<Restaurant>

    constructor(connection: Mongoose) {
        this.connection = connection;
        this.restoModel = this.connection.model("Restaurant", getRestaurantSchema());
    }

    async makeRestaurant(restaurant: CreateRestaurant): Promise<Restaurant> {
        return this.restoModel.create(restaurant);
    }

    async fetchRestaurants(): Promise<Restaurant[]> {
        return this.restoModel.find().populate("director").exec();
    }
}