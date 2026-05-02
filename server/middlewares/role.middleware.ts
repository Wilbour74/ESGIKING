import {SessionService} from "../services";
import { NextHandleFunction } from 'connect';
import { UserRole } from '../models';

export function role(minRole: UserRole): NextHandleFunction {
    return async (req, res, next) => {
        if (!req.user) {
            console.error("Missing user-connected middleware");
            res.statusCode = 401;
            res.end(JSON.stringify({ error: "You must be logged in to access this resource" }));
            return;
        }

        const role = req.user.role;

        if(role > minRole) {
            res.statusCode = 403;
            res.end(JSON.stringify({ error: "You do not have permission to access this resource" }));
            return;
        }

        next();
    }
}