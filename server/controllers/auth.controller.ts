import { UserService, SessionService } from "../services"
import { Request, Response } from "express";
import { Router } from "express"; 
import { json } from "express";
import { UserRole } from "../models";

export class AuthController{
    readonly userService: UserService;
    readonly sessionService: SessionService;

    constructor(userService: UserService, sessionService: SessionService){
        this.userService = userService;
        this.sessionService = sessionService;
    }

    async me(req: Request, res: Response){
        const token = req.headers.authorization;
        console.log(req);
        if(!token){
            res.status(401).json({message: "Unauthorized"});
            return;
        }
        try{
            const tokenWithoutBearer = token.replace(/^Bearer\s/, '');
            const session = await this.sessionService.getActiveSession(tokenWithoutBearer);
            if(session){
                const user = await this.userService.userModel.findById(session.user);
                res.status(200).json({user});
            }else{
                res.status(401).json({message: "Unauthorized"});
            }
        }catch(error){
            res.status(500).json({message: "Error fetching user", error: error instanceof Error ? error.message : String(error)});
        } 
    }
     
    async register(req: Request, res: Response){
        if(!req.body || typeof req.body.nickname !== "string" || typeof req.body.password !== "string" || typeof req.body.email !== "string"){
            res.status(400).json({message: "Invalid request body"});
            return;
        }
        const {nickname, password, email} = req.body;
        try{
            const user = await this.userService.createUser({nickname, password, email, role: UserRole.customer});
            const session = await this.sessionService.createSession({user: user._id, expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000)});
            res.status(201).json({user, session});
        }catch(error){
            res.status(500).json({message: "Error creating user", error: error instanceof Error ? error.message : String(error)});
        } 
    }

    async createDirector(req: Request, res: Response){
        const token = req.headers.authorization;

        if(!token){
            res.status(401).json({message: "Unauthorized"});
            return;
        }

        const session = await this.sessionService.getActiveSession(token.replace(/^Bearer\s/, ''));
        const user = await this.userService.userModel.findById(session?.user);

        if(!session || !user || user.role !== UserRole.bigboss){
            res.status(403).json({message: "Forbidden"});
            return;
        }

        if(!req.body || typeof req.body.nickname !== "string" || typeof req.body.password !== "string" || typeof req.body.email !== "string"){
            res.status(400).json({message: "Invalid request body"});
            return;
        }

        const {nickname, password, email} = req.body;
        try{
            const user = await this.userService.createUser({nickname, password, email, role: UserRole.admin});
            res.status(201).json({user});
        }catch(error){
            res.status(500).json({message: "Error creating director", error: error instanceof Error ? error.message : String(error)});
        } 
    }

    async login(req: Request, res: Response){
        if(!req.body || typeof req.body.email !== "string" || typeof req.body.password !== "string"){
            res.status(400).json({message: "Invalid request body"});
            return;
        }
        const {email, password} = req.body;
        try {
            const user = await this.userService.findUsingCredentials({ email, password });
            if (!user) {
                res.status(401).json({ message: "Invalid credentials" });
                return;
            }
            // Chercher une session valide existante pour cet utilisateur
            const now = new Date();
            const existingSession = await this.sessionService.sessionModel.findOne({ user: user._id, expirationDate: { $gt: now } });
            if (existingSession) {
                res.status(200).json({ user, session: existingSession });
                return;
            }
            // Sinon, créer une nouvelle session
            const session = await this.sessionService.createSession({ user: user._id, expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000) });
            res.status(200).json({ user, session });
        } catch (error) {
            res.status(500).json({ message: "Error logging in", error: error instanceof Error ? error.message : String(error) });
        }
    }

    buildRouter(): Router {
        const router = Router();
        router.post("/register", json(), this.register.bind(this));
        router.post("/login", json(), this.login.bind(this));
        router.get("/me", json(), this.me.bind(this));
        router.post("/create-director", json(), this.createDirector.bind(this));
        return router;
    }
}