import HttpError from "../helpers/HttpError.js";
import contactsServices from "../services/contactsServices.js";
// import contactsService from "../services/contactsServices.js";

export const getAllContacts = async (req, res) => {
    const result = await contactsServices.listContacts();

    res.json(result);
};

export const getOneContact = async (req, res) => {
    const { id } = req.params;     

    const result = await contactsServices.getContactById(id);
    if (!result) {
    //   throw HttpError(404, `Not found`);
      const error = new Error(`Not found`);
      error.status = 404;
      throw error;
      return res.status(404).json({
          message: `Not found`
      })
    }
    console.log(result);
    res.json(result);
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  console.log(req.params);

  const result = await contactsServices.removeContact(id);
  // if (!result) {
  //         throw HttpError(404, `Not found`)
  // }
  console.log(result);
  res.json(result);
};

export const createContact = (req, res) => {};

export const updateContact = (req, res) => {};



// @ GET /api/contacts
// Викликає функцію-сервіс listContacts для роботи з json-файлом contacts.json
// Повертає масив всіх контактів в json-форматі зі статусом 200

// GET /api/contacts/:id
// Викликає функцію-сервіс getContactById для роботи з json-файлом contacts.json
// Якщо контакт за id знайдений, повертає об'єкт контакту в json-форматі зі статусом 200
// Якщо контакт за id не знайдено, повертає json формату {"message": "Not found"} зі статусом 404


// @ DELETE /api/contacts/:id
// Викликає функцію-сервіс removeContact для роботи з json-файлом contacts.json
// Якщо контакт за id знайдений і видалений, повертає об'єкт видаленого контакту в json-форматі зі статусом 200
// Якщо контакт за id не знайдено, повертає json формату {"message": "Not found"} зі статусом 404