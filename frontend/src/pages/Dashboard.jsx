import React, { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { logout } from "../utils/auth";
import PrintJobs from "../components/PrintJobsTable";
import CreatePrintJob from "../components/CreatePrintJob";
import UploadFile from "../components/UploadFile";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [files, setFiles] = useState([]);

  const fetchJobs = async () => {
    const data = await apiFetch("print/jobs/mine");
    setJobs(data);
  };

  const fetchFiles = async () => {
    const data = await apiFetch("files/mine");
    setFiles(data);
  };

  useEffect(() => {
  const init = async () => {
    try {
      const me = await apiFetch("users/me");
      setUser(me);
      await fetchJobs();
      await fetchFiles();
    } catch (err) {
      console.error(err);
      if (err.message === "Unauthorized") {
        logout();
      }
    }
  };

  init();

  const interval = setInterval(fetchJobs, 5000);
  return () => clearInterval(interval);
}, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: "40px" }}>
      <h2>Welcome, {user.name}</h2>
      <p>{user.email}</p>

      <button onClick={logout}>Logout</button>

      <UploadFile onUpload={fetchFiles} />
      <CreatePrintJob 
        files={files}
        onJobCreated={fetchJobs} 
      />
      <PrintJobs jobs={jobs} />
    </div>
  );
}
