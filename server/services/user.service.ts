import { Mongoose, Model } from "mongoose";
import { User } from "../models";
import { getUserSchema } from "./schema";
import { sha256 } from "./utils";

export type CreateUser = Omit<User, "_id">;

export type UserCredentials = Pick<CreateUser, "nickname" | "password">;

export class UserService {
    readonly connection: Mongoose;
    readonly userModel: Model<User>;

    constructor(connection : Mongoose) {
        this.connection = connection;
        this.userModel = this.connection.model("User", getUserSchema());
    }

    async createUser(user: CreateUser): Promise<User> {
        const newUser = {...user};
        newUser.password = sha256(user.password);
        return this.userModel.create(newUser);
    }

    async isEmpty(): Promise<boolean> {
        const first = await this.userModel.findOne();
        return first === null;
    }

    async findUsingCredentials(credentials: UserCredentials): Promise<User | null>  {
        return this.userModel.findOne({
            nickname: credentials.nickname,
            password: sha256(credentials.password)
        });
    }
}