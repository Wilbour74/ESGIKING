import { User } from "./user.interface";
import { Product } from "./product.interface";

export enum OrderStatus {
    pending = "pending",
    preparing = "preparing",
    delivering = "delivering",
    delivered = "delivered"
}

export interface Order {
    _id: string;
    owner : string | User;
    date : Date;
    totalPrice : number;
    product : Product[];
    paid : boolean;
    status : OrderStatus;
    delivery_man : string | User | null;
}