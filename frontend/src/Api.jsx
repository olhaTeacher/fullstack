const API_BASE = "http://localhost:4000/api";

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const res = await fetch(`http://localhost:4000/api${endpoint}`, { ...options, headers });
    const data = await res.json();
    if (!res.ok) throw data;
    return data;
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
}

