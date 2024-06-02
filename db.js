// mongodb object modeling tool designed to work in an asynchronous enviroment, supports node.js
import mongoose from "mongoose";

const DB_URI = process.env.DB_URI;

mongoose
  .connect(DB_URI)
  .then(() => console.log("Database connection successfully"))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
