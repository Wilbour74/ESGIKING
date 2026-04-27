import { config } from "dotenv";
import { getRequiredEnvVar, openConnection, UserService, SessionService, RestaurantService } from "./services";
import { UserRole } from "./models";
import { AuthController, RestaurantController } from "./controllers";
import express from "express";

config();

async function main(){
    const connection = await openConnection();
    const userService = new UserService(connection);
    const sessionService = new SessionService(connection);
    const restaurantService = new RestaurantService(connection);
    const empty = await userService.isEmpty();
    
    if(empty){
        await userService.createUser({
            nickname: "root",
            password: "root",
            email: "root@example.com",
            role: UserRole.bigboss
        });
    }
    const app = express();
    const authController = new AuthController(userService, sessionService);
    app.use("/auth", authController.buildRouter());

    const restaurantController = new RestaurantController(restaurantService, sessionService);
    app.use("/resto", restaurantController.buildRouter());

    const port = getRequiredEnvVar("PORT");

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

main().catch(error => {
    console.error("Error starting the application:", error instanceof Error ? error.message : String(error));
    process.exit(1);
});



