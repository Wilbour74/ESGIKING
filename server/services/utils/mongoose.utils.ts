import { connect, Mongoose } from 'mongoose';
import { getRequiredEnvVar } from './env.utils';

export async function openConnection(): Promise<Mongoose> {
    const uri = getRequiredEnvVar("MONGODB_URI");
    const user = getRequiredEnvVar("MONGODB_USER");
    const password = getRequiredEnvVar("MONGODB_PASSWORD");
    const db = getRequiredEnvVar("MONGODB_DATABASE");
    
    return connect(uri, {
        auth: {
            username: user,
            password: password
        },
        authSource: "admin",
        dbName: db
    });
}