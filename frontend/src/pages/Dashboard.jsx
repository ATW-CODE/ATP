import React, { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { logout } from "../utils/auth";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    apiFetch("http://localhost:5000/users/me")
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error(err));
  }, []);

  if (!user) return <p>Loading user</p>

  return (
    <div style={{ padding: "40px" }}>
     <h2>Welcome, {user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>

      <button 
        onClick={logout}
        style={{
          marginTop: "20px",
          padding: "8px 16px",
          backgroundColor: "#ff4d4f",
          cursor: "pointer",
          border: "none",
          borderRadius: "4px",
          color: "Black",
        }}>
          logout
        </button>
    </div>
  );
}
