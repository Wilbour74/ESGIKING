import { RestaurantService, SessionService } from "../services";
import { Request, Response } from "express";
import { Router } from "express";
import { json } from "express";
import { Session } from "../models";

export class RestaurantController{
    readonly restaurantService: RestaurantService;
    readonly sessionService: SessionService

    constructor(restaurantService: RestaurantService, sessionService: SessionService){
        this.restaurantService = restaurantService;
        this.sessionService = sessionService;
    }

    async createRestaurant(req: Request, res: Response){
        console.log("Oui")
        if(!req.body || typeof req.body.city !== "string") {
            res.status(400).json({message: "Invalide request body"});
            return;
        }

        const {city, products} = req.body;
        const token = req.headers.authorization!
        const tokenWithoutBearer = token.replace(/^Bearer\s/, '');
        const session = await this.sessionService.getActiveSession(tokenWithoutBearer);
        const director = session?.user!;

        try{
            const restaurant = await this.restaurantService.makeRestaurant({city, products, director})
            res.status(200).json({restaurant});
        } catch(error){
            res.status(500).json({message: "Error create restaurant"})
        }
    }

    async getRestaurants(req: Request, res: Response){
        return this.restaurantService.fetchRestaurants();
    }

    buildRouter(): Router {
        const router = Router();
        router.post("/make", json(), this.createRestaurant.bind(this));
        router.get("/all", json(), this.getRestaurants.bind(this));
        return router;
    }
}