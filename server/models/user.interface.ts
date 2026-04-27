import { Order } from "./order.interface";

export enum UserRole {
    bigboss = 0,
    admin = 1,
    customer = 2,
    preparator = 3,
    delivery_man = 4 
}

export interface User {
    _id: string;
    nickname: string;
    email: string;
    password: string;
    role: UserRole;
    adress: string;
    orders: string[] | Order[];
}