import express from "express";
import AuthController from "../controllers/auth.js";

const authRouter = express.Router();
const jsonParser = express.json();


authRouter.post("/register", jsonParser, AuthController.register);
// authRouter.post("/login", jsonParser, AuthController.login);


export default authRouter;