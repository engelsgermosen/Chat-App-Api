import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import path from "path";

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email | !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password fields are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: `No existe un usuario con el email: ${email}`,
      });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res
        .status(401)
        .json({ success: false, message: `Contraseña incorrecata` });
    }

    const data = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      process.env.JWT_KEY || "Mi-keySyperSegura",
      {
        expiresIn: process.env.JWT_DURATION || "1h",
      }
    );
    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const Register = async (req, res) => {
  try {
    const { name, email } = req.body;
    let { password } = req.body;
    const mImage = req.file;
    const avatar = "/" + path.relative("public", mImage.path);

    if (!name | !email | !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password fields are required",
      });
    }
    password = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password, avatar });

    await user.save();

    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
