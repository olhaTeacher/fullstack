// Імпорт типів даних Sequelize
import { DataTypes } from "sequelize";

// Експорт функції, яка створює модель Comment
export default (sequelize) => {
  // Визначення моделі Comment
  const Comment = sequelize.define(
    "Comment",
    {
      // Унікальний ідентифікатор коментаря, автоінкремент
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

      // Текст коментаря, обов'язкове поле
      text: { type: DataTypes.TEXT, allowNull: false },

      // Ідентифікатор користувача, який створив коментар
      userId: { type: DataTypes.INTEGER, allowNull: false },

      // Ідентифікатор фільму, до якого належить коментар
      movieId: { type: DataTypes.INTEGER, allowNull: false }
    },
    {
      timestamps: true,       // Додає createdAt та updatedAt
      tableName: "comments"   // Назва таблиці в базі даних
    }
  );

  // Встановлення зв'язку з моделлю User
  Comment.associate = (models) => {
    Comment.belongsTo(models.User, { foreignKey: "userId" });
  };

  return Comment;
};
