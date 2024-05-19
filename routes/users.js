import express from "express";
import UserController from "../controllers/user.js";
import uploadMiddleware from "../middleware/upload.js";


const avatarRouter = express.Router();

avatarRouter.patch("/avatar", uploadMiddleware.single("avatar"), UserController.uploadAvatar);

export default avatarRouter;