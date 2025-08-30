import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  // --- Хук для навігації ---
  const navigate = useNavigate();

  // --- Поточний користувач із localStorage ---
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // --- Функція виходу з системи ---
  function logout() {
    localStorage.removeItem("token"); // видаляємо JWT
    localStorage.removeItem("user");  // видаляємо дані користувача
    navigate("/login");               // перенаправлення на сторінку логіну
  }

  return (
    <nav className="nav">
      {/* Логотип, клік веде на головну сторінку */}
      <div className="logo" onClick={() => navigate("/")}>MovieApp</div>

      <div className="actions">
        {user ? (
          // Якщо користувач авторизований
          <>
            <span>{user.username}</span> {/* Показуємо ім'я користувача */}
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          // Якщо користувач не авторизований
          <>
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/register")}>Register</button>
          </>
        )}
      </div>
    </nav>
  );
}
