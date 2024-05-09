import Contact from "../models/contact.js";  

import {
  createContactSchema,
  updateContactSchema,
  updateStatusContactSchema, 
} from "../schemas/contactsSchemas.js";


export const getAllContacts = async (req, res, next) => {
  try {
    const result = await Contact.find();

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  
  try {     
    const result = await Contact.findById(id);

    if (result === null) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;

  try {     
    const result = await Contact.findByIdAndDelete(id);
    if (result === null) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };

  const { error } = createContactSchema.validate(contact, {
    convert: false,
  });
  if (error) {
    return res.status(400).json({ message: "Fields must be filled" });
  }

  try {
    const result = await Contact.create(contact);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  const { id } = req.params;   

   const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };
  
  if (Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ message: "Body must have at least one field" }); 
  }
     
  const { error } = updateContactSchema.validate(contact);
 
  if (error) {
    return res.status(400).json({ message: "Fields must be filled" });
  }

  try {         
    const result = await Contact.findByIdAndUpdate(id, contact, { new: true});
    if (result === null) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  const { id } = req.params;   

   const contact = {
    name: req.body.name,
    email: req.body.email,
     phone: req.body.phone,
    favorite: req.body.favorite,
  };
  
  if (Object.keys(req.body).length === 0) {
    return res
      .status(400)
      .json({ message: "Body must have at least one field" }); 
  }
     
  const { error } = updateStatusContactSchema.validate(contact);
 
  if (error) {
    return res.status(400).json({ message: "Fields must be filled" });
  }

  try {         
    const result = await Contact.findByIdAndUpdate(id, contact, { new: true});
    if (result === null) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};