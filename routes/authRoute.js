import { Router } from "express";
import { Login, Register } from "../controllers/authController.js";

const AuthRouter = Router();

AuthRouter.post("/login", Login);
AuthRouter.post("/register", Register);

export default AuthRouter;
