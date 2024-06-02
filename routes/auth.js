import express from "express";
import AuthController from "../controllers/auth.js";
// мідлвара перевірки токена
import authMiddleware from "../middleware/auth.js";

const authRouter = express.Router();
// парсить body
const jsonParser = express.json();


authRouter.post("/register", jsonParser, AuthController.register);
authRouter.post("/login", jsonParser, AuthController.login);
authRouter.post("/logout", authMiddleware, AuthController.logout);
authRouter.get("/current", authMiddleware, AuthController.current);

export default authRouter;