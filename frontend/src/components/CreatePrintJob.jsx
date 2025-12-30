import React, { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

export default function CreatePrintJob({ onJobCreated }) {
  const [files, setFiles] = useState([]);
  const [fileId, setFileId] = useState("");
  const [copies, setCopies] = useState(1);
  const [color, setColor] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load user files (temporary approach)
  useEffect(() => {
    apiFetch("http://localhost:5000/files/mine")
      .then((res) => res.json())
      .then((data) => setFiles(data))
      .catch((err) => console.error("Failed to load files", err));
  }, []);

  const submitJob = async (e) => {
    e.preventDefault();

    if (!fileId) {
      alert("Please select a file");
      return;
    }

    setLoading(true);

    try {
      const res = await apiFetch("http://localhost:5000/print/jobs", {
        method: "POST",
        body: JSON.stringify({
          fileId,
          copies,
          color,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // 👇 Show backend message
        throw new Error(data.message || "Failed to create print job");
      }

      // Reset form
      setFileId("");
      setCopies(1);
      setColor(false);

      onJobCreated(); // refresh job list
    } catch (err) {
      console.error("Create print job error:", err);
      alert(err.message); // 👈 THIS is the key fix
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ marginTop: "30px" }}>
      <h3>Create Print Job</h3>

      <form onSubmit={submitJob}>
        <div>
          <label>File:</label>
          <select value={fileId} onChange={(e) => setFileId(e.target.value)}>
            <option value="">Select file</option>
            {files.map((file) => (
              <option key={file.id} value={file.id}>
                {file.original_filename}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Copies:</label>
          <input
            type="number"
            min="1"
            value={copies}
            onChange={(e) => setCopies(Number(e.target.value))}
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={color}
              onChange={(e) => setColor(e.target.checked)}
            />
            Color Print
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Create Job"}
        </button>
      </form>
    </div>
  );
}
