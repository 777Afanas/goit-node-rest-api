import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact
} from "../controllers/contactsControllers.js";

const contactsRouter = express.Router();
const jsonParser = express.json();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", jsonParser, createContact);

contactsRouter.put("/:id", jsonParser, updateContact);

contactsRouter.patch("/:id", jsonParser, updateStatusContact);

export default contactsRouter;