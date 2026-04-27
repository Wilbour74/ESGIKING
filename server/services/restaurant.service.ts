import { Mongoose, Model } from "mongoose";
import { Restaurant, User } from "../models";
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

    async findRestaurantById(id: string): Promise<Restaurant | null> {
        return this.restoModel.findById(id).populate("director").exec();
    }

    async updateDirector(restaurantId: string, directorId: string): Promise<void> {
        await this.restoModel.findByIdAndUpdate(restaurantId, { director: directorId });
    }
}