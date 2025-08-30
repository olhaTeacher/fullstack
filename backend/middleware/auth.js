// Імпорт бібліотеки для роботи з JWT
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Завантажуємо змінні середовища з файлу .env
dotenv.config();

// Middleware для перевірки авторизації користувача
export function authMiddleware(req, res, next) {
  // Отримуємо заголовок Authorization з запиту
  const authHeader = req.headers.authorization;

  // Якщо заголовок відсутній → повертаємо 401 Unauthorized
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Очікуємо формат "Bearer <token>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Invalid authorization format" });
  }

  const token = parts[1];

  try {
    // Перевірка і декодування токена
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Додаємо дані користувача до об'єкта запиту
    req.user = payload;
    // Продовжуємо виконання наступного middleware або роута
    next();
  } catch (err) {
    // Якщо токен недійсний або прострочений → повертаємо 401
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
