import express from "express";
import UserController from "../controllers/user.js";
import uploadMiddleware from "../middleware/upload.js";
import authMiddleware from "../middleware/auth.js";


const avatarRouter = express.Router();

// ендпоінт - можливість поновлення аватарки
avatarRouter.patch(
  "/avatar",
    authMiddleware,
    uploadMiddleware.single("avatar"),
  UserController.uploadAvatar
);

// ендпоінт для верифікації email
avatarRouter.get("/verify/:verificationToken", UserController.emailVerify);

// ендпоінт Додавання повторної відправки email користувачу з посиланням для верифікації
// avatarRouter.post("/verify", UserController.resendingVerify);

export default avatarRouter;
