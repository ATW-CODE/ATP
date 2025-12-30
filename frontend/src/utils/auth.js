export function logout() {
  localStorage.removeItem("atp_token");
  window.location.href = "/login";
}
