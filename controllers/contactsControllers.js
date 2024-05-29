
import contactsServices from "../services/contactsServices.js"; 
// імпорт схем валідації для боді
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const result = await contactsServices.listContacts();

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsServices.getContactById(id);
    if (!result) {
      res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsServices.removeContact(id);
    if (!result) {
      res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  // об'єкт  contact - з полями які зчитуються з боді
  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };
// деструктурізація  = валідація значень полів чкі валідуються  - та повернення у відповідь
  const { error } = createContactSchema.validate(contact, {
    convert: false,
  });
  if (error) {
    return res.status(400).json({ message: "Filds must be filled" }); // або  "Validatiom error"
  }

  try {
    const result = await contactsServices.addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  
  if (Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ message: "Body must have at least one field" });
  }
 
  const { error } = updateContactSchema.validate({ name, email, phone }); 
 
  if (error) {
    return res.status(400).json({ message: "Filds must be filled" });
  }

  try {     
    const result = await contactsServices.updateContact(id, name, email, phone);

    if (!result) {
      res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};


