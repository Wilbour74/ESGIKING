import {Schema} from "mongoose";
import { Session } from "../../models";

export function getSessionSchema(): Schema<Session> {
    return new Schema({
        user: { 
            type: Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
        },
        expirationDate: { 
            type: Schema.Types.Date, 
            required: true 
        }
    }, {
        versionKey: false,
        collection: "sessions"
    });
}