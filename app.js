import express from "express";
import morgan from "morgan";
import cors from "cors";

import contactsRouter from "./routes/contactsRouter.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());

// глобальна мідлвара парсить req.body    jsonParser
app.use(express.json());

app.use("/api/contacts", contactsRouter);

// Handler 404 Error - мідлвара
// app.use((req, res, next) => {
app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Handler (500) Application Error - мідлвара
app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});
