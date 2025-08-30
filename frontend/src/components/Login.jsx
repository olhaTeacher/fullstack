import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../Api.jsx";

export default function Login() {
  // --- Стан компоненту ---
  const [identifier, setIdentifier] = useState(""); // username або email
  const [password, setPassword] = useState("");     // пароль користувача
  const [err, setErr] = useState("");               // повідомлення про помилку
  const navigate = useNavigate();                   // хук для навігації після успішного логіну

  // --- Функція обробки сабміту форми ---
  async function submit(e) {
    e.preventDefault(); // зупиняємо стандартну поведінку форми

    try {
      // Відправка запиту на бекенд для логіну
      const data = await apiFetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }) // відправляємо username або email
      });

      // Зберігаємо токен та дані користувача у localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Перенаправлення на головну сторінку після успішного логіну
      navigate("/");
    } catch (err) {
      // Показ помилки користувачу
      setErr(err.message || "Error");
    }
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      <h3>Login</h3>

      {/* Відображення помилки */}
      {err && <div className="error">{err}</div>}

      {/* Поле для username або email */}
      <input
        value={identifier}
        onChange={e => setIdentifier(e.target.value)}
        placeholder="Username or Email"
      />

      {/* Поле для пароля */}
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
      />

      {/* Кнопка для сабміту форми */}
      <button type="submit">Login</button>
    </form>
  );
}
