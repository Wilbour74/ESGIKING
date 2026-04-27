import { Schema } from "mongoose";
import { User, UserRole } from "../../models";

export function getUserSchema(): Schema<User> {
    return new Schema({
        nickname: {
            type: Schema.Types.String,
            required: true,
            unique: true
        },
        password: {
            type: Schema.Types.String,
            required: true
        },
        email: {
            type: Schema.Types.String,
            required: true
        },
        role: {
            type: Schema.Types.Number,
            enum: Object.values(UserRole).filter(value => typeof value === "number"),
            required: true
        }
    }, {
        versionKey: false,
        collection: "users"
    });
}