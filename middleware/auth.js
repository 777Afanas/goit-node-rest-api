import { connect } from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

function auth(req, res, next) {
  const authorizationHeader = req.headers.authorization;

  // console.log({ authorizationHeader });
  // перевірка на наявність токена   - authorizationHeader  або String  або  undefinde(його немає)
  if (typeof authorizationHeader === "undefined") {
    return res.status(401).send({ message: "Invalid token" });
  }

  const [bearer, token] = authorizationHeader.split(" ", 2);
  // перевірка назначення Bearer
  if (bearer !== "Bearer") {
    return res.status(401).send({ message: "Invalid token" });
  }
  // перевірка  валідності токена  (чи саме токен юзера чи інший)
  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
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

      // console.log({ decode });
      // на реквесті маємо знати який користувач робіит запит, - модифікуємо реквест (мідлвара дозволяє мутувати реквест/респонс)
      req.user = {
        id: decode.id,
        email: decode.email,
      };

      next();
    } catch (error) {
      next(error);
    }
  });
}

export default auth;
