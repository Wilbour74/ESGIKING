import { RequestHandler } from "express";
import { UserRole } from '../models';
import { RestaurantService } from '../services';


export function directorOnly(restaurantService: RestaurantService): RequestHandler {
    return async (req, res, next) => {
        const restoId = req.params.restoId;
        const restaurantId = typeof restoId === "string" ? restoId : undefined;
        if (!restaurantId) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: "Missing restaurant id" }));
            return;
        }
        if (!req.user) {
            console.error("Missing user-connected middleware");
            res.statusCode = 401;
            res.end(JSON.stringify({ error: "You must be logged in to access this resource" }));
            return;
        }

        const role = req.user.role;

        if(role !== UserRole.admin) {
            res.statusCode = 403;
            res.end(JSON.stringify({ error: "You do not have permission to access this resource" }));
            return;
        }

        const restaurant = await restaurantService.findRestaurantById(restaurantId);

        if(!restaurant) {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: "Restaurant not found" }));
            return;
        }

        if(!restaurant.director || typeof restaurant.director === "string" || restaurant.director._id.toString() !== req.user._id.toString()) {
            res.statusCode = 403;
            res.end(JSON.stringify({ error: "You are not the director of this restaurant" }));
            return;
        }
        next();
    }
}