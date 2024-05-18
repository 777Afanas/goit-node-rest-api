// import contact from "../models/contact.js";
import Contact from "../models/contact.js";

import {
  createContactSchema,
  updateContactSchema,
  updateStatusContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res, next) => {
  // console.log(req.user);
  // console.log({ user: req.user });
  try {
    // бере тільки книги в яких owner дроівнює user.id
    const result = await Contact.find({ owner: req.user.id });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;

  try {
    // const result = await Contact.findById(id);

    // if (result === null) {
    //   return res.status(404).json({ message: "Not found" });
    // }

    // if (contact.owner.toString() !== req.user.id) {
    //   return res.status(403).json({ message: "Contact is forbidden" });
    //   // return res.status(404).json({ message: "Not found" });
    // }

    const contact = await Contact.findOne({ _id: id, owner: req.user.id });

    if (contact === null) {
      return res.status(404).send({ message: "Not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  const { id } = req.params;

  try {
    const result = await Contact.findOneAndDelete({
      _id: id,
      owner: req.user.id,
    });
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
    favorite: req.body.favorite,
    owner: req.user.id,
  }; 
  
  // console.log(contact);

  // const { error } = createContactSchema.validate(contact, {
  //   convert: false,
  // });
  // if (error) {
  //   return res.status(400).json({ message: "Fields must be filled" });
  // }

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
    const result = await Contact.findOneAndUpdate(
      {
        _id: id,
        owner: req.user.id,
      },
      contact,
      { new: true }
    );

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
    const result = await Contact.findOneAndUpdate(
      {
        _id: id,
        owner: req.user.id,
      },
      contact,
      { new: true }
    );

    if (result === null) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
