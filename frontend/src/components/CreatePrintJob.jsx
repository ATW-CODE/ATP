import React, { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";

export default function CreatePrintJob({ onJobCreated }) {
  const [files, setFiles] = useState([]);
  const [fileId, setFileId] = useState("");
  const [copies, setCopies] = useState(1);
  const [color, setColor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [printers, setPrinters] = useState([]);
  const [printerId, setPrinterId] = useState("");

  // Load user files (temporary approach)
  useEffect(() => {
    apiFetch("http://localhost:5000/files/mine")
      .then((res) => res.json())
      .then((data) => setFiles(data))
      .catch((err) => console.error("Failed to load files", err));
  }, []);

  // Load printers
  useEffect(() => {
    apiFetch("http://Localhost:5000/printers")
      .then(res => res.json())
      .then(setPrinters)
      .catch(err => console.error(err));
  }, []);

  const submitJob = async (e) => {
    e.preventDefault();

    if (!fileId) {
      alert("Please select a file");
      return;
    }

    if (!printerId) {
      alert("Please select a printer location");
      return;
    }

    setLoading(true);

    try {
      const res = await apiFetch("http://localhost:5000/print/jobs", {
        method: "POST",
        body: JSON.stringify({
          fileId,
          printerId,
          copies,
          color,
        }),
      });

      const data = await res.json();

      if (!res.ok) {      
        throw new Error(data.message || "Failed to create print job");
      }

      // Reset form
      setFileId("");
      setCopies(1);
      setColor(false);

      onJobCreated(); 
    } catch (err) {
      console.error("Create print job error:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ marginTop: "30px" }}>
      <h3>Create Print Job</h3>

      <form onSubmit={submitJob}>
        <div>
          <label>Printer:</label>
          <select
            value={printerId}
            onChange={(e) => setPrinterId(e.target.value)}
            required
          >
            <option value="">Select printer location</option>
            {printers.map(p => (
              <option
                key={p.id}
                value={p.id}
                disabled={p.status !== "online"}
              >
                {p.location_name} ({p.status})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>File:</label>
          <select value={fileId} onChange={(e) => setFileId(e.target.value)}
            required
            >
            <option value="">Select file</option>
            {Array.isArray(files) && files.map((file) => (
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
