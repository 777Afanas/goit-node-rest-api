// mongodb object modeling tool designed to work in an asynchronous enviroment, supports node.js
import { connect } from "mongoose";
// бібліотека для генерування JSON Web Tokens
import jwt from "jsonwebtoken";
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
      const user = await User.findById(decode.id);

      if (user === null) {
        return res.status(401).send({ message: "Invalid token" });
      }

      if (user.token !== token) {
        return res.status(401).send({ message: "Invalid token" });
      }

      //   console.log({ decode });
      // мутуємо reqest - додаємо   id: decode.id,, що дозволяє вибирати контакти конкретного юзера - для надання кастомізованої відповіді
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
