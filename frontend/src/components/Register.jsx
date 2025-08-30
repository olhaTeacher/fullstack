import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../Api.jsx";

export default function Register() {
  // --- Стани для форми ---
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(""); // повідомлення про помилки
  const navigate = useNavigate(); // хук для навігації

  // --- Функція валідації форми ---
  function validateForm() {
    if (!username.trim() || !email.trim() || !password.trim()) {
      return "All fields are required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email format";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters";
    }
    return null;
  }

  // --- Відправка форми ---
  async function submit(e) {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setErr(validationError);
      return;
    }

    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
        headers: { "Content-Type": "application/json" }
      });
      // Після успішної реєстрації переходимо на логін
      navigate("/login");
    } catch (err) {
      setErr(err.message || "Error");
    }
  }

  return (
    <form className="auth-form" onSubmit={submit}>
      <h3>Register</h3>
      {err && <div className="error">{err}</div>}

      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Register</button>
    </form>
  );
}
