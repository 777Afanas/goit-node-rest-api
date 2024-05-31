
// імпорт монгус моделі (схеми)
import Contact from "../models/contact.js";  

import {
  createContactSchema,
  updateContactSchema,
  updateStatusContactSchema, 
} from "../schemas/contactsSchemas.js";


export const getAllContacts = async (req, res, next) => {
  try {
    // запит всіх контактів в колекції
    const result = await Contact.find();

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// пошук контакта за ідентифікатором
export const getOneContact = async (req, res, next) => {
  // отримуємо ідентифікатор сонтакту з id
  const { id } = req.params;
  
// потрібно додати Joi валідацію значень полів щодо id на тип ObjectId !!!!!!!!

  try {     
    //  пошук з ідентифікатором   - якшо немає такого id - findById повертає null
    const result = await Contact.findById(id);
    //  обробка помилки - якщо контакт не знайдено
    if (result === null) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
 // отримуємо ідентифікатор сонтакту з id
  const { id } = req.params;

  try {     
// якщо треба видалити не за id - метод findOneAndDelete({name: "Iv"} ) та зазначити по якому полю

    const result = await Contact.findByIdAndDelete(id);
    // перевірка - обробка помилки - якщо контакт не знайдено
    if (result === null) {
      return res.status(404).json({ message: "Not found" });
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

  //  деструктурізація  = Joi валідація значень полів які валідуються  - та повернення у відповідь
  const { error } = createContactSchema.validate(contact, {
    convert: false,
  });
  if (error) {
    return res.status(400).json({ message: "Fields must be filled" });
  }

  try {
    // створюємо контакт - викликаємо метод create  передаємо contact
    const result = await Contact.create(contact); 

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  // отримуємо ідентифікатор сонтакту з id
  const { id } = req.params;   

// об'єкт  contact - з полями які зчитуються з боді
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
// щоб findByIdAndUpdate ПОВЕРНУВ актуальну(нову а не стару) версію документа треба додати { new: true} - 
    const result = await Contact.findByIdAndUpdate(id, contact, { new: true});
    // перевірка - обробка помилки - якщо контакт не знайдено
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


