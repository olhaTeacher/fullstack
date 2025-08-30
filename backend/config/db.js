// Підключення бібліотеки Sequelize для роботи з базою даних
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Завантажуємо змінні середовища з файлу .env
dotenv.config();

// Ініціалізація Sequelize з параметрами підключення до MySQL
// Використовуємо змінні середовища: DB_NAME, DB_USER, DB_PASS, DB_HOST
export const sequelize = new Sequelize(
  process.env.DB_NAME, // Назва бази даних
  process.env.DB_USER, // Користувач бази
  process.env.DB_PASS, // Пароль користувача
  {
    host: process.env.DB_HOST || "localhost", // Хост бази, якщо не задано — localhost
    dialect: "mysql", // Використовуємо MySQL
    logging: false // Вимикаємо логування SQL-запитів
  }
);

// Функція для перевірки підключення до бази даних
export async function testConnection() {
  try {
    await sequelize.authenticate(); // Спроба підключення
    console.log("DB connected"); // Підключення успішне
  } catch (err) {
    console.error("DB connection error:", err); // Вивід помилки при підключенні
  }
}

