import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Імпорт компонентів
import Navbar from "./components/Navbar";
import MovieList from "./components/MovieList";
import Login from "./components/Login";
import Register from "./components/Register";
import MovieDetails from "./components/MovieDetails";

export default function App() {
  // Отримуємо поточного користувача з localStorage
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div className="app">
      {/* Навігаційна панель */}
      <Navbar />

      <main className="container">
        {/* Налаштування маршрутів */}
        <Routes>
          {/* Головна сторінка зі списком фільмів */}
          <Route path="/" element={<MovieList />} />

          {/* Сторінка деталей фільму за ID */}
          <Route path="/movies/:id" element={<MovieDetails />} />

          {/* Сторінка логіну, перенаправлення на "/" якщо користувач вже авторизований */}
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />

          {/* Сторінка реєстрації, перенаправлення на "/login" якщо користувач уже авторизований */}
          <Route path="/register" element={user ? <Navigate to="/login" /> : <Register />} />

          {/* Будь-який невідомий маршрут перенаправляє на головну */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}
