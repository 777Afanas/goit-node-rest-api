import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import { authSchema } from "../schemas/authSchemas.js";

async function register(req, res, next) {
    const { password, email, subscription, token } = req.body;
    // const emailInLowerCase = email.toLowerCase();
   
    
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

      const passwordHash = await bcrypt.hash(password, 10);

      
      const result = await User.create({
          email,
          password: passwordHash,
          subscription,
          token
      });
    
    //   res.status(201).send({ message: "Registration succeffully" });     
      res.status(201).json({email, subscription});
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
        if (user === null) {
            console.log("email");
        return res.status(401).send({ message: "Email or password is wrong" });
      }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch === false) {
          console.log("password");
          return res
            .status(401)
            .send({ message: "Email or password is wrong" });
        }

        const token = jwt.sign({ id: user._id, token: user.token }, process.env.JWT_SECRET, {expiresIn: "2 days"});

        res.send({ token });
    //   res.status(201).json({ email, subscription });
    } catch (error) {
      next(error);
    }
}

export default {
    register,
    login
};
