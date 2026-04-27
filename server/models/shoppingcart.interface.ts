import { User } from "./user.interface";
import { Product } from "./product.interface";

export interface Order {
    _id: string;
    owner : string | User;
    date : Date;
    totalPrice : number;
    product : Product[];
    paid : boolean;
    delivered : boolean; 
}