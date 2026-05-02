import { RestaurantService, SessionService, UserService } from "../services";
import { Request, Response } from "express";
import { Router } from "express";
import { json } from "express";
import { Session, User, UserRole } from "../models";
import { userConnected, role, directorOnly } from "../middlewares";

export class RestaurantController{
    readonly restaurantService: RestaurantService;
    readonly sessionService: SessionService;

    constructor(restaurantService: RestaurantService, sessionService: SessionService){
        this.restaurantService = restaurantService;
        this.sessionService = sessionService;
    }

    async createRestaurant(req: Request, res: Response){
        if(!req.body || typeof req.body.city !== "string") {
            res.status(400).json({message: "Invalide request body"});
            return;
        }

        const {city, products} = req.body;

        try{
            const restaurant = await this.restaurantService.makeRestaurant({city, products});
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

    async addProductToRestaurant(req: Request, res: Response) {
        const user = req.user;
        if (!user || typeof user === "string") {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const restoId = typeof req.params.restoId === "string" ? req.params.restoId : undefined;
        if (!restoId) {
            res.status(400).json({ message: "Missing restaurant id" });
            return;
        }
        
        const restaurant = await this.restaurantService.findRestaurantById(restoId);
        const director = restaurant?.director as User;

        if(director._id.toString() !== user._id.toString()){
            res.status(403).json({ message: "You are not the director of this restaurant" });
            return;
        }

        const {products} = req.body;
        if(!products){
            res.status(400).json({ message: "Invalid products format" });
            return;
        }

        try {
            await this.restaurantService.affiliateProducts(restoId, products);
            res.status(200).json({ message: "Product added successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error adding product to restaurant", error: error instanceof Error ? error.message : String(error) });
        }
    }

    async getRestaurantProducts(req: Request, res: Response) {
        const restoId = typeof req.params.restoId === "string" ? req.params.restoId : undefined;
        if (!restoId) {
            res.status(400).json({ message: "Missing restaurant id" });
            return;
        }

        try {
            const products = await this.restaurantService.getProducts(restoId);
            res.status(200).json({ products });
        } catch (error) {
            res.status(500).json({ message: "Error fetching restaurant products", error: error instanceof Error ? error.message : String(error) });
        }
    }

    async deleteProductFromRestaurant(req: Request, res: Response) {
        const user = req.user;
        if (!user || typeof user === "string") {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const restoId = typeof req.params.restoId === "string" ? req.params.restoId : undefined;
        if (!restoId) {
            res.status(400).json({ message: "Missing restaurant id" });
            return;
        }
        
        const restaurant = await this.restaurantService.findRestaurantById(restoId);
        const director = restaurant?.director as User;

        if(director._id.toString() !== user._id.toString()){
            res.status(403).json({ message: "You are not the director of this restaurant" });
            return;
        }

        try {
            const { products } = req.body;
            await this.restaurantService.desaffiliateProducts(restoId, products);
            res.status(200).json({ message: "Product deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error deleting product from restaurant", error: error instanceof Error ? error.message : String(error) });
        }
    }


    buildRouter(): Router {
        const router = Router();
        router.post("/make", json(), userConnected(this.sessionService), role(UserRole.bigboss), this.createRestaurant.bind(this));
        router.get("/all", userConnected(this.sessionService), this.getRestaurants.bind(this));
        router.put("/assign-director/:restoId", json(), userConnected(this.sessionService), this.assignDirector.bind(this));
        router.get("/:id", json(), this.getRestaurantById.bind(this));
        router.post("/add-product/:restoId", json(), userConnected(this.sessionService), role(UserRole.admin), directorOnly(this.restaurantService), this.addProductToRestaurant.bind(this));
        router.get("/products/:restoId", json(), this.getRestaurantProducts.bind(this));
        router.delete("/delete-product/:restoId", json(), userConnected(this.sessionService), role(UserRole.admin), directorOnly(this.restaurantService), this.deleteProductFromRestaurant.bind(this));
        return router;
    }
}