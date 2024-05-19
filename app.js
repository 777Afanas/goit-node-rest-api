import "dotenv/config";
import path from "node:path";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import authMiddleware from "./middleware/auth.js";
 
import authRouter from "./routes/auth.js";
import avatarRouter from "./routes/users.js";
import contactsRouter from "./routes/contactsRouter.js";

import "./db.js";


const app = express();

app.use(morgan("tiny"));
app.use(cors());  

// налаштування, щоб експресс віддавав статичні файли папки pablic/avatars
app.use("/avatars", express.static(path.resolve("public/avatars"))); 
app.use("/users", authRouter);
app.use("/users", authMiddleware, avatarRouter);
// з міддлварою - перевірка токена
app.use("/api/contacts", authMiddleware, contactsRouter);


app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});