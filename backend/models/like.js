// Імпорт типів даних Sequelize
import { DataTypes } from "sequelize";

// Експорт функції, яка створює модель Like
export default (sequelize) => {
  return sequelize.define(
    "Like",
    {
      // Унікальний ідентифікатор лайку/дизлайку, автоінкремент
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

      // Тип реакції: "like" або "dislike", обов'язкове поле
      type: { type: DataTypes.ENUM("like", "dislike"), allowNull: false },

      // Ідентифікатор користувача, який поставив лайк/дизлайк
      userId: { type: DataTypes.INTEGER, allowNull: false },

      // Ідентифікатор фільму, до якого належить лайк/дизлайк
      movieId: { type: DataTypes.INTEGER, allowNull: false }
    },
    {
      timestamps: true,       // Додає createdAt та updatedAt
      tableName: "likes"      // Назва таблиці в базі даних
    }
  );
};
