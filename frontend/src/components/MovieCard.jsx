import React, { useState } from "react";
import { apiFetch } from "../Api.jsx";

export default function MovieCard({ movie, onUpdated }) {
  // --- Стан компоненту ---
  const [comment, setComment] = useState("");         // Текст нового коментаря
  const [editingId, setEditingId] = useState(null);   // ID коментаря, який редагується
  const [editingText, setEditingText] = useState(""); // Текст редагованого коментаря
  const user = JSON.parse(localStorage.getItem("user") || "null"); // Поточний користувач

  // --- Лайк/Дизлайк ---
  async function sendLike(type) {
    try {
      await apiFetch(`/movies/${movie.id}/like`, {
        method: "POST",
        body: JSON.stringify({ type })
      });
      onUpdated && onUpdated(); // Оновлення даних після зміни лайку
    } catch (err) {
      alert(err.message || "Error");
    }
  }

  // --- Додавання нового коментаря ---
  async function sendComment(e) {
    e.preventDefault();
    if (!comment) return;
    try {
      await apiFetch(`/movies/${movie.id}/comment`, {
        method: "POST",
        body: JSON.stringify({ text: comment })
      });
      setComment("");
      onUpdated && onUpdated();
    } catch (err) {
      alert(err.message || "Error");
    }
  }

  // --- Оновлення коментаря ---
  async function updateComment(id) {
    if (!editingText.trim()) {
      setEditingId(null);
      return;
    }
    try {
      await apiFetch(`/comments/${id}`, {
        method: "PUT",
        body: JSON.stringify({ text: editingText })
      });
      setEditingId(null);
      setEditingText("");
      onUpdated && onUpdated();
    } catch (err) {
      alert(err.message || "Error");
    }
  }

  // --- Видалення коментаря ---
  async function deleteComment(id) {
    if (!window.confirm("Delete comment?")) return;
    try {
      await apiFetch(`/comments/${id}`, { method: "DELETE" });
      onUpdated && onUpdated();
    } catch (err) {
      alert(err.message || "Error");
    }
  }

  return (
    <div className="movie-card">
      {/* Показ постера фільму */}
      {movie.posterPath ? (
        <img src={movie.posterPath} alt={movie.title} />
      ) : (
        <div className="poster-placeholder">No image</div>
      )}

      <div className="info">
        <h3>{movie.title}</h3>

        {/* Статистика фільму: лайки, дизлайки, кількість коментарів */}
        <div className="movie-stats">
            👍: {movie.likes ?? 0} 👎: {movie.dislikes ?? 0} <br />
            коментарів: {movie.commentsCount ?? (movie.comments?.length || 0)}
        </div>

        {movie.overview && <p>{movie.overview}</p>}

        {/* Кнопки лайк/дизлайк */}
        <div className="actions">
          <button onClick={() => sendLike("like")}>👍 {movie.likes ?? 0}</button>
          <button onClick={() => sendLike("dislike")}>👎 {movie.dislikes ?? 0}</button>
        </div>

        {/* Розділ коментарів */}
        <div className="comments-section">
          <h4>Comments: </h4>
          {movie.comments?.length > 0 ? (
            movie.comments.map(c => (
              <div key={c.id} className="comment">
                <div className="comment-text">
                  <div>
                  {/* Ім'я користувача */}
                  <div className="comment-meta user-name">
                    {c.user?.username || "anonymous"} 
                  </div>

                  {/* Редагування по кліку на текст */}
                  {editingId === c.id ? (
                    <input
                      autoFocus
                      value={editingText}
                      onChange={e => setEditingText(e.target.value)}
                      onBlur={() => updateComment(c.id)} 
                      onKeyDown={e => {
                        if (e.key === "Enter") updateComment(c.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                    />
                  ) : (
                    <span
                      onClick={() => {
                        if (user && user.id === c.user?.id) {
                          setEditingId(c.id);
                          setEditingText(c.text);
                        }
                      }}
                      style={{
                        cursor: user && user.id === c.user?.id ? "pointer" : "default"
                      }}
                    >
                      {c.text}
                    </span>
                  )}
                </div>

                {/* Дата коментаря */}
                <div className="comment-meta">
                  {new Date(c.createdAt).toLocaleString()}
                </div>
                  </div>
                {/* Кнопка видалення для власного коментаря */}
                {user && user.id === c.user?.id && (
                  <div className="comment-actions">
                    <button onClick={() => deleteComment(c.id)}>❌</button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div>No comments</div>
          )}

          {/* Форма додавання коментаря */}
          {user ? (
            <form onSubmit={sendComment} className="comment-form">
              <input
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Write comment..."
              />
              <button type="submit">Send</button>
            </form>
          ) : (
            <div className="login-hint">Login to comment</div>
          )}
        </div>
      </div>
    </div>
  );
}
