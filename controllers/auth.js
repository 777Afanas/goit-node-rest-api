import User from "../models/user.js";

async function register(req, res, next) {
    const { name, email, password } = req.body;
    const emailInLowerCase = email.toLowerCase();

  try {
    const user = await User.findOne({ email: emailInLowerCase });
    if (user !== null) {
      return res.status(409).send({ message: "User already registered" });
    }

    const result = await User.create({ name, email: emailInLowerCase, password });
    console.log(result);
    res.send("Register");
  } catch (error) {
    next(error);
  }
}

export default {
  register,
};
