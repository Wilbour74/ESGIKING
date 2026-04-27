import { RestaurantService, SessionService, UserService } from "../services";
import { Request, Response } from "express";
import { Router } from "express";
import { json } from "express";
import { Session, User } from "../models";

export class RestaurantController{
    readonly restaurantService: RestaurantService;
    readonly sessionService: SessionService;

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
        try {
            const restaurants = await this.restaurantService.fetchRestaurants();
            res.status(200).json({ restaurants });
        } catch (error) {
            res.status(500).json({ message: "Error fetching restaurants" });
        }
    }

    async assignDirector(req: Request, res: Response) {
        const token = req.headers.authorization;
        if (!token) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const tokenWithoutBearer = token.replace(/^Bearer\s/, '');
        const session = await this.sessionService.getActiveSession(tokenWithoutBearer);
        if (!session) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const restoId = typeof req.params.restoId === "string" ? req.params.restoId : undefined;
        if (!restoId) {
            res.status(400).json({ message: "Missing restaurant id" });
            return;
        }

        try {
            const {userId} = req.body;
            await this.restaurantService.updateDirector(restoId, userId);
            res.status(200).json({ message: "Director assigned successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error assigning director", error: error instanceof Error ? error.message : String(error) });
        }
    }

    async getRestaurantById(req: Request, res: Response) {
        const id = typeof req.params.id === "string" ? req.params.id : undefined;
        if (!id) {
            res.status(400).json({ message: "Missing restaurant id" });
            return;
        }
        try {
            const restaurant = await this.restaurantService.findRestaurantById(id);
            if (restaurant) {
                res.status(200).json({ restaurant });
            } else {
                res.status(404).json({ message: "Restaurant not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Error fetching restaurant", error: error instanceof Error ? error.message : String(error) });
        }
    }


    buildRouter(): Router {
        const router = Router();
        router.post("/make", json(), this.createRestaurant.bind(this));
        router.get("/all", json(), this.getRestaurants.bind(this));
        router.put("/assign-director/:restoId", json(), this.assignDirector.bind(this));
        router.get("/:id", json(), this.getRestaurantById.bind(this));
        return router;
    }
}