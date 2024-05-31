import "dotenv/config";

import express from "express";
import morgan from "morgan";
import cors from "cors";
import authMiddleware from "./middleware/auth.js";

import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/auth.js";
  
import "./db.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());  

app.use("/users", authRouter);
app.use("/api/contacts", authMiddleware, contactsRouter);

// Handler 404 Error
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Handler (500) Application Error
app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});