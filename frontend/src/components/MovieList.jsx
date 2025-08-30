import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../Api.jsx";

export default function MovieList() {
  // --- Стан компоненту ---
  const [movies, setMovies] = useState([]); // список фільмів
  const [loading, setLoading] = useState(true); // стан завантаження

  // --- Функція завантаження фільмів з бекенду ---
  async function load() {
    setLoading(true);
    try {
      const data = await apiFetch("/movies"); // отримання списку фільмів
      setMovies(data); // збереження даних у стані
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  // --- useEffect для завантаження при першому рендері ---
  useEffect(() => { load(); }, []);

  return (
    <div className="movie-list">
      <h2>Movies</h2>
      {loading ? (
        <div>Loading...</div> // показ повідомлення під час завантаження
      ) : (
        <div className="movie-grid">
          {movies.map(m => (
            <div key={m.id} className="movie-item">
              {m.posterPath && <img src={m.posterPath} alt={m.title} />}
              <h3>
                {/* Посилання на сторінку деталей фільму */}
                <Link to={`/movies/${m.id}`} className="movie-link">{m.title}</Link>
              </h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
