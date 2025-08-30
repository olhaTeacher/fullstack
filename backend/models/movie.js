// Імпорт типів даних Sequelize
import { DataTypes } from "sequelize";

// Експорт функції, яка створює модель Movie
export default (sequelize) => {
  return sequelize.define(
    "Movie",
    {
      // Унікальний ідентифікатор фільму, автоінкремент
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

      // Зовнішній ідентифікатор (наприклад, з TMDB)
      externalId: { type: DataTypes.STRING },

      // Назва фільму, обов'язкове поле
      title: { type: DataTypes.STRING, allowNull: false },

      // Опис фільму
      overview: { type: DataTypes.TEXT },

      // Посилання на постер фільму
      posterPath: { type: DataTypes.STRING }
    },
    {
      timestamps: true,       // Додає createdAt та updatedAt
      tableName: "movies"     // Назва таблиці в базі даних
    }
  );
};
