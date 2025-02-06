import { Router } from "express";
import usersModel from "../models/users.model.js";
import { isValidPassword, createHash, generateToken } from "../utils/index.js";
import passport from "passport";

const router = Router();

// Ruta para obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const users = await usersModel.find();

    // Validar si hay usuarios
    if (users.length === 0) {
      return res.status(404).json({ status: "Error", error: "No users found" });
    }

    res.status(200).json({ status: "Ok", payload: users });
  } catch (error) {
    res.status(500).json({ status: "Error", error: error.message });
  }
});

// Ruta para registrar un nuevo usuario
router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password, role } = req.body;

  try {
    const hashedPassword = createHash(password);
    const newUser = new usersModel({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
      role: "user",
    });

    await newUser.save();
    res.status(201).json({ status: "Ok", payload: newUser });
  } catch (error) {
    res.status(500).json({ status: "Error", error: error.message });
  }
});

// Ruta para el login de usuarios
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Validar que el email y la contraseña estén presentes
  if (!email || !password) {
    return res.status(400).json({ status: "Error", error: "Email and password are required" });
  }

  try {
    // Buscar el usuario en la base de datos
    const userFound = await usersModel.findOne({ email });

    // Validar si el usuario existe
    if (!userFound) {
      return res.status(404).json({ status: "Error", error: "User not found" });
    }

    // Validar la contraseña
    const isvalid = isValidPassword(password, userFound.password);
    if (!isvalid) {
      return res.status(401).json({ status: "Error", error: "Invalid password" });
    }

    // Eliminar la contraseña del objeto de usuario para no enviarla en la respuesta
    const user = userFound._doc;
    delete user.password;

    // Generar un token JWT
    const token = generateToken(user);

    // Establecer el token en una cookie
    res.cookie("tokenCookie", token, { signed: true });

    // Redirigir al usuario a la ruta /current
    res.redirect("/current");
  } catch (error) {
    res.status(500).json({ status: "Error", error: error.message });
  }
});

// Ruta para cerrar sesión
router.post("/logout", (req, res) => {
  res.clearCookie("tokenCookie");
  res.redirect("/");
});

// Ruta para obtener el usuario actual
router.get("/current", passport.authenticate('jwt', { session: false }), (req, res) => {
  const user = req.user;
  res.render("current", { title: "CURRENT", user });
});

export default router;

