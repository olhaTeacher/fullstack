import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MovieCard from "./MovieCard";
import { apiFetch } from "../Api.jsx";

export default function MovieDetails() {
  // --- Параметри маршруту ---
  const { id } = useParams(); // Отримуємо ID фільму з URL

  // --- Стан компоненту ---
  const [movie, setMovie] = useState(null); // Дані поточного фільму

  // --- Функція завантаження фільму ---
  async function load() {
    try {
      // Запит на бекенд для отримання деталей фільму за id
      const data = await apiFetch(`/movies/${id}`);
      setMovie(data); // Збереження даних у стан
    } catch (err) {
      console.error(err);
    }
  }

  // --- Використовуємо useEffect для завантаження при зміні ID ---
  useEffect(() => { load(); }, [id]);

  // --- Показ завантаження ---
  if (!movie) return <div>Loading...</div>;

  // --- Відображення MovieCard з можливістю оновлення ---
  return <MovieCard movie={movie} onUpdated={load} />;
}
