import * as fs from "node:fs/promises";
import path from "node:path";
import User from "../models/user.js";
import Jimp from "jimp";

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

export default { uploadAvatar };
