const API_BASE = "http://localhost:5000";

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem("atp_token");

  const res = await fetch(`${API_BASE}/${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "API error");
  }

  return res.json();
}
