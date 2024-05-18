import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import { authSchema } from "../schemas/authSchemas.js";

async function register(req, res, next) {
  const { password, email, subscription, token } = req.body;
  // const { password, email, subscription } = req.body;

  const { error } = authSchema.validate(req.body, {
    convert: false,
  });
  if (error) {
    return res
      .status(400)
      .json({ message: "Fields must be filled in correctly" });
  }

  try {
    const user = await User.findOne({ email });
    if (user !== null) {
      return res.status(409).send({ message: "User already registered" });
    }

    // Хешування паролю (сіль)
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await User.create({
      email,
      password: passwordHash,
      subscription,
      token,
    });

    res.status(201).json({
      user: {
        email: result.email,
        subscription: result.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { password, email } = req.body;

  const { error } = authSchema.validate(req.body, {
    convert: false,
  });
  if (error) {
    return res
      .status(400)
      .json({ message: "Fields must be filled in correctly" });
  }

  try {
    const user = await User.findOne({ email });
    // есть ли юзер с таким емейлом  -   если нет  - 401
    if (user === null) {
      // console.log("email");
      return res.status(401).send({ message: "Email or password is wrong" });
    }
    // сравниваем пароль юзера с хешем которій храниться в его документе в базе данных
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch === false) {
      // console.log("password");
      return res.status(401).send({ message: "Email or password is wrong" });
    }
    //  випускаємо токен
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "23h" }
      //   { expiresIn: "2 days" }
    );

    await User.findByIdAndUpdate(user._id, { token });

    res
      .status(200)
      .json({ token, user: { email, subscription: user.subscription } });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  // res.send("Logout");
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

async function current(req, res, next) {
  console.log(req.user);
  // res.send("Current");
  const { id } = req.user;
  try {
    // const currentUser = await User.findById(id);
    const currentUser = await User.findById(req.user.id);

    if (currentUser === null) {
    // if (!currentUser) {
      return res.status(401).send({ message: "Not authorized" });
    }

    res
      .status(200)
      .json({
        email: currentUser.email,
        subscription: currentUser.subscription,
      });
  } catch (error) {
    next(error);
  }
}

export default {
  register,
  login,
  logout,
  current,
};
