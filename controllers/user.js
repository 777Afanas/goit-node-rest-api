import * as fs from "node:fs/promises";
import path from "node:path";
import User from "../models/user.js";
import Jimp from "jimp";
import { authResendVerifySchema } from "../schemas/authSchemas.js";
import mail from "../mail.js";
// import { func } from "joi";

async function uploadAvatar(req, res, next) {
  try {
    const userAvatar = await Jimp.read(req.file.path);
    await userAvatar.cover(250, 250).writeAsync(req.file.path);

    //   перемістили файл з папки TMP в папку public/avatars
    await fs.rename(
      req.file.path,
      path.resolve("public/avatars", req.file.filename)
    );

    // змінюємо значення поля аватар у користувача, додане при його
    // створенні, ідентифікатор  req.user.id, поле Аватар { avatarURL: req.file.filename },
    // повернемо нову версію користувача -  { new: true }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL: req.file.filename },
      { new: true }
    );
    // як що не змогли оновити картинку -
    // дуже малоймовірно - не змогли користувача з таким ідентифікаторм
    if (user === null) {
      return res.status(404).send({ message: "User not fond" });
    }
    // res.send(user);
    res.status(200).json({ avatarURL: user.avatarURL });
  } catch (error) {
    next(error);
  }
}

async function emailVerify(req, res, next) {
  const { verificationToken } = req.params;

  try {
    // 1 варіант
    // пошук користувача по токену верифікації email - verificationToken
    const user = await User.findOneAndUpdate(
      { verificationToken },
      {
        verify: true,
        verificationToken: null,
      },
      { new: true }
    );

    // якщо токен верифікації email (verificationToken) некоректний - 404
    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    // 2 варіант
    // // пошук користувача по токену верифікації email - verificationToken
    // const user = await User.findOne({ verificationToken });
    // // якщо токен верифікації email (verificationToken) некоректний - 404
    // if (user === null) {
    //   return res.status(404).send({ message: "User not found" });
    // }
    // await User.findByIdAndUpdate(user._id, {
    //   verify: true,
    //   verificationToken: null,
    // });

    res.status(200).send({ message: "Email confirm successfully" });
  } catch (error) {
    next(error);
  }

  
}

async function resendingVerify(req, res, next) {
  const { email } = req.body;

  const { error } = authResendVerifySchema.validate(req.body, {
    convert: false,
  });
  if (error) {
    return res
      .status(400)
      .json({ message: "Fields must be filled in correctly" });
  }

  try {
    const user = await User.findOne({ email });

    // Перевірка чи є мейл в базі, якщо нема – помилка, - Якщо в body немає обов'язкового поля email
    if (!user) {
      return res.status(400).send({ message: "Missing required field email" });
    }
    // Перевірка -  як що юзер може вже верифікований - помилка - Якщо користувач вже пройшов верифікацію
    if (user.verify) {
      return res.status(400).send({ message: "Email already verify" });
    }

    // відправка повідомлення щодо верифікації email користувача
    // Якщо з body все добре і користувач не верифікований, повторна відправка листа
    // з verificationToken (його беремо з бази) на вказаний email
    mail.sendMail({
      to: email,
      from: "serhii2111@yahoo.com",
      subject: "Welcom to Contactsbase",
      html: `To confirm your email please go to the <a href="http://localhost:3000/users/verify/${user.verificationToken}">link</a>`,
      text: `To confirm your email please open the link http://localhost:3000/users/verify/${user.verificationToken}`,
    });

    res.status(201).json({ message: "Verify email send success" });
  } catch (error) {
    next(error);
  }
}

export default { uploadAvatar, emailVerify, resendingVerify };
