export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("atp_token");

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });

  // 🔴 Token expired or invalid
  if (res.status === 401) {
    localStorage.removeItem("atp_token");

    // Redirect to login
    window.location.href = "/login";
    throw new Error("Session expired");
  }

  return res;
}
