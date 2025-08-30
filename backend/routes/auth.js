// Імпорт бібліотек
import express from "express";
import bcrypt from "bcrypt";         // Для хешування паролів
import jwt from "jsonwebtoken";      // Для створення JWT токенів
import { User } from "../models/index.js";
import { Op } from "sequelize";      // Для умов OR у запитах
import dotenv from "dotenv";
dotenv.config();

// Імпорт логера для подій
import { logEvent } from "../middleware/loggerMiddleware.js";

// Створення роутера Express
const router = express.Router();

// ======================
// РЕЄСТРАЦІЯ КОРИСТУВАЧА
// ======================
router.post("/register", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Перевірка наявності обов'язкових полів
    if (!username || !email || !password) {
      logEvent(`Помилка реєстрації: пропущені поля | User: ${username || email || "Невідомий"}`);
      return res.status(400).json({ message: "Missing fields" });
    }

    // Перевірка унікальності username
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      logEvent(`Помилка реєстрації: ім'я користувача існує | User: ${username}`);
      return res.status(400).json({ message: "Username already exists" });
    }

    // Перевірка унікальності email
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      logEvent(`Помилка реєстрації: email вже зареєстровано | Email: ${email}`);
      return res.status(400).json({ message: "Email already registered" });
    }

    // Хешування пароля
    const hash = await bcrypt.hash(password, 10);

    // Створення нового користувача
    const user = await User.create({ username, email, password: hash });

    logEvent(`Реєстрація користувача: ${username} | Email: ${email}`);

    // Повернення даних користувача без пароля
    res.json({
      id: user.id,
      username: user.username,
      email: user.email
    });
  } catch (err) {
    next(err);
  }
});

// ======================
// ЛОГІН КОРИСТУВАЧА
// ======================
router.post("/login", async (req, res, next) => {
  try {
    const { identifier, password } = req.body; // identifier може бути username або email

    // Перевірка наявності обов'язкових полів
    if (!identifier || !password) {
      logEvent(`Помилка логіну: пропущені поля | Identifier: ${identifier || "Невідомий"}`);
      return res.status(400).json({ message: "Missing fields" });
    }

    // Пошук користувача по username або email
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username: identifier },
          { email: identifier }
        ]
      }
    });

    if (!user) {
      logEvent(`Невдалий логін: користувача не знайдено | Identifier: ${identifier}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Перевірка пароля
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      logEvent(`Невдалий логін: неправильний пароль | User: ${user.username}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Генерація JWT токена
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    logEvent(`Успішний логін користувача: ${user.username} | Email: ${user.email}`);

    // Повернення токена та даних користувача
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    next(err);
  }
});

// Експорт роутера
export default router;
