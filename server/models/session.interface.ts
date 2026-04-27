import { User } from "./user.interface";

export interface Session {
    _id: string;
    user: string | User;
    expirationDate: Date;
}