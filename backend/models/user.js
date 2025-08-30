// Імпорт типів даних Sequelize
import { DataTypes } from "sequelize";

// Експорт функції, яка створює модель User
export default (sequelize) => {
  return sequelize.define(
    "User",
    {
      // Унікальний ідентифікатор користувача, автоінкремент
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      // Логін користувача, обов'язкове поле, має бути унікальним
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },

      // Email користувача, обов'язкове поле, має бути унікальним та валідним email
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true
        }
      },

      // Хешований пароль користувача, обов'язкове поле
      password: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      timestamps: true,       // Додає поля createdAt та updatedAt
      tableName: "users"      // Назва таблиці в базі даних
    }
  );
};
