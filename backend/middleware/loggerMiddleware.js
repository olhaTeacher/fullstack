// Імпорт кастомного логера (наприклад, Winston)
import logger from "../logger.js";

// Middleware для логування всіх HTTP-запитів
export const logRequests = (req, res, next) => {
  // Визначаємо користувача: шукаємо в тілі запиту, параметрах або query
  const user =
    req.body?.username ||
    req.body?.userId ||
    req.query?.username ||
    req.query?.userId ||
    req.params?.username ||
    req.params?.userId ||
    "Гість"; // Якщо користувач не визначений

  // Логування інформації про запит
  logger.info(`[REQUEST] ${req.method} ${req.originalUrl} | User: ${user}`);

  // Передаємо керування наступному middleware
  next();
};

// Middleware для логування помилок
export const logErrors = (err, req, res, next) => {
  // Визначаємо користувача аналогічно logRequests
  const user =
    req.body?.username ||
    req.body?.userId ||
    req.query?.username ||
    req.query?.userId ||
    req.params?.username ||
    req.params?.userId ||
    "Гість";

  // Логування інформації про помилку
  logger.error(
    `[ERROR] ${req.method} ${req.originalUrl} | User: ${user} | Message: ${err.message}`
  );

  // Відправка стандартного повідомлення про помилку клієнту
  res.status(500).json({ error: "Internal Server Error" });
};

// Функція для логування подій (наприклад, імпорт даних, дії користувачів)
export const logEvent = (eventMessage) => {
  logger.info(`[EVENT] ${eventMessage}`);
};
