import { User } from "./user.interface";
import { Product } from "./product.interface";

export interface Restaurant {
    _id: string
    city: string
    director: string | User
    products: Product[]
}