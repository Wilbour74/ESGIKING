import { Model, Mongoose, Types } from "mongoose";
import { Session } from "../models";
import { getSessionSchema } from "./schema";

export type CreateSession = Omit<Session, "_id">;

export class SessionService {
    readonly connection: Mongoose;
    readonly sessionModel: Model<Session>;

    constructor(connection: Mongoose) {
        this.connection = connection;
        this.sessionModel = this.connection.model("Session", getSessionSchema());
    }

    async createSession(session: CreateSession): Promise<Session> {
        return this.sessionModel.create(session);
    }

    async getActiveSession(token: string): Promise<Session | null> {
        if (!Types.ObjectId.isValid(token)) {
            return null;
        }
        const session = await this.sessionModel.findById(token).populate("user").exec();
        if (!session) {
            return null;
        }
        if (session.expirationDate < new Date()) {
            await this.sessionModel.findByIdAndDelete(token);
            return null;
        }
        return session;
    }

    async deleteSession(token: string): Promise<void> {
        if (Types.ObjectId.isValid(token)) {
            await this.sessionModel.findByIdAndDelete(token);
        }
    }

    async isSessionValid(token: string): Promise<boolean> {
        const session = await this.getActiveSession(token);
        return session !== null;
    }
}