import React, { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { logout } from "../utils/auth";
import PrintJobs from "../components/PrintJobs";
import CreatePrintJob from "../components/CreatePrintJob";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    apiFetch("http://localhost:5000/users/me")
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: "40px" }}>
      <h2>Welcome, {user.name}</h2>
      <p>Email: {user.email}</p>

      <button onClick={logout}>Logout</button>

      <CreatePrintJob onJobCreated={() => setRefreshKey((k) => k + 1)} />
      <PrintJobs key={refreshKey} />
    </div>
  );
}
