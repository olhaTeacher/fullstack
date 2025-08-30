// ======================
// ІМПОРТ БІБЛІОТЕК
// ======================
import express from "express";
import cors from "cors";           // Дозволяє крос-доменні запити
import dotenv from "dotenv";       // Завантаження змінних середовища
dotenv.config();

// Імпорт моделей та роутерів
import { sequelize, User, Movie, Comment, Like } from "./models/index.js";
import authRoutes from "./routes/auth.js";
import movieRoutes from "./routes/movies.js";
import commentRoutes from "./routes/comments.js";
import { logEvent, logErrors } from "./middleware/loggerMiddleware.js";

// ======================
// СТВОРЕННЯ ЕКСПРЕС-СЕРВЕРУ
// ======================
const app = express();

// --- Middleware ---
app.use(cors());                 // Дозволяє запити з інших доменів
app.use(express.json());          // Парсить JSON у тілі запиту

// ======================
// РОУТИ
// ======================
app.use("/api/auth", authRoutes);       // Маршрути аутентифікації (login/register)
app.use("/api/movies", movieRoutes);    // Маршрути для роботи з фільмами
app.use("/api/comments", commentRoutes);// Маршрути для роботи з коментарями

app.get("/", (req, res) => res.json({ message: "API OK" })); // Базовий тестовий маршрут

// ======================
// ЗАПУСК СЕРВЕРА
// ======================
const PORT = process.env.PORT || 4000;

(async () => {
  try {
    // Перевірка підключення до бази даних
    await sequelize.authenticate();
    console.log("✅ Підключено до бази даних");

    // --- Синхронізація моделей ---
    // Для dev середовища використовуємо force: true, щоб перезавантажити таблиці
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ force: true });
      console.log("✅ Таблиці перезавантажено (force: true)");
    } else {
      await sequelize.sync();
      console.log("✅ Моделі синхронізовано");
    }

    // --- Запуск серверу ---
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    logEvent("Сервер успішно запущено");
  } catch (err) {
    console.error("❌ Не вдалося запустити сервер:", err.message);
  }
})();

// ======================
// Middleware для логування помилок
// ======================
app.use(logErrors);
