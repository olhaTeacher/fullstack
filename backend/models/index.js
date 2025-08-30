// Імпорт підключення до бази даних
import { sequelize } from "../config/db.js";

// Імпорт моделей
import UserModel from "./user.js";
import MovieModel from "./movie.js";
import CommentModel from "./comment.js";
import LikeModel from "./like.js";

// Ініціалізація моделей
const User = UserModel(sequelize);
const Movie = MovieModel(sequelize);
const Comment = CommentModel(sequelize);
const Like = LikeModel(sequelize);

// ======================
// Встановлення асоціацій
// ======================

// Асоціації для коментарів
User.hasMany(Comment, { foreignKey: "userId" }); // Користувач може мати багато коментарів
Comment.belongsTo(User, { foreignKey: "userId", as: "user" }); // Кожен коментар належить користувачу

Movie.hasMany(Comment, { foreignKey: "movieId" }); // Фільм може мати багато коментарів
Comment.belongsTo(Movie, { foreignKey: "movieId" }); // Кожен коментар належить фільму

// Асоціації для лайків
User.hasMany(Like, { foreignKey: "userId" }); // Користувач може ставити багато лайків
Movie.hasMany(Like, { foreignKey: "movieId" }); // Фільм може мати багато лайків
Like.belongsTo(User, { foreignKey: "userId" }); // Кожен лайк належить користувачу
Like.belongsTo(Movie, { foreignKey: "movieId" }); // Кожен лайк належить фільму

// ======================
// Експорт моделей
// ======================
export { sequelize, User, Movie, Comment, Like };
