// mongodb object modeling tool designed to work in an asynchronous enviroment, supports node.js
import { connect } from "mongoose";
// бібліотека для генерування JSON Web Tokens
import jwt from "jsonwebtoken";
// імпортуємо модель для використання запитів до бази даних
import User from "../models/user.js";

function auth(req, res, next) {
  // отримуємо токен  - Bearer_ets..... ()
  const authorizationHeader = req.headers.authorization;

  //   console.log({ authorizationHeader });

  // перевірка наявності токена
  if (typeof authorizationHeader === "undefined") {
    return res.status(401).send({ message: "Invalid token" });
  }

  // перевірка на зміст токена -  2 частини "Bearer" і токен (безпосередньо)
  const [bearer, token] = authorizationHeader.split(" ", 2);
  // console.log({ bearer, token });

  // перевірка наявності Bearer
  if (bearer !== "Bearer") {
    return res.status(401).send({ message: "Invalid token" });
  }

  // перевірка валідності токена (з нашим ключем)  -   decode   наш пейлоад - дані користувача
  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    // якщо не валідний токен  - Invalid token
    if (err) {
      return res.status(401).send({ message: "Invalid token" });
    }

    try {
      // після валідації токена - робимо запит до БД про юзера в якого decode.id дорівнює його id  в базі даних
      const user = await User.findById(decode.id);
      // якщо нема. ткаого користувача - Invalid token
      if (user === null) {
        return res.status(401).send({ message: "Invalid token" });
      }
      // перевірка  user.token   має дорівнювати token який ми перевіряємо
      if (user.token !== token) {
        return res.status(401).send({ message: "Invalid token" });
      }

      //   console.log({ decode });
      // мутуємо reqest - додаємо   id: decode.id,, що дозволяє вибирати контакти конкретного юзера через jwt-токен
      // - для надання кастомізованої відповіді
      // якщо потрібно більше даних то використовуємо id: user.id,
      req.user = {
        id: decode.id,
        // email: decode.email,
      };

      next();
    } catch (error) {
      next(error);
    }
  });
}

export default auth;
