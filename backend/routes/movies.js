// Імпорт бібліотек
import express from "express";
import fetch from "node-fetch";
import { Movie, Like, Comment } from "../models/index.js";
import { authMiddleware } from "../middleware/auth.js";
import dotenv from "dotenv";
import { logEvent } from "../middleware/loggerMiddleware.js";

dotenv.config();

const router = express.Router();

// ======================
// ФУНКЦІЯ ІМПОРТУ З TMDB
// ======================
async function importFromTMDB(page = 1) {
  if (!process.env.TMDB_API_KEY) {
    throw new Error("TMDB_API_KEY not set in .env");
  }

  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=${page}`;
  const r = await fetch(url);
  const data = await r.json();
  if (!data?.results) return;

  // Додавання фільмів до бази, якщо їх ще немає
  for (const item of data.results) {
    await Movie.findOrCreate({
      where: { externalId: `tmdb_${item.id}` },
      defaults: {
        title: item.title,
        overview: item.overview,
        posterPath: item.poster_path
          ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
          : null
      }
    });
  }
}

// ======================
// ОТРИМАННЯ ВСІХ ФІЛЬМІВ
// ======================
router.get("/", async (req, res, next) => {
  try {
    const count = await Movie.count();
    if (count === 0) await importFromTMDB(1); // Автоматичний імпорт при порожній базі

    const movies = await Movie.findAll({ order: [["createdAt", "DESC"]] });

    // Підрахунок лайків, дизлайків та коментарів для кожного фільму
    const result = await Promise.all(
      movies.map(async m => {
        const likes = await Like.count({ where: { movieId: m.id, type: "like" } });
        const dislikes = await Like.count({ where: { movieId: m.id, type: "dislike" } });
        const comments = await Comment.findAll({ where: { movieId: m.id } });
        return { ...m.toJSON(), likes, dislikes, comments };
      })
    );

    logEvent(`Отримано список фільмів | Count: ${result.length}`);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

// ======================
// ІМПОРТ ФІЛЬМІВ З TMDB
// ======================
router.post("/import", async (req, res, next) => {
  try {
    const page = req.body.page || 1;
    await importFromTMDB(page);
    logEvent(`Імпортовано сторінку TMDB: ${page}`);
    res.json({ message: "Imported page " + page });
  } catch (err) {
    next(err);
  }
});

// ======================
// ДЕТАЛІ ФІЛЬМУ
// ======================
router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const movie = await Movie.findByPk(id);
    if (!movie) {
      logEvent(`Фільм не знайдено | ID: ${id}`);
      return res.status(404).json({ message: "Movie not found" });
    }

    const likes = await Like.count({ where: { movieId: movie.id, type: "like" } });
    const dislikes = await Like.count({ where: { movieId: movie.id, type: "dislike" } });
    const comments = await Comment.findAll({
      where: { movieId: movie.id },
      include: ["user"]
    });

    logEvent(`Отримано деталі фільму | ID: ${id}`);
    res.json({ ...movie.toJSON(), likes, dislikes, comments });
  } catch (err) {
    next(err);
  }
});

// ======================
// ЛАЙК/ДИЗЛАЙК ФІЛЬМУ
// ======================
router.post("/:id/like", authMiddleware, async (req, res, next) => {
  try {
    const movieId = req.params.id;
    const { type } = req.body; // "like" або "dislike"
    const userId = req.user.id;

    if (!["like", "dislike"].includes(type)) {
      return res.status(400).json({ message: "Bad type" });
    }

    // Перевірка, чи користувач вже ставив лайк/дизлайк
    const existing = await Like.findOne({ where: { userId, movieId } });
    if (existing) {
      existing.type = type;
      await existing.save();
      logEvent(`Користувач ${userId} змінив лайк/дизлайк фільму ${movieId} на ${type}`);
      return res.json(existing);
    } else {
      const like = await Like.create({ userId, movieId, type });
      logEvent(`Користувач ${userId} поставив ${type} фільму ${movieId}`);
      return res.json(like);
    }
  } catch (err) {
    next(err);
  }
});

// ======================
// ДОДАВАННЯ КОМЕНТАРЯ ДО ФІЛЬМУ
// ======================
router.post("/:id/comment", authMiddleware, async (req, res, next) => {
  try {
    const movieId = req.params.id;
    const { text } = req.body;
    const userId = req.user.id;

    if (!text) return res.status(400).json({ message: "No text" });

    const comment = await Comment.create({ userId, movieId, text });
    logEvent(`Користувач ${userId} додав коментар до фільму ${movieId}: ${text}`);
    res.json(comment);
  } catch (err) {
    next(err);
  }
});

// Експорт роутера
export default router;
