// Імпорт бібліотек
import express from "express";
import { Comment, User } from "../models/index.js";
import { authMiddleware } from "../middleware/auth.js";

// Створення роутера Express
const router = express.Router();

// ======================
// ОТРИМАННЯ КОМЕНТАРІВ ДЛЯ ФІЛЬМУ
// ======================
router.get("/:movieId", async (req, res) => {
  const movieId = req.params.movieId;

  // Отримуємо всі коментарі для вказаного фільму
  // Включаємо дані користувача (id та username)
  const comments = await Comment.findAll({
    where: { movieId },
    order: [["createdAt", "DESC"]], // Сортування від останнього до першого
    include: [
      { model: User, as: "user", attributes: ["id", "username"] }
    ]
  });

  // Форматуємо результат для відправки на фронтенд
  const result = comments.map(c => ({
    id: c.id,
    text: c.text,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    user: c.user
  }));

  res.json(result);
});

// ======================
// ОНОВЛЕННЯ КОМЕНТАРЯ
// ======================
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  const comment = await Comment.findByPk(id);
  if (!comment) return res.status(404).json({ error: "Not found" });

  // Перевірка, чи користувач є власником коментаря
  if (comment.userId !== req.user.id) {
    return res.status(403).json({ error: "Forbidden" });
  }

  // Оновлення тексту коментаря
  comment.text = text;
  await comment.save();

  res.json({ success: true, comment });
});

// ======================
// ВИДАЛЕННЯ КОМЕНТАРЯ
// ======================
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  const comment = await Comment.findByPk(id);
  if (!comment) return res.status(404).json({ error: "Not found" });

  // Перевірка, чи користувач є власником коментаря
  if (comment.userId !== req.user.id) {
    return res.status(403).json({ error: "Forbidden" });
  }

  // Видалення коментаря
  await comment.destroy();
  res.json({ success: true });
});

// Експорт роутера
export default router;
