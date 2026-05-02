import { NextHandleFunction } from 'connect';
import { SessionService } from '../services/session.service';
import { User } from '../models';

declare module "http" {
    interface IncomingMessage {
        user?: User;
    }
}

declare module "express" {
    interface Request {
        user?: User;
    }
}

export function userConnected(sessionService: SessionService): NextHandleFunction {
    return async (req, res, next) => {
        const sessionToken = req.headers.authorization?.split(' ')[1];

        if(!sessionToken) {
            res.statusCode = 401;
            res.end(JSON.stringify({ error: "You must be logged in to access this resource" }));
            return;
        }

        if (sessionToken) {
            const session = await sessionService.getActiveSession(sessionToken);
            if (session) {
                req.user = session.user as User;
            }
        }
        next();
    };
}